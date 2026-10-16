<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Add New Supervisor</h1>
        <p class="mt-2 text-gray-600">Enter supervisor information below</p>
      </div>

      <!-- Supervisor Form -->
      <form @submit.prevent="submitSupervisor" class="bg-white rounded-xl shadow-sm border p-6 space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input 
              v-model="form.fullName" 
              type="text" 
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter full name"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input 
              v-model="form.email" 
              type="email" 
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter email address"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <input 
              v-model="form.phoneNumber" 
              type="tel" 
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter phone number"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">National ID</label>
            <input 
              v-model="form.nationalId" 
              type="text" 
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter national ID"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">PIN</label>
            <div class="relative"><input 
              v-model="form.pin" 
              :type="showPw.pw1 ? 'text' : 'password'" 
              required
              minlength="4"
              maxlength="6"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
              placeholder="Set a PIN (4-6 digits)"
            ><button type="button" tabindex="-1" @click="showPw.pw1 = !showPw.pw1" class="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700" :aria-label="showPw.pw1 ? 'Hide password' : 'Show password'"><i :class="showPw.pw1 ? 'pi pi-eye-slash' : 'pi pi-eye'"></i></button></div>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="flex justify-end gap-4 pt-6 flex-wrap">
          <NuxtLink 
            to="/" 
            class="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </NuxtLink>
          <button 
            type="submit" 
            :disabled="loading"
            class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {{ loading ? 'Creating...' : 'Create Supervisor' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
const showPw = reactive({})
import { ref } from 'vue'

definePageMeta({ title: 'Add New Supervisor', middleware: ['superadmin-auth'] })

const loading = ref(false)

const form = ref({
  fullName: '',
  email: '',
  phoneNumber: '',
  nationalId: '',
  pin: ''
})

const submitSupervisor = async () => {
  loading.value = true
  
  try {
    const response = await $fetch('/api/supervisors', {
      method: 'POST',
      body: form.value
    })
    
    // Show success message
    alert('Supervisor created successfully!')
    
    // Redirect to home
    await navigateTo('/')
  } catch (error) {
    console.error('Error creating supervisor:', error)
    alert('Failed to create supervisor. Please try again.')
  } finally {
    loading.value = false
  }
}
</script> 