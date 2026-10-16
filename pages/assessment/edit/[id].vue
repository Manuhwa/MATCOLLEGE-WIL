<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-6 flex items-center justify-between gap-2 flex-wrap">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Edit Assessment</h1>
        <NuxtLink to="/admin" class="px-3 py-2 bg-gray-700 text-white rounded-lg">Back to Admin</NuxtLink>
      </div>

      <div v-if="loading" class="text-gray-600">Loading...</div>
      <form v-else @submit.prevent="save" class="space-y-6 bg-white border rounded-xl p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <input v-model="form.subject" class="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Topic</label>
            <input v-model="form.topic" class="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Assessment Date</label>
            <input v-model="form.assessmentDate" type="datetime-local" class="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Form Type</label>
            <select v-model="form.formType" class="w-full px-3 py-2 border rounded">
              <option value="junior">Junior</option>
              <option value="ecd">ECD</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="field in markFields" :key="field.key">
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ field.label }} (Mark)</label>
            <input v-model.number="form[field.mark]" type="number" min="0" class="w-full px-3 py-2 border rounded" />
          </div>
          <div v-for="field in markFields" :key="field.key + '-c'">
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ field.label }} (Comment)</label>
            <textarea v-model="form[field.comment]" rows="2" class="w-full px-3 py-2 border rounded"></textarea>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Overall Comment</label>
          <textarea v-model="form.overallComment" rows="3" class="w-full px-3 py-2 border rounded"></textarea>
        </div>

        <div class="flex justify-end gap-3 flex-wrap">
          <button type="submit" :disabled="saving" class="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50">
            <i v-if="saving" class="pi pi-spinner pi-spin mr-2"></i>
            Save Changes
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

definePageMeta({ middleware: 'superadmin-auth' })

const route = useRoute()
const id = Number(route.params.id)
const loading = ref(true)
const saving = ref(false)
const form = ref({
  subject: '', topic: '', assessmentDate: '', formType: 'junior',
  preparationMark: 0, preparationComment: '',
  lessonPlanningMark: 0, lessonPlanningComment: '',
  environmentMark: 0, environmentComment: '',
  documentsMark: 0, documentsComment: '',
  introductionMark: 0, introductionComment: '',
  developmentMark: 0, developmentComment: '',
  conclusionMark: 0, conclusionComment: '',
  personalDimensionsMark: 0, personalDimensionsComment: '',
  communityMark: 0, communityComment: '',
  overallComment: '',
})

const markFields = [
  { key: 'prep', label: 'Preparation & Scheming', mark: 'preparationMark', comment: 'preparationComment' },
  { key: 'plan', label: 'Lesson Planning', mark: 'lessonPlanningMark', comment: 'lessonPlanningComment' },
  { key: 'env', label: 'Environment & Management', mark: 'environmentMark', comment: 'environmentComment' },
  { key: 'docs', label: 'Learning Documents', mark: 'documentsMark', comment: 'documentsComment' },
  { key: 'intro', label: 'Introduction', mark: 'introductionMark', comment: 'introductionComment' },
  { key: 'dev', label: 'Development', mark: 'developmentMark', comment: 'developmentComment' },
  { key: 'conc', label: 'Conclusion', mark: 'conclusionMark', comment: 'conclusionComment' },
  { key: 'pers', label: 'Personal Dimensions', mark: 'personalDimensionsMark', comment: 'personalDimensionsComment' },
  { key: 'comm', label: 'Community', mark: 'communityMark', comment: 'communityComment' },
]

const load = async () => {
  try {
    const res = await $fetch(`/api/assessments/${id}`)
    const a = res.assessment
    form.value.subject = a.subject
    form.value.topic = a.topic
    form.value.assessmentDate = new Date(a.assessmentDate).toISOString().slice(0,16)
    form.value.formType = a.formType
    markFields.forEach(f => {
      form.value[f.mark] = a[f.mark]
      form.value[f.comment] = a[f.comment]
    })
    form.value.overallComment = a.overallComment
  } catch (e) {
    alert('Failed to load assessment')
  } finally {
    loading.value = false
  }
}

const save = async () => {
  saving.value = true
  try {
    const payload = { ...form.value, assessmentDate: new Date(form.value.assessmentDate).toISOString() }
    await $fetch(`/api/assessments/${id}`, { method: 'PUT', body: payload })
    alert('Saved')
    navigateTo('/admin')
  } catch (e) {
    alert('Failed to save')
  } finally {
    saving.value = false
  }
}

onMounted(load)
</script>

