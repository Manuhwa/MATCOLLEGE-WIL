import { ref } from 'vue'
import { useOfflineQueue } from './useOfflineQueue'

// Shared (singleton) state so the pending count/badge stays in sync across pages
const pendingCount = ref(0)
const syncing = ref(false)
const lastSyncError = ref('')

const refreshPendingCount = async () => {
  if (!process.client) return
  const { getQueueCount } = useOfflineQueue()
  pendingCount.value = await getQueueCount()
}

// Resolve (or create) the student for a queued entry, mirroring the
// online "ensureStudent" logic from the assessment form.
const ensureStudentForEntry = async (entry) => {
  if (entry.selectedStudentId) return entry.selectedStudentId
  const candidateNo = entry.student?.candidateNo || ''
  const res = await $fetch(`/api/students/search?candidateNo=${encodeURIComponent(candidateNo)}`)
  const found = (res.students || [])[0]
  if (found) return found.id
  const created = await $fetch('/api/students', { method: 'POST', body: entry.student })
  return created.student.id
}

// Confirm the logged-in supervisor session is still valid.
const ensureSupervisorForEntry = async () => {
  const me = await $fetch('/api/supervisors/me')
  if (!me?.supervisor?.id) throw new Error('Supervisor session missing. Please log in again.')
  return me.supervisor.id
}

const syncEntry = async (entry, removeFromQueue) => {
  await ensureSupervisorForEntry()
  const studentId = await ensureStudentForEntry(entry)

  await $fetch('/api/assessments', {
    method: 'POST',
    body: {
      ...entry.formData,
      studentId,
      formType: entry.assessmentType,
      signatureData: entry.signatureData,
      clientUuid: entry.clientUuid
    }
  })

  await removeFromQueue(entry.clientUuid)
}

export const useOfflineSync = () => {
  const { getQueue, removeFromQueue } = useOfflineQueue()

  // Process every queued assessment, stopping early if we appear to be offline.
  const syncQueue = async () => {
    if (!process.client) return { synced: 0, failed: 0, remaining: 0 }
    if (typeof navigator !== 'undefined' && !navigator.onLine) return { synced: 0, failed: 0, remaining: pendingCount.value }
    if (syncing.value) return { synced: 0, failed: 0, remaining: pendingCount.value }

    syncing.value = true
    lastSyncError.value = ''
    let synced = 0
    let failed = 0
    try {
      const queue = await getQueue()
      for (const entry of queue) {
        try {
          await syncEntry(entry, removeFromQueue)
          synced++
        } catch (e) {
          failed++
          lastSyncError.value = e?.data?.statusMessage || e?.message || 'Sync failed'
          // Stop on the first failure - likely offline again or auth expired,
          // remaining entries will be retried on the next sync attempt.
          break
        }
      }
    } finally {
      await refreshPendingCount()
      syncing.value = false
    }
    return { synced, failed, remaining: pendingCount.value }
  }

  return {
    pendingCount,
    syncing,
    lastSyncError,
    refreshPendingCount,
    syncQueue
  }
}
