import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'

const prisma = new PrismaClient()

const normalizeId = (value: string) => String(value || '').replace(/[^a-z0-9]/gi, '').toUpperCase()

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const identifier = String(body.nationalId || body.email || '').trim()
    const pin = String(body.pin || '').trim()

    if (!identifier || !pin) {
      throw createError({ statusCode: 400, statusMessage: 'nationalId and pin required' })
    }

    const nationalId = normalizeId(identifier)
    const email = identifier.toLowerCase()

    let supervisor = await prisma.supervisor.findFirst({
      where: {
        OR: [
          { email },
          { nationalId: identifier },
          { nationalId }
        ]
      }
    })

    // Seed and imported IDs may include hyphens; compare a normalized form as a last pass
    if (!supervisor && nationalId) {
      const candidates = await prisma.supervisor.findMany({
        select: { id: true, nationalId: true, email: true, pinHash: true, phoneNumber: true, fullName: true }
      })
      supervisor = candidates.find((s) => normalizeId(s.nationalId) === nationalId) || null
    }

    if (!supervisor) {
      throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })
    }

    const sha256 = (s: string) => crypto.createHash('sha256').update(s).digest('hex')
    const providedHash = sha256(pin)
    let valid = false
    if (supervisor.pinHash) {
      valid = supervisor.pinHash === providedHash
    } else {
      const phone = supervisor.phoneNumber || ''
      const last4 = phone.replace(/\D/g, '').slice(-4)
      valid = !!last4 && last4 === pin
    }
    if (!valid) {
      throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })
    }

    // Set role and supervisor id cookies
    setCookie(event, 'role', 'supervisor', { httpOnly: false, sameSite: 'lax', path: '/' })
    setCookie(event, 'supervisorId', String(supervisor.id), { httpOnly: false, sameSite: 'lax', path: '/' })

    return { ok: true, supervisor: { id: supervisor.id, fullName: supervisor.fullName } }
  } catch (error) {
    if ((error as any)?.statusCode) throw error
    console.error('Supervisor login failed:', error)
    throw createError({ statusCode: 500, statusMessage: 'Login failed' })
  }
})

