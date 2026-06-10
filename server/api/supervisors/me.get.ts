import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const role = getCookie(event, 'role')
    if (role !== 'supervisor') {
      throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
    }
    const supervisorIdCookie = getCookie(event, 'supervisorId')
    const supervisorId = supervisorIdCookie ? parseInt(String(supervisorIdCookie)) : null
    if (!supervisorId) {
      throw createError({ statusCode: 400, statusMessage: 'Missing supervisor context' })
    }
    const supervisor = await prisma.supervisor.findUnique({ where: { id: supervisorId }, include: { district: true } })
    if (!supervisor) {
      throw createError({ statusCode: 404, statusMessage: 'Supervisor not found' })
    }
    return { supervisor: { id: supervisor.id, fullName: supervisor.fullName, email: supervisor.email, nationalId: supervisor.nationalId, phoneNumber: supervisor.phoneNumber, districtId: supervisor.districtId || null, districtName: supervisor.district?.name || null } }
  } catch (error) {
    if ((error as any)?.statusCode) throw error
    console.error('Fetch current supervisor failed:', error)
    throw createError({ statusCode: 500, statusMessage: 'Failed to fetch supervisor' })
  }
})



