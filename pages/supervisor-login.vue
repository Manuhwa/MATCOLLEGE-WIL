<template>
  <div class="min-h-screen bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center p-4">
    <div class="max-w-md w-full">
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <i class="pi pi-user text-white text-2xl"></i>
          </div>
          <h1 class="text-2xl font-bold text-gray-900">Supervisor Login</h1>
          <p class="text-gray-600 mt-2">Access assessment submission</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">National ID or Email</label>
            <input v-model="form.nationalId" type="text" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" placeholder="63-1111111X18 or alice.moyo@example.com" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">PIN</label>
            <input v-model="form.pin" type="password" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" placeholder="****" />
          </div>

          <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
            <div class="flex items-center">
              <i class="pi pi-exclamation-triangle text-red-600 mr-2"></i>
              <p class="text-red-700 text-sm">{{ error }}</p>
            </div>
          </div>

          <button type="submit" :disabled="loading" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-4 rounded-lg font-medium disabled:opacity-50">
            <span v-if="loading" class="flex items-center justify-center"><i class="pi pi-spin pi-spinner mr-2"></i>Signing in...</span>
            <span v-else>Sign In</span>
          </button>
        </form>
      </div>

      <div class="text-center mt-6">
        <NuxtLink to="/" class="text-emerald-700 hover:text-emerald-800 text-sm font-medium"><i class="pi pi-arrow-left mr-1"></i>Back to Home</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

definePageMeta({ layout: false })

const loading = ref(false)
const error = ref('')
const form = ref({ nationalId: '', pin: '' })

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await $fetch('/api/auth/supervisor-login', { method: 'POST', body: form.value })
    if (res?.ok) {
      await navigateTo('/supervisor')
    }
  } catch (e) {
    const status = e?.statusCode || e?.status || e?.data?.statusCode
    error.value = status === 500
      ? 'Login is unavailable because the database is not running. Start MySQL in XAMPP and try again.'
      : (e?.data?.statusMessage || e?.statusMessage || 'Invalid credentials')
  } finally {
    loading.value = false
  }
}
</script>

