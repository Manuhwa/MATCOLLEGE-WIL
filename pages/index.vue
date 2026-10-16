<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 to-emerald-100">
    <!-- Hero Section -->
    <div class="relative overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div class="text-center">
          <div class="w-28 h-28 rounded-3xl flex items-center justify-center mx-auto mb-8 bg-white shadow-md p-2">
            <img src="~/assets/images/madziwa-logo.png" alt="Madziwa Teachers College Logo" class="w-full h-full object-contain rounded-2xl" />
          </div>
          <h1 class="text-3xl sm:text-5xl font-bold text-gray-900 mb-6">
            Madziwa Teachers College
            <span class="block text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-emerald-600">
              WIL Assessment Platform
            </span>
          </h1>
          <p class="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            A Work Integrated Learning (WIL) assessment system for Madziwa Teachers College.
            Supervisors record crits of student teachers on site, even offline, while district admins
            and superadmins track progress, review assessments and export reports.
          </p>
          <div class="text-gray-500">Use the login links in the header to continue.</div>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="py-24 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            What the Platform Does
          </h2>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything needed to run Work Integrated Learning (WIL) assessments, from the classroom visit to the final report.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center p-6">
            <div class="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <i class="pi pi-file-edit text-primary-600 text-2xl"></i>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">WIL Assessment Forms (Crits)</h3>
            <p class="text-gray-600">
              Supervisors log in with their PIN and assess student teachers on 100-mark forms for ECD, Junior and Secondary levels (plus ISEN and Materials Development).
            </p>
          </div>
          <div class="text-center p-6">
            <div class="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <i class="pi pi-wifi text-emerald-600 text-2xl"></i>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">Works Offline</h3>
            <p class="text-gray-600">
              Installable as an app. Assessments completed without a connection are saved on the device and sync automatically when you are back online.
            </p>
          </div>
          <div class="text-center p-6">
            <div class="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <i class="pi pi-download text-green-600 text-2xl"></i>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">PDF &amp; CSV Export</h3>
            <p class="text-gray-600">
              Download any assessment as a PDF report, or export all assessments as CSV, a combined PDF or a ZIP of reports.
            </p>
          </div>
          <div class="text-center p-6">
            <div class="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <i class="pi pi-map-marker text-blue-600 text-2xl"></i>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">District Admin View</h3>
            <p class="text-gray-600">
              District admins see how many students are on WIL in their district, search students by SRN or surname and view each student&#39;s crits.
            </p>
          </div>
          <div class="text-center p-6">
            <div class="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <i class="pi pi-shield text-purple-600 text-2xl"></i>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">Superadmin Management</h3>
            <p class="text-gray-600">
              Superadmins manage admins, districts and supervisors, import students and supervisors from CSV, and set assessment points.
            </p>
          </div>
          <div class="text-center p-6">
            <div class="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <i class="pi pi-users text-amber-600 text-2xl"></i>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">All Supervisors at a Glance</h3>
            <p class="text-gray-600">
              Superadmins can view every supervisor&#39;s assessments, filter them by supervisor or district, and see platform-wide statistics.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Instructions Section -->
    <div class="py-24 bg-gradient-to-r from-primary-600 to-emerald-600">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-white/90 backdrop-blur rounded-2xl shadow-lg p-4 sm:p-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">How it works</h2>
          <ol class="list-decimal pl-6 space-y-3 text-gray-700">
            <li><strong>Set up:</strong> the superadmin creates districts, admins and supervisors, and imports student teachers (and supervisors) from CSV, assigning them to districts.</li>
            <li><strong>Log in:</strong> the supervisor logs in with their National ID or email and PIN using the Supervisor Login link in the header.</li>
            <li><strong>Find the student:</strong> on the assessment form, the supervisor searches for the student teacher by SRN or surname and picks the right form (ECD, Junior, Secondary, ISEN or Materials).</li>
            <li><strong>Assess on site:</strong> the supervisor scores each section out of 100 and adds comments. This works even without internet; the crit is saved on the device.</li>
            <li><strong>Submit &amp; sync:</strong> on submit the crit is sent to the server, or queued offline and synced automatically (or with the &quot;pending sync&quot; button) once back online.</li>
            <li><strong>Review &amp; export:</strong> district admins view students and crits for their district; superadmins review all supervisors&#39; assessments and export PDF, CSV or ZIP reports.</li>
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
useHead({
  title: 'Madziwa Teachers College - Work Integrated Learning (WIL) Assessment Platform',
  meta: [{ name: 'description', content: 'Work Integrated Learning (WIL) assessment platform for Madziwa Teachers College: supervisors record crits offline, admins and superadmins review and export reports.' }]
})
</script> 