// IndexedDB-backed queue for assessments created while offline.
// Each entry stores everything needed to resubmit the assessment later:
// supervisor info, student info/selection, the form payload, assessment type
// and a clientUuid used for idempotent sync.

const DB_NAME = 'madziwa-offline'
const DB_VERSION = 1
const STORE_NAME = 'pending-assessments'

let dbPromise = null

const openDb = () => {
  if (!process.client) return Promise.reject(new Error('IndexedDB unavailable on server'))
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)
      request.onupgradeneeded = () => {
        const db = request.result
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'clientUuid' })
        }
      }
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }
  return dbPromise
}

const withStore = async (mode, callback) => {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, mode)
    const store = tx.objectStore(STORE_NAME)
    const result = callback(store)
    tx.oncomplete = () => resolve(result)
    tx.onerror = () => reject(tx.error)
  })
}

export const useOfflineQueue = () => {
  const addToQueue = async (entry) => {
    const record = { ...entry, queuedAt: entry.queuedAt || new Date().toISOString() }
    await withStore('readwrite', (store) => store.put(record))
    return record
  }

  const getQueue = async () => {
    if (!process.client) return []
    return new Promise((resolve, reject) => {
      withStore('readonly', (store) => {
        const request = store.getAll()
        request.onsuccess = () => resolve(request.result || [])
        request.onerror = () => reject(request.error)
      }).catch(reject)
    })
  }

  const removeFromQueue = async (clientUuid) => {
    await withStore('readwrite', (store) => store.delete(clientUuid))
  }

  const getQueueCount = async () => {
    const items = await getQueue()
    return items.length
  }

  return { addToQueue, getQueue, removeFromQueue, getQueueCount }
}
