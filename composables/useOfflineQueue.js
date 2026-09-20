// IndexedDB-backed queue for assessments created while offline.
// Each entry stores everything needed to resubmit the assessment later:
// supervisor info, student info/selection, the form payload, assessment type
// and a clientUuid used for idempotent sync.

const DB_NAME = 'madziwa-offline'
const DB_VERSION = 2 // Incremented to support students cache
const STORE_NAME = 'pending-assessments'
const STUDENTS_STORE = 'cached-students'

let dbPromise = null

const openDb = () => {
  if (!process.client) return Promise.reject(new Error('IndexedDB unavailable on server'))
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)
      request.onupgradeneeded = (event) => {
        const db = request.result
        const oldVersion = event.oldVersion
        
        // Create pending-assessments store if it doesn't exist (from v1)
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'clientUuid' })
        }
        
        // Create cached-students store (new in v2)
        if (oldVersion < 2 && !db.objectStoreNames.contains(STUDENTS_STORE)) {
          const studentsStore = db.createObjectStore(STUDENTS_STORE, { keyPath: 'id' })
          studentsStore.createIndex('candidateNo', 'candidateNo', { unique: false })
          studentsStore.createIndex('fullName', 'fullName', { unique: false })
          studentsStore.createIndex('lastSynced', 'lastSynced', { unique: false })
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
