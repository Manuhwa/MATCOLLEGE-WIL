import { ref, computed } from 'vue'

// Shared (singleton) state - the browser only fires 'beforeinstallprompt' once,
// so capture it as early as possible and let any component react to it.
const deferredPrompt = ref(null)
const isInstalled = ref(false)
let listenerAttached = false

const attachListeners = () => {
  if (!process.client || listenerAttached) return
  listenerAttached = true

  if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
    isInstalled.value = true
  }

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt.value = e
  })

  window.addEventListener('appinstalled', () => {
    deferredPrompt.value = null
    isInstalled.value = true
  })
}

export const useInstallPrompt = () => {
  attachListeners()

  const canInstall = computed(() => !!deferredPrompt.value && !isInstalled.value)

  const promptInstall = async () => {
    const promptEvent = deferredPrompt.value
    if (!promptEvent) return null
    promptEvent.prompt()
    const choice = await promptEvent.userChoice
    deferredPrompt.value = null
    return choice.outcome
  }

  return { canInstall, isInstalled, promptInstall }
}
