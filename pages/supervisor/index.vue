<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header Section -->
      <div class="mb-8">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <!-- Title -->
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Supervisor Dashboard</h1>
            <p class="text-gray-600 mt-1">Your assessments and quick actions</p>
          </div>
          
          <!-- Actions -->
          <div class="flex flex-wrap items-center gap-3">
            <!-- Install App Button -->
            <button
              v-if="canInstall"
              @click="installApp"
              class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg inline-flex items-center"
              title="Install this app for offline access"
            >
              <i class="pi pi-download mr-2"></i>Install App
            </button>

            <!-- Refresh Button -->
            <button
              @click="refreshData"
              class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg inline-flex items-center"
              :disabled="loading"
            >
              <i class="pi pi-refresh mr-2" :class="{ 'pi-spin': loading }"></i>
              Refresh
            </button>
            
            <!-- New Assessment Button -->
            <NuxtLink to="/assessment" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 inline-flex items-center">
              <i class="pi pi-plus mr-2"></i>New Assessment
            </NuxtLink>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900">Your Assessments</h3>
          <span class="text-sm text-gray-500">{{ assessments.length }} total</span>
        </div>
        <div v-if="loading" class="p-6 text-gray-600">Loading…</div>
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="a in assessments" :key="a.id" class="hover:bg-gray-50">
                <td class="px-6 py-4">
                  <div class="text-sm font-medium text-gray-900">{{ a.student.fullName }}</div>
                  <div class="text-sm text-gray-500">{{ a.student.candidateNo }}</div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm font-medium text-gray-900">{{ a.subject }}</div>
                  <div class="text-sm text-gray-500">{{ a.topic }}</div>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center">
                    <div class="text-sm font-medium text-gray-900">{{ a.totalMark }}/100</div>
                    <div class="ml-2">
                      <div class="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          class="h-2 rounded-full"
                          :class="getScoreColorClass(a.totalMark)"
                          :style="{ width: a.totalMark + '%' }"
                        ></div>
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 text-sm text-gray-500">{{ formatDate(a.assessmentDate) }}</td>
                <td class="px-6 py-4 text-sm">
                  <div class="flex items-center space-x-2">
                    <button 
                      @click="viewAssessment(a)"
                      class="text-blue-600 hover:text-blue-900"
                      title="View"
                    >
                      <i class="pi pi-eye"></i>
                    </button>
                    <button 
                      @click="downloadAssessmentPDF(a)"
                      class="text-green-600 hover:text-green-900"
                      :disabled="loading"
                      title="Download PDF"
                    >
                      <i class="pi pi-download"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div v-if="!assessments.length" class="p-6 text-gray-600">No assessments yet.</div>
        </div>
      </div>

      <AssessmentDetailModal 
        v-if="showDetailModal"
        :assessment="selectedAssessment"
        @close="showDetailModal = false"
        @download="downloadAssessmentPDF"
      />
    </div>
  </div>
  
  <!-- Loading Overlay -->
  <div v-if="loading" class="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-4 flex items-center space-x-3">
      <i class="pi pi-spin pi-spinner text-blue-600 text-xl"></i>
      <span class="text-gray-700">Processing...</span>
    </div>
  </div>
</template>

<script setup>
import { useInstallPrompt } from '~/composables/useInstallPrompt'

definePageMeta({ middleware: 'supervisor-auth' })

const { canInstall, promptInstall } = useInstallPrompt()
const installApp = () => promptInstall()

const loading = ref(false)
const assessments = ref([])
const showDetailModal = ref(false)
const selectedAssessment = ref(null)

const fetchMine = async () => {
  loading.value = true
  try {
    const res = await $fetch('/api/assessments/by-supervisor')
    assessments.value = (res.assessments || []).map(a => ({
      ...a,
      totalMark: a.totalMark ?? (() => {
        // Debug: Log assessment data for ECD assessments
        if (a.formType === 'ecd') {
          console.log('ECD Assessment Data:', {
            formType: a.formType,
            preparationMark: a.preparationMark,
            lessonPlanningMark: a.lessonPlanningMark,
            personalDimensionsMark: a.personalDimensionsMark,
            documentsMark: a.documentsMark,
            environmentMark: a.environmentMark,
            communityMark: a.communityMark,
            conclusionMark: a.conclusionMark,
            total: a.preparationMark + a.lessonPlanningMark + a.personalDimensionsMark + a.documentsMark + a.environmentMark + a.communityMark + a.conclusionMark
          })
        }
        
        // Calculate total based on assessment type
        if (a.formType === 'ecd') {
          // ECD: preparation + lessonPlanning (mapped from lessonFacilitation) + personalDimensions (mapped from deportment) + documents (mapped from records) + environment + community + conclusion (mapped from remainingPillars)
          return a.preparationMark + a.lessonPlanningMark + a.personalDimensionsMark + a.documentsMark + a.environmentMark + a.communityMark + a.conclusionMark
        } else if (a.formType === 'junior') {
          // Junior: preparation + lessonPlanning + personalDimensions (mapped from deportment) + documents + environment + community + conclusion (mapped from remainingPillars)
          return a.preparationMark + a.lessonPlanningMark + a.personalDimensionsMark + a.documentsMark + a.environmentMark + a.communityMark + a.conclusionMark
        } else {
          // Default calculation for other types
          return a.preparationMark + a.lessonPlanningMark + a.environmentMark + a.documentsMark + a.introductionMark + a.developmentMark + a.conclusionMark + a.personalDimensionsMark + (a.communityMark || 0)
        }
      })()
    }))
  } finally {
    loading.value = false
  }
}

const refreshData = () => fetchMine()

const viewAssessment = (a) => {
  selectedAssessment.value = a
  showDetailModal.value = true
}

const downloadAssessmentPDF = async (a) => {
  loading.value = true
  try {
    const response = await $fetch(`/api/assessments/${a.id}/pdf`, { method: 'GET', responseType: 'blob' })
    const blob = new Blob([response], { type: 'application/pdf' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `assessment-${a.student.fullName}-${a.subject}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (e) {
    alert('Error downloading PDF')
  } finally {
    loading.value = false
  }
}

const getScoreColorClass = (score) => {
  if (score >= 90) return 'bg-green-500'
  if (score >= 80) return 'bg-blue-500'
  if (score >= 70) return 'bg-yellow-500'
  if (score >= 60) return 'bg-orange-500'
  return 'bg-red-500'
}

const formatDate = (d) => new Date(d).toLocaleDateString()

onMounted(fetchMine)
</script>

