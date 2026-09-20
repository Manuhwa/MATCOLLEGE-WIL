// IndexedDB-backed cache for students to enable offline search.
// Populated when online so supervisors can find students when offline.

const DB_NAME = 'madziwa-offline'
const DB_VERSION = 2 // Incremented to add students store
const STUDENTS_STORE = 'cached-students'
const ASSESSMENTS_STORE = 'pending-assessments'

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
        if (!db.objectStoreNames.contains(ASSESSMENTS_STORE)) {
          db.createObjectStore(ASSESSMENTS_STORE, { keyPath: 'clientUuid' })
        }
        
        // Create cached-students store (new in v2)
        if (oldVersion < 2 && !db.objectStoreNames.contains(STUDENTS_STORE)) {
          const studentsStore = db.createObjectStore(STUDENTS_STORE, { keyPath: 'id' })
          // Index for searching by candidateNo and fullName
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

const withStore = async (storeName, mode, callback) => {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, mode)
    const store = tx.objectStore(storeName)
    const result = callback(store)
    tx.oncomplete = () => resolve(result)
    tx.onerror = () => reject(tx.error)
  })
}

export const useOfflineStudents = () => {
  /**
   * Cache students in IndexedDB. Typically called when online to prepare for offline use.
   * @param {Array} students - Array of student objects to cache
   */
  const cacheStudents = async (students) => {
    if (!process.client) return
    const now = new Date().toISOString()
    await withStore(STUDENTS_STORE, 'readwrite', (store) => {
      for (const student of students) {
        store.put({ ...student, lastSynced: now })
      }
    })
  }

  /**
   * Search cached students by candidateNo or fullName (surname).
   * Returns matches from IndexedDB for offline use.
   * @param {Object} params - Search parameters
   * @param {string} params.candidateNo - Candidate number to search for
   * @param {string} params.surname - Surname/fullName to search for
   * @returns {Promise<Array>} - Array of matching students
   */
  const searchCachedStudents = async ({ candidateNo = '', surname = '' }) => {
    if (!process.client) return []
    
    try {
      const db = await openDb()
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STUDENTS_STORE, 'readonly')
        const store = tx.objectStore(STUDENTS_STORE)
        const request = store.getAll()
        
        request.onsuccess = () => {
          const allStudents = request.result || []
          
          // Filter students based on search criteria
          const results = allStudents.filter(student => {
            if (candidateNo && student.candidateNo) {
              const matches = student.candidateNo.toLowerCase().includes(candidateNo.toLowerCase())
              if (matches) return true
            }
            if (surname && student.fullName) {
              const matches = student.fullName.toLowerCase().includes(surname.toLowerCase())
              if (matches) return true
            }
            return false
          })
          
          resolve(results)
        }
        
        request.onerror = () => reject(request.error)
      })
    } catch (e) {
      console.error('Failed to search cached students:', e)
      return []
    }
  }

  /**
   * Get all cached students.
   * @returns {Promise<Array>} - Array of all cached students
   */
  const getAllCachedStudents = async () => {
    if (!process.client) return []
    
    try {
      return new Promise((resolve, reject) => {
        withStore(STUDENTS_STORE, 'readonly', (store) => {
          const request = store.getAll()
          request.onsuccess = () => resolve(request.result || [])
          request.onerror = () => reject(request.error)
        }).catch(reject)
      })
    } catch (e) {
      console.error('Failed to get cached students:', e)
      return []
    }
  }

  /**
   * Clear all cached students (e.g., on logout or explicit user action).
   */
  const clearCachedStudents = async () => {
    if (!process.client) return
    await withStore(STUDENTS_STORE, 'readwrite', (store) => {
      store.clear()
    })
  }

  /**
   * Sync students from the server and cache them for offline use.
   * This should be called periodically when online.
   */
  const syncStudentsFromServer = async () => {
    if (!process.client) return { synced: 0, error: null }
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      return { synced: 0, error: 'Device is offline' }
    }

    try {
      // Fetch all accessible students (respects supervisor's district assignments)
      const res = await $fetch('/api/students')
      const students = res.students || []
      
      if (students.length > 0) {
        await cacheStudents(students)
      }
      
      return { synced: students.length, error: null }
    } catch (e) {
      console.error('Failed to sync students from server:', e)
      return { synced: 0, error: e.message || 'Sync failed' }
    }
  }

  return {
    cacheStudents,
    searchCachedStudents,
    getAllCachedStudents,
    clearCachedStudents,
    syncStudentsFromServer
  }
}
