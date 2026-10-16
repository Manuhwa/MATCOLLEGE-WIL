<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header Section -->
    <div class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between gap-2 flex-wrap">
          <div>
            <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p class="text-gray-600 mt-1">Manage assessments and generate reports</p>
          </div>
          <div class="flex items-center gap-4 flex-wrap">
            <button 
              @click="refreshData"
              class="btn-secondary"
              :disabled="loading"
            >
              <i class="pi pi-refresh mr-2" :class="{ 'pi-spin': loading }"></i>
              Refresh
            </button>
            <button 
              @click="exportSelectedAsZip"
              class="btn-primary"
              :disabled="selectedAssessments.length === 0 || loading"
            >
              <i class="pi pi-download mr-2"></i>
              Export Selected ({{ selectedAssessments.length }})
            </button>
            <button 
              @click="logout"
              class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              <i class="pi pi-sign-out mr-2"></i>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-xl shadow-sm border p-6">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <i class="pi pi-file-text text-blue-600 text-xl"></i>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Assessments</p>
              <p class="text-2xl font-bold text-gray-900">{{ statistics.totalAssessments }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border p-6">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <i class="pi pi-users text-green-600 text-xl"></i>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Students</p>
              <p class="text-2xl font-bold text-gray-900">{{ statistics.totalStudents }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border p-6">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <i class="pi pi-user text-purple-600 text-xl"></i>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Supervisors</p>
              <p class="text-2xl font-bold text-gray-900">{{ statistics.totalSupervisors }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border p-6">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <i class="pi pi-chart-line text-orange-600 text-xl"></i>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Average Score</p>
              <p class="text-2xl font-bold text-gray-900">{{ statistics.averageScore }}%</p>
            </div>
          </div>
        </div>
      </div>

      <!-- District Information for Admins -->
      <div v-if="!isSuperadmin && assignedDistrict" class="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <div class="flex items-center justify-between mb-4 gap-2 flex-wrap">
          <h2 class="text-xl font-semibold text-gray-900">Your Assigned District</h2>
          <div class="text-sm text-gray-500">
            <i class="pi pi-map-marker mr-1"></i>
            District Information
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-blue-50 rounded-lg p-4">
            <div class="flex items-center">
              <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <i class="pi pi-map-marker text-blue-600"></i>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-600">District Name</p>
                <p class="text-lg font-bold text-gray-900">{{ assignedDistrict.name }}</p>
              </div>
            </div>
          </div>
          <div class="bg-green-50 rounded-lg p-4">
            <div class="flex items-center">
              <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <i class="pi pi-users text-green-600"></i>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-600">Students in District</p>
                <p class="text-lg font-bold text-gray-900">{{ districtStudentCount }}</p>
              </div>
            </div>
          </div>
          <div class="bg-purple-50 rounded-lg p-4">
            <div class="flex items-center">
              <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <i class="pi pi-user text-purple-600"></i>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-600">Supervisors in District</p>
                <p class="text-lg font-bold text-gray-900">{{ districtSupervisorCount }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters and Search -->
      <div class="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input 
              v-model="filters.search"
              type="text"
              placeholder="Search by student name, supervisor, subject..."
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Subject</label>
            <select 
              v-model="filters.subject"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Subjects</option>
              <option v-for="subject in subjects" :key="subject" :value="subject">
                {{ subject }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <select 
              v-model="filters.dateRange"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Score Range</label>
            <select 
              v-model="filters.scoreRange"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Scores</option>
              <option value="80-100">80-100% (Grade 1)</option>
              <option value="70-79">70-79% (Grade 2.1)</option>
              <option value="60-69">60-69% (Grade 2.2)</option>
              <option value="50-59">50-59% (Grade 3)</option>
              <option value="0-49">0-49% (Grade F)</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Form Type</label>
            <select
              v-model="filters.formType"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Forms</option>
              <option value="junior">Junior Supervision</option>
              <option value="ecd">Early Childhood Development</option>
            </select>
          </div>
          <div v-if="isSuperadmin">
            <label class="block text-sm font-medium text-gray-700 mb-2">District</label>
            <select 
              v-model="selectedDistrictId"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Districts</option>
              <option v-for="d in districts" :key="d.id" :value="d.id">{{ d.name }}</option>
            </select>
          </div>
        </div>
      </div>

      <div v-if="isSuperadmin && selectedDistrictId" class="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <h3 class="text-base font-semibold text-gray-900 mb-2 break-words">Admins assigned to {{ districtAdminsName }}</h3>
          <div v-if="districtAdmins.length === 0" class="text-sm text-gray-600">No admin assigned</div>
          <ul v-else class="divide-y divide-blue-100">
            <li v-for="a in districtAdmins" :key="a.id" class="py-2 min-w-0">
              <div class="font-medium text-gray-900 break-words">{{ a.fullName }}</div>
              <div class="text-sm text-gray-600 break-all">{{ a.email }}</div>
            </li>
          </ul>
        </div>

      <!-- Assessments Table -->
      <div class="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between gap-2 flex-wrap">
            <h3 class="text-lg font-semibold text-gray-900">Assessments</h3>
            <div class="flex items-center gap-2 flex-wrap">
              <span class="text-sm text-gray-500">
                {{ filteredAssessments.length }} of {{ assessments.length }} assessments
              </span>
              <button 
                v-if="isSuperadmin"
                @click="downloadAllCsv"
                class="btn-secondary"
                :disabled="loading"
              >
                <i class="pi pi-download mr-2"></i>
                Export All CSV
              </button>
              <button 
                v-if="isSuperadmin"
                @click="downloadAllPdfs"
                class="btn-secondary"
                :disabled="loading"
              >
                <i class="pi pi-download mr-2"></i>
                Export All PDFs
              </button>
            </div>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left">
                  <input 
                    type="checkbox"
                    :checked="selectAll"
                    @change="toggleSelectAll"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Supervisor
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="assessment in paginatedAssessments" :key="assessment.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <input 
                    type="checkbox"
                    :value="assessment.id"
                    v-model="selectedAssessments"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ assessment.student.fullName }}</div>
                    <div class="text-sm text-gray-500">{{ assessment.student.candidateNo }}</div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ assessment.supervisor.fullName }}</div>
                    <div class="text-sm text-gray-500">{{ assessment.supervisor.email }}</div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ assessment.subject }}</div>
                    <div class="text-sm text-gray-500">{{ assessment.topic }}</div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="text-sm font-medium text-gray-900">{{ assessment.totalMark }}/100</div>
                    <div class="ml-2">
                      <div class="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          class="h-2 rounded-full"
                          :class="getScoreColorClass(assessment.totalMark)"
                          :style="{ width: assessment.totalMark + '%' }"
                        ></div>
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(assessment.assessmentDate) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex items-center gap-2 flex-wrap">
                    <button 
                      @click="viewAssessment(assessment)"
                      class="text-blue-600 hover:text-blue-900"
                    >
                      <i class="pi pi-eye"></i>
                    </button>
                    <button 
                      @click="downloadAssessmentPDF(assessment)"
                      class="text-green-600 hover:text-green-900"
                      :disabled="loading"
                    >
                      <i class="pi pi-download"></i>
                    </button>
                    <button 
                      v-if="isSuperadmin"
                      @click="editAssessment(assessment)"
                      class="text-yellow-600 hover:text-yellow-900"
                    >
                      <i class="pi pi-pencil"></i>
                    </button>
                    <button 
                      v-if="isSuperadmin"
                      @click="deleteAssessment(assessment)"
                      class="text-red-600 hover:text-red-900"
                    >
                      <i class="pi pi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
          <div class="flex items-center justify-between gap-2 flex-wrap">
            <div class="flex-1 flex justify-between sm:hidden gap-2 flex-wrap">
              <button 
                @click="previousPage"
                :disabled="currentPage === 1"
                class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button 
                @click="nextPage"
                :disabled="currentPage >= totalPages"
                class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p class="text-sm text-gray-700">
                  Showing 
                  <span class="font-medium">{{ startIndex + 1 }}</span>
                  to 
                  <span class="font-medium">{{ endIndex }}</span>
                  of 
                  <span class="font-medium">{{ filteredAssessments.length }}</span>
                  results
                </p>
              </div>
              <div>
                <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button 
                    @click="previousPage"
                    :disabled="currentPage === 1"
                    class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <i class="pi pi-chevron-left"></i>
                  </button>
                  <button 
                    v-for="page in visiblePages"
                    :key="page"
                    @click="goToPage(page)"
                    :class="[
                      'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                      page === currentPage
                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    ]"
                  >
                    {{ page }}
                  </button>
                  <button 
                    @click="nextPage"
                    :disabled="currentPage >= totalPages"
                    class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <i class="pi pi-chevron-right"></i>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Assessment Detail Modal -->
    <AssessmentDetailModal 
      v-if="showDetailModal"
      :assessment="selectedAssessment"
      @close="showDetailModal = false"
      @download="downloadAssessmentPDF"
    />

    <!-- Loading Overlay -->
    <div v-if="loading" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg p-6 flex items-center gap-3 flex-wrap">
        <i class="pi pi-spin pi-spinner text-blue-600 text-xl"></i>
        <span class="text-gray-700">Processing...</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

