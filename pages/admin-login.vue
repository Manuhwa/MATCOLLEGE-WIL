<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
    <div class="max-w-md w-full">
      <!-- Login Card -->
      <div class="bg-white rounded-2xl shadow-xl p-4 sm:p-8">
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <i class="pi pi-shield text-white text-2xl"></i>
          </div>
          <h1 class="text-2xl font-bold text-gray-900">Admin Login</h1>
          <p class="text-gray-600 mt-2">Access the admin dashboard</p>
        </div>

        <!-- Login Form -->
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              id="username"
              v-model="form.username"
              type="text"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div class="relative"><input
              id="password"
              v-model="form.password"
              :type="showPw.pw1 ? 'text' : 'password'"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 pr-10"
              placeholder="Enter your password"
            /><button type="button" tabindex="-1" @click="showPw.pw1 = !showPw.pw1" class="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700" :aria-label="showPw.pw1 ? 'Hide password' : 'Show password'"><i :class="showPw.pw1 ? 'pi pi-eye-slash' : 'pi pi-eye'"></i></button></div>
          </div>

          <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
            <div class="flex items-center">
              <i class="pi pi-exclamation-triangle text-red-600 mr-2"></i>
              <p class="text-red-700 text-sm">{{ error }}</p>
            </div>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading" class="flex items-center justify-center">
              <i class="pi pi-spin pi-spinner mr-2"></i>
              Signing in...
            </span>
            <span v-else>Sign In</span>
          </button>
        </form>

        <!-- Back to Home -->
        <div class="mt-6 text-center">
          <NuxtLink 
            to="/" 
            class="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200"
          >
            <i class="pi pi-arrow-left mr-1"></i>
            Back to Home
          </NuxtLink>
        </div>
      </div>

      <!-- Footer -->
      <div class="text-center mt-8">
        <p class="text-gray-500 text-sm">
          Madziwa Teachers College WIL Assessment Platform
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
const showPw = reactive({})

// Page meta
definePageMeta({
  layout: false
})

// Reactive data
const loading = ref(false)
const error = ref('')
const form = ref({
  username: '',
  password: ''
})

// Check if user already has a valid session and redirect if they do
onMounted(() => {
  const role = useCookie('role')
  if (role.value === 'admin' || role.value === 'superadmin') {
    // User already has a session, allow continuing
    const targetRoute = role.value === 'superadmin' ? '/superadmin' : '/admin'
    navigateTo(targetRoute)
  }
})

const isNetworkError = (e) => {
  // If there's an HTTP status code, it's NOT a network error (it's a real server response)
  const status = e?.statusCode || e?.status || e?.data?.statusCode
  if (status != null) return false
  // No HTTP status means connectivity/offline failure
  return true
}

// Methods
const handleLogin = async () => {
  loading.value = true
  error.value = ''

  try {
    const res = await $fetch('/api/auth/admin-login', {
      method: 'POST',
      body: {
        email: form.value.username,
        password: form.value.password,
      },
    })

    const role = useCookie('role')
    if (role.value === 'superadmin' || res?.user?.role === 'superadmin') {
      await navigateTo('/superadmin')
    } else {
      await navigateTo('/admin')
    }
  } catch (err) {
    const status = err?.statusCode || err?.status || err?.data?.statusCode
    
    if (isNetworkError(err)) {
      // Check if user has an existing session
      const role = useCookie('role')
      if (role.value === 'admin' || role.value === 'superadmin') {
        // Allow continuing with existing session
        const targetRoute = role.value === 'superadmin' ? '/superadmin' : '/admin'
        await navigateTo(targetRoute)
        return
      }
      // No existing session, show clear offline message
      error.value = 'Unable to connect. You need an internet connection to sign in for the first time. Once signed in online, you can work offline.'
    } else {
      // Real authentication failure
      error.value = (err && err.statusMessage) ? err.statusMessage : 'Invalid username or password'
    }
  } finally {
    loading.value = false
  }
}
</script> 
