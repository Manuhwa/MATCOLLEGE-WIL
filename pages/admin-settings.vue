<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between gap-2 flex-wrap">
          <div>
            <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Assessment Settings</h1>
            <p class="text-gray-600 mt-2">Configure point values for assessment categories</p>
          </div>
          <NuxtLink
            to="/admin"
            class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <i class="pi pi-arrow-left mr-2"></i>
            Back to Admin
          </NuxtLink>
        </div>
      </div>

      <!-- Students CSV Import (Superadmin only) -->
      <div class="bg-white rounded-xl shadow-sm border p-6">
        <div class="flex items-center justify-between mb-6 gap-2 flex-wrap">
          <h2 class="text-xl font-semibold text-gray-900">Import Students (CSV)</h2>
          <label v-if="isSuperadmin" class="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
            <i class="pi pi-upload mr-2"></i> Import CSV
            <input type="file" accept=".csv" class="hidden" @change="onImportStudentsCsv" />
          </label>
          <span v-else class="text-sm text-gray-500">Superadmin only</span>
        </div>
        <div v-if="csvImportSummary" class="bg-gray-50 border border-gray-200 rounded p-4 text-sm text-gray-700">
          <div class="font-medium mb-1">Import Summary</div>
          <div class="flex items-center gap-4 flex-wrap">
            <div>Created: {{ csvImportSummary.created }}, Updated: {{ csvImportSummary.updated }}, Errors: {{ csvImportSummary.errors }}</div>
            <button 
              v-if="csvImportSummary.errors > 0" 
              @click="showErrorDetails = true"
              class="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              View Error Details
            </button>
          </div>
        </div>
      </div>

      <!-- Settings Form -->
      <div class="bg-white rounded-xl shadow-sm border p-6 mt-6">
        <form @submit.prevent="handleSaveSettings" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Preparation & Scheming -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">
                Preparation & Scheming
              </label>
              <div class="flex items-center gap-2 flex-wrap">
                <input
                  v-model.number="settings.preparationMax"
                  type="number"
                  min="0"
                  max="100"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="20"
                />
                <span class="text-sm text-gray-500">pts</span>
              </div>
            </div>

            <!-- Lesson Planning -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">
                Lesson Planning
              </label>
              <div class="flex items-center gap-2 flex-wrap">
                <input
                  v-model.number="settings.lessonPlanningMax"
                  type="number"
                  min="0"
                  max="100"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="20"
                />
                <span class="text-sm text-gray-500">pts</span>
              </div>
            </div>

            <!-- Environment & Management -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">
                Environment & Management
              </label>
              <div class="flex items-center gap-2 flex-wrap">
                <input
                  v-model.number="settings.environmentMax"
                  type="number"
                  min="0"
                  max="100"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="10"
                />
                <span class="text-sm text-gray-500">pts</span>
              </div>
            </div>

            <!-- Learning Documents -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">
                Learning Documents
              </label>
              <div class="flex items-center gap-2 flex-wrap">
                <input
                  v-model.number="settings.documentsMax"
                  type="number"
                  min="0"
                  max="100"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="10"
                />
                <span class="text-sm text-gray-500">pts</span>
              </div>
            </div>

            <!-- Lesson Introduction -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">
                Lesson Introduction
              </label>
              <div class="flex items-center gap-2 flex-wrap">
                <input
                  v-model.number="settings.introductionMax"
                  type="number"
                  min="0"
                  max="100"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="3"
                />
                <span class="text-sm text-gray-500">pts</span>
              </div>
            </div>

            <!-- Lesson Development -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">
                Lesson Development
              </label>
              <div class="flex items-center gap-2 flex-wrap">
                <input
                  v-model.number="settings.developmentMax"
                  type="number"
                  min="0"
                  max="100"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="30"
                />
                <span class="text-sm text-gray-500">pts</span>
              </div>
            </div>

            <!-- Lesson Conclusion -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">
                Lesson Conclusion
              </label>
              <div class="flex items-center gap-2 flex-wrap">
                <input
                  v-model.number="settings.conclusionMax"
                  type="number"
                  min="0"
                  max="100"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="3"
                />
                <span class="text-sm text-gray-500">pts</span>
              </div>
            </div>

            <!-- Personal Dimensions -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">
                Personal Dimensions
              </label>
              <div class="flex items-center gap-2 flex-wrap">
                <input
                  v-model.number="settings.personalDimensionsMax"
                  type="number"
                  min="0"
                  max="100"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="4"
                />
                <span class="text-sm text-gray-500">pts</span>
              </div>
            </div>
          </div>

          <!-- Total Points Display -->
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div class="flex items-center justify-between gap-2 flex-wrap">
              <span class="text-lg font-semibold text-blue-900">Total Points:</span>
              <span class="text-2xl font-bold text-blue-600">{{ totalPoints }} pts</span>
            </div>
            <div v-if="totalPoints !== 100" class="mt-2 text-sm text-blue-700">
              <i class="pi pi-info-circle mr-1"></i>
              {{ totalPoints > 100 ? 'Total exceeds 100 points' : 'Total is less than 100 points' }}
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end gap-4 flex-wrap">
            <button
              type="button"
              @click="handleResetToDefault"
              class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Reset to Default
            </button>
            <button
              type="submit"
              :disabled="loading || totalPoints !== 100"
              class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <i v-if="loading" class="pi pi-spinner pi-spin mr-2"></i>
              <i v-else class="pi pi-save mr-2"></i>
              {{ loading ? 'Saving...' : 'Save Settings' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Error Details Modal -->
    <div v-if="showErrorDetails" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center p-4">
      <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-4 gap-2 flex-wrap">
          <h2 class="text-xl font-semibold text-gray-900">Import Error Details</h2>
          <button @click="showErrorDetails = false" class="text-gray-400 hover:text-gray-600">
            <i class="pi pi-times text-xl"></i>
          </button>
        </div>
        
        <div class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div class="text-red-800 font-medium">
            {{ csvImportSummary.message }}
          </div>
          <div class="text-red-600 text-sm mt-1">
            Total rows: {{ csvImportSummary.total }}, Errors: {{ csvImportSummary.errors }}
          </div>
        </div>

        <div class="space-y-2 max-h-96 overflow-y-auto">
          <div 
            v-for="result in csvImportSummary.results.filter(r => r.status === 'error')" 
            :key="result.row"
            class="p-3 bg-red-50 border border-red-200 rounded-lg"
          >
            <div class="flex justify-between items-start gap-2 flex-wrap">
              <div class="flex-1">
                <div class="font-medium text-red-800">Row {{ result.row }}</div>
                <div class="text-red-600 text-sm mt-1">{{ result.error }}</div>
                <div v-if="result.candidateNo" class="text-red-500 text-xs mt-1">
                  Candidate Number: {{ result.candidateNo }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-6 flex justify-end">
          <button 
            @click="showErrorDetails = false"
            class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

definePageMeta({
  middleware: 'superadmin-auth'
})

const loading = ref(false)
const role = useCookie('role')
const isSuperadmin = computed(() => role.value === 'superadmin')
const csvImportSummary = ref(null)
const showErrorDetails = ref(false)

const onImportStudentsCsv = async (e) => {
  const file = e.target.files?.[0]
  if (!file) return
  loading.value = true
  csvImportSummary.value = null
  try {
    const form = new FormData()
    form.append('file', file)
    const result = await $fetch('/api/students/import-csv', { method: 'POST', body: form })
    csvImportSummary.value = result
    if (result.errors > 0) {
      alert(`Students import completed with ${result.errors} errors. Click "View Error Details" to see specific issues.`)
    } else {
      alert(`Students import successful! Created: ${result.created}, Updated: ${result.updated}`)
    }
  } catch (err) {
    console.error('Students import failed', err)
    const errorMessage = err.data?.statusMessage || err.message || 'Please verify the CSV format and try again.'
    alert(`Import failed: ${errorMessage}`)
  } finally {
    loading.value = false
    e.target.value = ''
  }
}



const { settings, loadSettings, saveSettings, totalPoints, resetToDefault } = useAssessmentSettings()

// Load settings from localStorage or use defaults
onMounted(() => {
  loadSettings()
})



// Save settings
const handleSaveSettings = async () => {
  if (totalPoints.value !== 100) {
    alert('Total points must equal 100')
    return
  }

  loading.value = true
  try {
    saveSettings(settings.value)
    alert('Settings saved successfully!')
  } catch (error) {
    console.error('Error saving settings:', error)
    alert('Error saving settings')
  } finally {
    loading.value = false
  }
}

// Reset to default values
const handleResetToDefault = () => {
  if (confirm('Are you sure you want to reset to default values?')) {
    resetToDefault()
  }
}
</script> 