// Page meta
definePageMeta({
  middleware: 'admin-auth'
})

// Reactive data
const loading = ref(false)
const assessments = ref([])
const selectedAssessments = ref([])
const showDetailModal = ref(false)
const selectedAssessment = ref(null)
const currentPage = ref(1)
const itemsPerPage = 10
const role = useCookie('role')
const isSuperadmin = computed(() => role.value === 'superadmin')
const districts = ref([])
const selectedDistrictId = ref('')
const assignedDistrict = ref(null)
const districtStudentCount = ref(0)
const districtSupervisorCount = ref(0)

// Filters
const filters = ref({
  search: '',
  subject: '',
  dateRange: '',
  scoreRange: '',
  formType: ''
})

// Statistics
const statistics = ref({
  totalAssessments: 0,
  totalStudents: 0,
  totalSupervisors: 0,
  averageScore: 0
})

// Computed properties
const subjects = computed(() => {
  const uniqueSubjects = [...new Set(assessments.value.map(a => a.subject))]
  return uniqueSubjects.sort()
})

const filteredAssessments = computed(() => {
  let filtered = assessments.value

  // Search filter
  if (filters.value.search) {
    const search = filters.value.search.toLowerCase()
    filtered = filtered.filter(assessment => 
      assessment.student.fullName.toLowerCase().includes(search) ||
      assessment.supervisor.fullName.toLowerCase().includes(search) ||
      assessment.subject.toLowerCase().includes(search) ||
      assessment.topic.toLowerCase().includes(search)
    )
  }

  // Subject filter
  if (filters.value.subject) {
    filtered = filtered.filter(assessment => assessment.subject === filters.value.subject)
  }

  // Date range filter
  if (filters.value.dateRange) {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    
    switch (filters.value.dateRange) {
      case 'today':
        filtered = filtered.filter(assessment => {
          const assessmentDate = new Date(assessment.assessmentDate)
          return assessmentDate >= today
        })
        break
      case 'week':
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
        filtered = filtered.filter(assessment => {
          const assessmentDate = new Date(assessment.assessmentDate)
          return assessmentDate >= weekAgo
        })
        break
      case 'month':
        const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate())
        filtered = filtered.filter(assessment => {
          const assessmentDate = new Date(assessment.assessmentDate)
          return assessmentDate >= monthAgo
        })
        break
      case 'quarter':
        const quarterAgo = new Date(today.getFullYear(), today.getMonth() - 3, today.getDate())
        filtered = filtered.filter(assessment => {
          const assessmentDate = new Date(assessment.assessmentDate)
          return assessmentDate >= quarterAgo
        })
        break
      case 'year':
        const yearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate())
        filtered = filtered.filter(assessment => {
          const assessmentDate = new Date(assessment.assessmentDate)
          return assessmentDate >= yearAgo
        })
        break
    }
  }

  // Score range filter
  if (filters.value.scoreRange) {
    const [min, max] = filters.value.scoreRange.split('-').map(Number)
    filtered = filtered.filter(assessment => {
      const score = assessment.totalMark
      return score >= min && score <= max
    })
  }

  // Form type filter
  if (filters.value.formType) {
    filtered = filtered.filter(assessment => assessment.formType === filters.value.formType)
  }

  return filtered
})

