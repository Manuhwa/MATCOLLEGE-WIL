import { useOfflineSync } from '~/composables/useOfflineSync'

export default defineNuxtPlugin(() => {
  const { refreshPendingCount, syncQueue } = useOfflineSync()

  refreshPendingCount()
  syncQueue()

  window.addEventListener('online', () => {
    syncQueue()
  })

  // Safety net in case the 'online' event doesn't fire (some mobile browsers)
  setInterval(() => {
    if (navigator.onLine) syncQueue()
  }, 60_000)
})
