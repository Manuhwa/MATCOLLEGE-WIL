<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-10">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Choose Assessment Type</h1>
        <p class="text-gray-600 mt-2">Select the appropriate form to continue. Assessments are saved on this device if you go offline.</p>
      </div>


      <div class="grid grid-cols-1 gap-6">
        <!-- Single Assessment Card -->
        <div class="bg-white rounded-xl border shadow-sm p-4 sm:p-8 text-center">
          <div class="flex items-center justify-center mb-6">
            <div class="w-16 h-16 rounded-xl bg-green-600 text-white flex items-center justify-center mr-4">
              <i class="pi pi-graduation-cap text-2xl"></i>
            </div>
            <div>
              <h2 class="text-2xl font-semibold text-gray-900">Begin Assessment</h2>
              <p class="text-gray-600">Start your teaching practice assessment</p>
            </div>
          </div>
          
          <NuxtLink
            to="/assessment/new"
            class="inline-block bg-green-600 text-white text-lg font-semibold py-4 px-8 rounded-xl hover:bg-green-700 transition-all transform hover:scale-105 shadow-lg"
          >
            Start Assessment
        </NuxtLink>

          <div class="mt-6 text-sm text-gray-500">
            <p>Choose your assessment type and criteria on the next page</p>
            </div>
            </div>
          </div>

    </div>
  </div>
</template>

<script setup>
definePageMeta({ title: 'Choose Assessment Type', middleware: 'supervisor-auth' })
</script>