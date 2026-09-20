import { useOfflineSync } from '~/composables/useOfflineSync'
import { useOfflineStudents } from '~/composables/useOfflineStudents'

export default defineNuxtPlugin(() => {
  const { refreshPendingCount, syncQueue } = useOfflineSync()
  const { syncStudentsFromServer } = useOfflineStudents()

  refreshPendingCount()
  syncQueue()
  
  // Sync students for offline search on initial load
  syncStudentsFromServer()

  window.addEventListener('online', () => {
    syncQueue()
    // Also sync students when coming back online
    syncStudentsFromServer()
  })

  // Safety net in case the 'online' event doesn't fire (some mobile browsers)
  setInterval(() => {
    if (navigator.onLine) {
      syncQueue()
      // Periodically sync students in the background when online
      syncStudentsFromServer()
    }
  }, 60_000)
})
