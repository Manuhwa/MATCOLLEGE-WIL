<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between gap-2 flex-wrap">
          <div>
            <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">All Assessments</h1>
            <p class="text-gray-600 mt-2">View and manage all teaching practice assessments</p>
          </div>
          <div class="flex gap-4 flex-wrap">
            <NuxtLink 
              to="/assessment/new"
              class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <i class="pi pi-plus mr-2"></i>
              Create New Assessment
            </NuxtLink>
            <NuxtLink 
              to="/admin"
              class="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <i class="pi pi-cog mr-2"></i>
              Admin Dashboard
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <i class="pi pi-spin pi-spinner text-4xl text-blue-600"></i>
        <p class="mt-4 text-gray-600">Loading assessments...</p>
      </div>

      <!-- Assessments List -->
      <div v-else-if="assessments.length > 0" class="space-y-6">
        <div 
          v-for="assessment in assessments" 
          :key="assessment.id"
          class="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow"
        >
          <div class="flex items-center justify-between gap-2 flex-wrap">
            <div class="flex-1">
              <div class="flex items-center gap-4 flex-wrap">
                <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <i class="pi pi-file-text text-blue-600 text-xl"></i>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-900">
                    {{ assessment.student.fullName }} - {{ assessment.subject }}
                  </h3>
                  <p class="text-gray-600">
                    {{ assessment.topic }} • {{ assessment.supervisor.fullName }}
                  </p>
                  <p class="text-sm text-gray-500">
                    {{ formatDate(assessment.assessmentDate) }}
                  </p>
                </div>
              </div>
            </div>
            
            <div class="flex items-center gap-4 flex-wrap">
              <div class="text-right">
                <div class="text-2xl font-bold text-gray-900">
                  {{ assessment.totalMark }}/100
                </div>
                <div class="text-sm text-gray-600">
                  Grade: {{ getGrade(assessment.totalMark) }}
                </div>
              </div>
              
              <div class="flex gap-2 flex-wrap">
                <button 
                  @click="viewAssessment(assessment)"
                  class="bg-blue-100 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-200 transition-colors"
                  title="View Details"
                >
                  <i class="pi pi-eye"></i>
                </button>
                <button 
                  @click="downloadPDF(assessment)"
                  class="bg-green-100 text-green-700 px-3 py-2 rounded-lg hover:bg-green-200 transition-colors"
                  title="Download PDF"
                >
                  <i class="pi pi-download"></i>
                </button>
              </div>
            </div>
          
          <!-- Comments Breakdown (collapsed preview) -->
          <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700">
            <div>
              <div class="font-medium text-gray-900">Comments</div>
              <ul class="list-disc list-inside space-y-1">
                <li v-if="assessment.preparationComment"><span class="text-gray-500">Preparation:</span> {{ assessment.preparationComment }}</li>
                <li v-if="assessment.lessonPlanningComment"><span class="text-gray-500">Lesson Planning:</span> {{ assessment.lessonPlanningComment }}</li>
                <li v-if="assessment.environmentComment"><span class="text-gray-500">Environment:</span> {{ assessment.environmentComment }}</li>
                <li v-if="assessment.documentsComment"><span class="text-gray-500">Documents:</span> {{ assessment.documentsComment }}</li>
                <li v-if="assessment.introductionComment"><span class="text-gray-500">Introduction:</span> {{ assessment.introductionComment }}</li>
                <li v-if="assessment.developmentComment"><span class="text-gray-500">Development:</span> {{ assessment.developmentComment }}</li>
                <li v-if="assessment.conclusionComment"><span class="text-gray-500">Conclusion:</span> {{ assessment.conclusionComment }}</li>
                <li v-if="assessment.personalDimensionsComment"><span class="text-gray-500">Personal Dimensions:</span> {{ assessment.personalDimensionsComment }}</li>
                <li v-if="assessment.communityComment"><span class="text-gray-500">Community Engagement:</span> {{ assessment.communityComment }}</li>
              </ul>
            </div>
          </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="pi pi-file-text text-gray-400 text-2xl sm:text-3xl"></i>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No assessments found</h3>
        <p class="text-gray-600 mb-6">Get started by creating your first assessment.</p>
        <NuxtLink 
          to="/assessment/new"
          class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <i class="pi pi-plus mr-2"></i>
          Create Assessment
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

definePageMeta({ title: 'All Assessments' })

const loading = ref(true)
const assessments = ref([])

const fetchAssessments = async () => {
  try {
    const response = await $fetch('/api/assessments')
    assessments.value = response.assessments
  } catch (error) {
    console.error('Error fetching assessments:', error)
  } finally {
    loading.value = false
  }
}

const viewAssessment = (assessment) => {
  // For now, just show an alert with basic info
  // In a real app, you might want to navigate to a detail page
  alert(`Assessment Details:\nStudent: ${assessment.student.fullName}\nSubject: ${assessment.subject}\nScore: ${assessment.totalMark}/100`)
}

const downloadPDF = async (assessment) => {
  try {
    const response = await $fetch(`/api/assessments/${assessment.id}/pdf`, {
      method: 'GET',
      responseType: 'blob'
    })
    
    // Create download link
    const blob = new Blob([response], { type: 'application/pdf' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `assessment-${assessment.student.fullName}-${assessment.subject}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error downloading PDF:', error)
    alert('Error downloading PDF. Please try again.')
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getGrade = (score) => {
  if (score >= 80) return 'A'
  if (score >= 70) return 'B'
  if (score >= 60) return 'C'
  if (score >= 50) return 'D'
  return 'F'
}

onMounted(() => {
  fetchAssessments()
})
</script> 