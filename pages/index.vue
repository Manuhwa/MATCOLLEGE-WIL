<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 to-emerald-100">
    <!-- Hero Section -->
    <div class="relative overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div class="text-center">
          <div class="w-28 h-28 rounded-3xl flex items-center justify-center mx-auto mb-8 bg-white shadow-md p-2">
            <img src="~/assets/images/madziwa-logo.png" alt="Madziwa Teachers College Logo" class="w-full h-full object-contain rounded-2xl" />
          </div>
          <h1 class="text-5xl font-bold text-gray-900 mb-6">
            Madziwa Teachers College
            <span class="block text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-emerald-600">
              WIL Assessment Platform
            </span>
          </h1>
          <p class="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Empowering educators through comprehensive WIL Practice assessment and evaluation. 
            Streamline your assessment process with our modern, user-friendly platform.
          </p>
          <div class="text-gray-500">Use the login links in the header to continue.</div>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="py-24 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">
            Comprehensive Assessment Features
          </h2>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            Our platform provides everything you need to conduct thorough and professional teaching practice assessments.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Feature 1 -->
          <div class="text-center p-6">
            <div class="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <i class="pi pi-file-text text-primary-600 text-2xl"></i>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">100-Point Scoring System</h3>
            <p class="text-gray-600">
              Comprehensive evaluation across 8 key categories including preparation, lesson planning, presentation, and personal dimensions.
            </p>
          </div>

          <!-- Feature 2 -->
          <div class="text-center p-6">
            <div class="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <i class="pi pi-download text-green-600 text-2xl"></i>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">PDF Export</h3>
            <p class="text-gray-600">
              Generate professional PDF reports for individual assessments or batch download multiple reports as ZIP files.
            </p>
          </div>

          <!-- Feature 3 -->
          <div class="text-center p-6">
            <div class="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <i class="pi pi-chart-line text-purple-600 text-2xl"></i>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">Advanced Analytics</h3>
            <p class="text-gray-600">
              Track performance metrics, view statistics, and analyze assessment data with our comprehensive dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Instructions Section -->
    <div class="py-24 bg-gradient-to-r from-primary-600 to-emerald-600">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-white/90 backdrop-blur rounded-2xl shadow-lg p-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">How it works</h2>
          <ol class="list-decimal pl-6 space-y-2 text-gray-700">
            <li>Supervisor logs in using the header link.</li>
            <li>Register supervisor details and find the student (SRN or surname).</li>
            <li>Complete the assessment form and submit. If you are offline, the form is saved on this device and syncs automatically when you are back online.</li>
            <li>Admins review data; superadmins can import students CSV and manage deletions.</li>
          </ol>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Page meta
definePageMeta({
  title: 'Home - Madziwa Teachers College WIL Assessment Platform'
})
</script> 