const selectAll = computed({
  get: () => {
    return paginatedAssessments.value.length > 0 && 
           paginatedAssessments.value.every(assessment => selectedAssessments.value.includes(assessment.id))
  },
  set: (value) => {
    if (value) {
      selectedAssessments.value = paginatedAssessments.value.map(assessment => assessment.id)
    } else {
      selectedAssessments.value = []
    }
  }
})

const totalPages = computed(() => Math.ceil(filteredAssessments.value.length / itemsPerPage))

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage)

const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage, filteredAssessments.value.length))

const paginatedAssessments = computed(() => {
  return filteredAssessments.value.slice(startIndex.value, endIndex.value)
})

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)
  
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

// Methods
const fetchAssessments = async () => {
  loading.value = true
  try {
    // Simulate API call - replace with actual API endpoint
    const response = await $fetch('/api/assessments', {
      params: {
        districtId: selectedDistrictId.value || undefined,
        search: filters.value.search,
        subject: filters.value.subject,
        dateRange: filters.value.dateRange,
        scoreRange: filters.value.scoreRange,
        formType: filters.value.formType
      }
    })
    assessments.value = response.assessments || []
    statistics.value = response.statistics || {
      totalAssessments: assessments.value.length,
      totalStudents: new Set(assessments.value.map(a => a.student.id)).size,
      totalSupervisors: new Set(assessments.value.map(a => a.supervisor.id)).size,
      averageScore: assessments.value.length > 0 
        ? Math.round(assessments.value.reduce((sum, a) => sum + a.totalMark, 0) / assessments.value.length)
        : 0
    }
  } catch (error) {
    console.error('Error fetching assessments:', error)
    // For demo purposes, create sample data
    createSampleData()
  } finally {
    loading.value = false
  }
}

