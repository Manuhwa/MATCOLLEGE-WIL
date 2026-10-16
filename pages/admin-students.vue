<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-6 flex items-center justify-between gap-2 flex-wrap">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Students (District)</h1>
          <p class="text-gray-600 mt-1">Search by SRN or surname and view their crits</p>
        </div>
        <div class="bg-white rounded-xl shadow-sm border px-6 py-4 text-right">
          <p class="text-sm font-medium text-gray-600">Students on WIL{{ districtName ? ' in ' + districtName : '' }}</p>
          <p class="text-2xl sm:text-3xl font-bold text-blue-600">
            <i v-if="countLoading" class="pi pi-spinner pi-spin text-xl"></i>
            <span v-else>{{ wilCount }}</span>
          </p>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Search by SRN</label>
            <input v-model="q.srn" type="text" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="e.g. 23/002/24" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Or Surname</label>
            <input v-model="q.surname" type="text" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Surname" />
          </div>
          <div>
            <button @click="search" :disabled="loading" class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
              <i v-if="loading" class="pi pi-spinner pi-spin mr-2"></i>
              Search
            </button>
          </div>
        </div>
      </div>

      <div class="grid md:grid-cols-2 gap-6 grid-cols-1">
        <div class="bg-white rounded-xl shadow-sm border p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Results</h2>
          <div v-if="students.length === 0" class="text-gray-500 text-sm">No students. Search by SRN or surname.</div>
          <ul class="divide-y" v-else>
            <li v-for="s in students" :key="s.id" class="py-3 flex items-center justify-between gap-2 flex-wrap">
              <div>
                <div class="font-medium text-gray-900">{{ s.fullName }} <span class="text-gray-500">({{ s.candidateNo }})</span></div>
                <div class="text-sm text-gray-600">{{ s.schoolName }} • {{ s.className }} • {{ s.email }}</div>
              </div>
              <button @click="select(s)" class="px-3 py-1.5 text-sm bg-green-600 text-white rounded hover:bg-green-700">View Crits</button>
            </li>
          </ul>
        </div>

        <div class="bg-white rounded-xl shadow-sm border p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Student Crits</h2>
          <div v-if="!selected">Select a student to view crits.</div>
          <div v-else>
            <div class="mb-3">
              <div class="font-medium">{{ selected.fullName }} <span class="text-gray-500">({{ selected.candidateNo }})</span></div>
              <div class="text-sm text-gray-600">{{ selected.schoolName }} • {{ selected.className }}</div>
            </div>
            <div v-if="assessments.length === 0" class="text-gray-500 text-sm">No crits found.</div>
            <div v-else class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="a in assessments" :key="a.id">
                  <td class="px-4 py-2 text-sm text-gray-700">{{ format(a.assessmentDate) }}</td>
                  <td class="px-4 py-2 text-sm text-gray-700">{{ a.subject }}</td>
                  <td class="px-4 py-2 text-sm text-gray-700">{{ a.totalMark }}/100</td>
                </tr>
              </tbody>
            </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

definePageMeta({ middleware: 'admin-auth' })

const loading = ref(false)
const q = ref({ srn: '', surname: '' })
const students = ref([])
const selected = ref(null)
const assessments = ref([])

const wilCount = ref(0)
const districtName = ref('')
const countLoading = ref(true)

const loadDistrictCount = async () => {
  countLoading.value = true
  try {
    const districtId = useCookie('adminDistrictId').value
    const params = districtId ? { districtId } : {}
    const [studentsRes, districtRes] = await Promise.all([
      $fetch('/api/students', { params }),
      districtId ? $fetch(`/api/districts/${districtId}`).catch(() => null) : Promise.resolve(null)
    ])
    wilCount.value = studentsRes?.students?.length || 0
    districtName.value = districtRes?.district?.name || districtRes?.name || ''
  } catch (e) {
    wilCount.value = 0
  } finally {
    countLoading.value = false
  }
}

onMounted(loadDistrictCount)

const format = (d) => new Date(d).toLocaleDateString()

const search = async () => {
  loading.value = true
  try {
    const params = new URLSearchParams()
    if (q.value.srn) params.set('candidateNo', q.value.srn)
    if (q.value.surname) params.set('surname', q.value.surname)
    const res = await $fetch(`/api/students/search?${params.toString()}`)
    students.value = res.students || []
  } catch (e) {
    alert('Search failed')
  } finally {
    loading.value = false
  }
}

const select = async (s) => {
  selected.value = s
  loading.value = true
  try {
    const res = await $fetch('/api/assessments', { params: { studentId: s.id } })
    assessments.value = (res.assessments || []).map(a => ({
      ...a,
      totalMark: (() => {
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
  } catch (e) {
    assessments.value = []
  } finally {
    loading.value = false
  }
}
</script>