const loadDistricts = async () => {
  if (!isSuperadmin.value) return
  try {
    const res = await $fetch('/api/districts')
    districts.value = res.districts || []
  } catch (e) {
    districts.value = []
  }
}

const loadAssignedDistrict = async () => {
  if (isSuperadmin.value) return
  try {
    const adminDistrictId = useCookie('adminDistrictId')
    console.log('Admin district ID from cookie:', adminDistrictId.value)
    
    if (adminDistrictId.value) {
      const res = await $fetch(`/api/districts/${adminDistrictId.value}`)
      console.log('District data:', res.district)
      assignedDistrict.value = res.district
      
      // Load student and supervisor counts for this district
      const [studentsRes, supervisorsRes] = await Promise.all([
        $fetch('/api/students', { params: { districtId: adminDistrictId.value } }),
        $fetch('/api/supervisors', { params: { districtId: adminDistrictId.value } })
      ])
      
      console.log('Students response:', studentsRes)
      console.log('Supervisors response:', supervisorsRes)
      
      districtStudentCount.value = studentsRes.students?.length || 0
      districtSupervisorCount.value = supervisorsRes.supervisors?.length || 0
    } else {
      console.log('No admin district ID found in cookie')
    }
  } catch (e) {
    console.error('Error loading assigned district:', e)
  }
}

watch(() => selectedDistrictId.value, () => {
  fetchAssessments()
  loadDistrictAdmins()
})

// Superadmin: admins assigned to the selected district filter
const allAdmins = ref([])
const allAdminsLoaded = ref(false)
const loadDistrictAdmins = async () => {
  if (!isSuperadmin.value || !selectedDistrictId.value || allAdminsLoaded.value) return
  try {
    const res = await $fetch('/api/admins')
    allAdmins.value = res?.admins || []
    allAdminsLoaded.value = true
  } catch (e) {
    allAdmins.value = []
  }
}
const districtAdmins = computed(() => selectedDistrictId.value
  ? allAdmins.value.filter(a => String(a.assignedDistrictId ?? '') === String(selectedDistrictId.value))
  : [])
const districtAdminsName = computed(() => districts.value.find(d => String(d.id) === String(selectedDistrictId.value))?.name || '')

const createSampleData = () => {
  // Create sample data for demonstration
  const sampleAssessments = [
    {
      id: 1,
      student: { id: 1, fullName: 'John Doe', candidateNo: 'STU001' },
      supervisor: { id: 1, fullName: 'Dr. Smith', email: 'smith@college.edu' },
      subject: 'Mathematics',
      topic: 'Algebra Basics',
      totalMark: 85,
      assessmentDate: '2024-01-15',
      formType: 'junior'
    },
    {
      id: 2,
      student: { id: 2, fullName: 'Jane Smith', candidateNo: 'STU002' },
      supervisor: { id: 2, fullName: 'Prof. Johnson', email: 'johnson@college.edu' },
      subject: 'English',
      topic: 'Essay Writing',
      totalMark: 92,
      assessmentDate: '2024-01-16',
      formType: 'ecd'
    },
    {
      id: 3,
      student: { id: 3, fullName: 'Mike Wilson', candidateNo: 'STU003' },
      supervisor: { id: 1, fullName: 'Dr. Smith', email: 'smith@college.edu' },
      subject: 'Science',
      topic: 'Chemistry Lab',
      totalMark: 78,
      assessmentDate: '2024-01-17',
      formType: 'junior'
    }
  ]
  
  assessments.value = sampleAssessments
  statistics.value = {
    totalAssessments: sampleAssessments.length,
    totalStudents: new Set(sampleAssessments.map(a => a.student.id)).size,
    totalSupervisors: new Set(sampleAssessments.map(a => a.supervisor.id)).size,
    averageScore: Math.round(sampleAssessments.reduce((sum, a) => sum + a.totalMark, 0) / sampleAssessments.length)
  }
}

const refreshData = () => {
  fetchAssessments()
}

const toggleSelectAll = () => {
  selectAll.value = !selectAll.value
}

const viewAssessment = (assessment) => {
  selectedAssessment.value = assessment
  showDetailModal.value = true
}

const editAssessment = (assessment) => {
  // Navigate to edit page
  navigateTo(`/assessment/edit/${assessment.id}`)
}

const deleteAssessment = async (assessment) => {
  if (confirm('Are you sure you want to delete this assessment?')) {
    loading.value = true
    try {
      // Simulate API call
      await $fetch(`/api/assessments/${assessment.id}`, { method: 'DELETE' })
      await fetchAssessments()
    } catch (error) {
      console.error('Error deleting assessment:', error)
    } finally {
      loading.value = false
    }
  }
}

const downloadAssessmentPDF = async (assessment) => {
  loading.value = true
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
  } finally {
    loading.value = false
  }
}

const exportSelectedAsZip = async () => {
  if (selectedAssessments.value.length === 0) {
    alert('Please select assessments to export.')
    return
  }
  
  loading.value = true
  try {
    const response = await $fetch('/api/assessments/export-zip', {
      method: 'POST',
      body: {
        assessmentIds: selectedAssessments.value
      },
      responseType: 'blob'
    })
    
    // Create download link
    const blob = new Blob([response], { type: 'application/zip' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `assessments-${new Date().toISOString().split('T')[0]}.zip`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    
    // Clear selection
    selectedAssessments.value = []
  } catch (error) {
    console.error('Error exporting ZIP:', error)
    alert('Error exporting ZIP. Please try again.')
  } finally {
    loading.value = false
  }
}

const downloadAllCsv = async () => {
  loading.value = true
  try {
    const response = await $fetch('/api/assessments/export-csv', { method: 'GET' })
    
    if (response.csvData && response.csvData.length > 0) {
      // Download each CSV file separately
      for (const csvItem of response.csvData) {
        const blob = new Blob([csvItem.data], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `${csvItem.type}-assessments-${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
        
        // Small delay between downloads
        await new Promise(resolve => setTimeout(resolve, 500))
      }
    } else {
      alert('No assessment data found to export')
    }
  } catch (e) {
    console.error('CSV export error:', e)
    alert('Failed to download CSV')
  } finally {
    loading.value = false
  }
}

const downloadAllPdfs = async () => {
  loading.value = true
  try {
    const response = await $fetch('/api/assessments/export-pdf-all', { method: 'GET', responseType: 'blob' })
    const blob = new Blob([response], { type: 'application/zip' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `assessments-${new Date().toISOString().split('T')[0]}.zip`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (e) {
    alert('Failed to download PDFs')
  } finally {
    loading.value = false
  }
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const goToPage = (page) => {
  currentPage.value = page
}

const getScoreColorClass = (score) => {
  if (score >= 90) return 'bg-green-500'
  if (score >= 80) return 'bg-blue-500'
  if (score >= 70) return 'bg-yellow-500'
  if (score >= 60) return 'bg-orange-500'
  return 'bg-red-500'
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const logout = () => {
  const role = useCookie('role')
  role.value = null
  navigateTo('/')
}

// Lifecycle
onMounted(() => {
  fetchAssessments()
  loadDistricts()
  loadAssignedDistrict()
})
</script>

<style scoped>
.btn-primary {
  @apply bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed;
}

.btn-secondary {
  @apply bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed;
}
</style> 