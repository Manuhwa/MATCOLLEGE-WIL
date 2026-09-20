<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Superadmin Dashboard</h1>
          <p class="text-gray-600 mt-1">Manage data, imports, and high-privilege actions</p>
        </div>
        <NuxtLink
          to="/admin"
          class="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <i class="pi pi-table mr-2"></i>
          Go to Admin Dashboard
        </NuxtLink>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <div class="bg-white rounded-xl shadow-sm border p-6">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm text-gray-600">Total Assessments</div>
              <div class="text-3xl font-bold text-gray-900 mt-1">{{ stats.totalAssessments }}</div>
            </div>
            <div class="text-green-600">
              <i class="pi pi-file text-2xl"></i>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-xl shadow-sm border p-6">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm text-gray-600">Total Students</div>
              <div class="text-3xl font-bold text-gray-900 mt-1">{{ stats.totalStudents }}</div>
            </div>
            <div class="text-purple-600">
              <i class="pi pi-user text-2xl"></i>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-xl shadow-sm border p-6 cursor-pointer hover:shadow-md transition-shadow" @click="loadDistrictsAdmins" title="Click to refresh">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm text-gray-600">Total Supervisors</div>
              <div class="text-3xl font-bold text-gray-900 mt-1">{{ stats.totalSupervisors }}</div>
            </div>
            <div class="text-blue-600">
              <i class="pi pi-users text-2xl"></i>
            </div>
          </div>
          <div class="mt-2 text-xs text-gray-500">
            Registered in system
          </div>
        </div>
        <div class="bg-white rounded-xl shadow-sm border p-6">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm text-gray-600">Average Score</div>
              <div class="text-3xl font-bold text-gray-900 mt-1">{{ stats.averageScore }}%</div>
            </div>
            <div class="text-orange-600">
              <i class="pi pi-chart-line text-2xl"></i>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-xl shadow-sm border p-6">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm text-gray-600">CSV Imported Students</div>
              <div class="text-3xl font-bold text-gray-900 mt-1">{{ stats.csvImportedStudents }}</div>
            </div>
            <div class="text-indigo-600">
              <i class="pi pi-download text-2xl"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Import Students -->
      <div class="bg-white rounded-xl shadow-sm border p-6 mb-8">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-gray-900">Import Students (CSV)</h2>
          <label class="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer">
            <i class="pi pi-upload mr-2"></i> Import CSV
            <input type="file" accept=".csv" class="hidden" @change="onImportStudentsCsv" />
          </label>
        </div>
          <div class="text-sm text-gray-600 space-y-2">
          <div class="font-medium">CSV header (comma-separated):</div>
          <code class="block bg-gray-50 border border-gray-200 rounded p-2 overflow-x-auto">surname,names,sex,phone,email,district,schoolname,classname,candidateno</code>
          <div>Example row:</div>
          <code class="block bg-gray-50 border border-gray-200 rounded p-2 overflow-x-auto">Banda,Jane,Female,+263777000000,jane@example.com,Shamva,Madziwa Primary,Grade 4 Blue,23/002/24</code>
          <div class="text-xs text-gray-500">
            <strong>Required:</strong> surname, names, sex, email, district, schoolname, classname, candidateno<br/>
            <strong>Optional:</strong> phone<br/>
            Full name is constructed as "surname + space + names"
          </div>
        </div>
        <div v-if="csvImportSummary" class="bg-gray-50 border border-gray-200 rounded p-4 text-sm text-gray-700">
          <div class="font-medium mb-1">Import Summary</div>
          <div class="flex items-center space-x-4">
            <div>Created: {{ csvImportSummary.created }}, Updated: {{ csvImportSummary.updated }}, Errors: {{ csvImportSummary.errors }}</div>
            <button 
              v-if="csvImportSummary.errors > 0" 
              @click="showErrorDetails = true"
              class="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              View Error Details
            </button>
          </div>
        </div>
      </div>

      <!-- Import Supervisors -->
      <div class="bg-white rounded-xl shadow-sm border p-6 mb-8">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-gray-900">Import Supervisors (CSV)</h2>
          <label class="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer">
            <i class="pi pi-upload mr-2"></i> Import CSV
            <input type="file" accept=".csv" class="hidden" @change="onImportSupervisorsCsv" />
          </label>
        </div>
        <div class="text-sm text-gray-600 space-y-2">
          <div class="font-medium">CSV header (comma-separated):</div>
          <code class="block bg-gray-50 border border-gray-200 rounded p-2 overflow-x-auto">fullname,email,phonenumber,nationalid</code>
          <div>Passwords are derived automatically as the last 4 digits of the phone number.</div>
        </div>
        <div v-if="supImportSummary" class="bg-gray-50 border border-gray-200 rounded p-4 text-sm text-gray-700 mt-4">
          <div class="font-medium mb-1">Import Summary</div>
          <div class="flex items-center space-x-4">
            <div>Created: {{ supImportSummary.created }}, Updated: {{ supImportSummary.updated }}, Errors: {{ supImportSummary.errors }}</div>
            <button 
              v-if="supImportSummary.errors > 0" 
              @click="showSupErrorDetails = true"
              class="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              View Error Details
            </button>
          </div>
        </div>
      </div>

      <!-- Manage Admins & Districts -->
      <div class="bg-white rounded-xl shadow-sm border p-6 mb-8">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-gray-900">Manage Admins & Districts</h2>
        </div>
        <form @submit.prevent="createAdmin" class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
          <input v-model="newAdmin.fullName" placeholder="Full name" class="px-3 py-2 border rounded" />
          <input v-model="newAdmin.email" placeholder="Email" class="px-3 py-2 border rounded" />
          <input v-model="newAdmin.password" type="password" placeholder="Password" class="px-3 py-2 border rounded" />
          <select v-model="newAdmin.role" class="px-3 py-2 border rounded">
            <option value="admin">admin</option>
            <option value="superadmin">superadmin</option>
          </select>
          <select v-model.number="newAdmin.assignedDistrictId" class="px-3 py-2 border rounded">
            <option :value="undefined">No District</option>
            <option v-for="d in districts" :key="d.id" :value="d.id">{{ d.name }}</option>
          </select>
          <div class="md:col-span-5">
            <button @click="createAdmin" class="bg-green-600 text-white px-4 py-2 rounded">Create Admin</button>
          </div>
        </form>

        <!-- Reset Admin Password -->
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <input v-model="resetForm.email" placeholder="Admin email (or leave blank to use ID)" class="px-3 py-2 border rounded" />
          <input v-model.number="resetForm.id" type="number" placeholder="Admin ID (optional)" class="px-3 py-2 border rounded" />
          <input v-model="resetForm.newPassword" type="password" placeholder="New password" class="px-3 py-2 border rounded" />
          <div class="md:col-span-2 flex items-center">
            <button @click="resetAdminPassword" class="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700">Reset Admin Password</button>
          </div>
        </div>

        <div class="flex items-center space-x-2 mb-4">
          <input v-model="newDistrict" placeholder="New district name" class="px-3 py-2 border rounded" />
          <button @click="addDistrict" class="bg-blue-600 text-white px-4 py-2 rounded">Add District</button>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-2 text-left">Name</th>
                <th class="px-4 py-2 text-left">Email</th>
                <th class="px-4 py-2 text-left">Role</th>
                <th class="px-4 py-2 text-left">District</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="a in admins" :key="a.id" class="border-b">
                <td class="px-4 py-2">{{ a.fullName }}</td>
                <td class="px-4 py-2">{{ a.email }}</td>
                <td class="px-4 py-2">{{ a.role }}</td>
                <td class="px-4 py-2">
                  <select :value="a.assignedDistrictId || undefined" @change="onAssignDistrict(a.id, $event.target.value)" class="px-2 py-1 border rounded">
                    <option :value="undefined">No District</option>
                    <option v-for="d in districts" :key="d.id" :value="d.id">{{ d.name }}</option>
                  </select>
                </td>
                <td class="px-4 py-2 text-right">
                  <button @click="deleteAdmin(a.id)" class="px-3 py-1.5 text-sm bg-red-600 text-white rounded hover:bg-red-700">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Manage Supervisors -->
      <div class="bg-white rounded-xl shadow-sm border p-6 mb-8">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-gray-900">Manage Supervisors</h2>
          <div class="flex space-x-2">
            <button @click="loadDistrictsAdmins" class="bg-gray-600 text-white px-3 py-2 rounded hover:bg-gray-700">
              <i class="pi pi-refresh mr-1"></i> Refresh
            </button>
            <NuxtLink to="/supervisors/new" class="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700">Full Page</NuxtLink>
          </div>
        </div>
        
        <!-- Create New Supervisor -->
        <div class="mb-6">
          <h3 class="text-lg font-medium text-gray-900 mb-3">Create New Supervisor</h3>
          <form @submit.prevent="createSupervisor" class="grid grid-cols-1 md:grid-cols-7 gap-4">
            <input v-model="newSupervisor.fullName" placeholder="Full name" class="px-3 py-2 border rounded" />
            <input v-model="newSupervisor.email" type="email" placeholder="Email" class="px-3 py-2 border rounded" />
            <input v-model="newSupervisor.phoneNumber" placeholder="Phone" class="px-3 py-2 border rounded" />
            <input v-model="newSupervisor.nationalId" placeholder="National ID" class="px-3 py-2 border rounded" />
            <input v-model="newSupervisor.pin" type="password" placeholder="PIN (4-6)" class="px-3 py-2 border rounded" />
            <select v-model.number="newSupervisor.districtId" class="px-3 py-2 border rounded">
              <option :value="undefined">Select District</option>
              <option v-for="d in districts" :key="d.id" :value="d.id">{{ d.name }}</option>
            </select>
            <div>
              <button @click="createSupervisor" class="bg-green-600 text-white px-4 py-2 rounded w-full">Create Supervisor</button>
            </div>
          </form>
        </div>

        <!-- Existing Supervisors -->
        <div>
          <h3 class="text-lg font-medium text-gray-900 mb-3">Existing Supervisors</h3>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-2 text-left">Name</th>
                  <th class="px-4 py-2 text-left">Email</th>
                  <th class="px-4 py-2 text-left">Phone</th>
                  <th class="px-4 py-2 text-left">National ID</th>
                  <th class="px-4 py-2 text-left">Primary District</th>
                  <th class="px-4 py-2 text-left">Assigned Districts</th>
                  <th class="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="s in supervisors" :key="s.id" class="border-b">
                  <td class="px-4 py-2">{{ s.fullName }}</td>
                  <td class="px-4 py-2">
                    <div class="flex items-center space-x-2">
                      <span class="font-mono text-sm">{{ isSupervisorRevealed(s.id) ? s.email : maskEmail(s.email) }}</span>
                      <button 
                        @click="toggleSupervisorDetails(s.id)"
                        class="text-gray-500 hover:text-gray-700"
                        :title="isSupervisorRevealed(s.id) ? 'Hide details' : 'Show details'"
                      >
                        <i :class="isSupervisorRevealed(s.id) ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
                      </button>
                    </div>
                  </td>
                  <td class="px-4 py-2">
                    <span class="font-mono text-sm">{{ isSupervisorRevealed(s.id) ? s.phoneNumber : maskPhone(s.phoneNumber) }}</span>
                  </td>
                  <td class="px-4 py-2">
                    <span class="font-mono text-sm">{{ isSupervisorRevealed(s.id) ? s.nationalId : maskNationalId(s.nationalId) }}</span>
                  </td>
                  <td class="px-4 py-2">
                    <select :value="s.districtId || undefined" @change="onAssignSupervisorDistrict(s.id, $event.target.value)" class="px-2 py-1 border rounded">
                      <option :value="undefined">No District</option>
                      <option v-for="d in districts" :key="d.id" :value="d.id">{{ d.name }}</option>
                    </select>
                  </td>
                  <td class="px-4 py-2">
                    <div class="flex flex-wrap gap-1">
                      <span v-for="districtAssignment in s.districts" :key="districtAssignment.id" 
                            class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                        {{ districtAssignment.district.name }}
                      </span>
                      <span v-if="!s.districts || s.districts.length === 0" 
                            class="text-gray-500 text-sm">None</span>
                    </div>
                  </td>
                  <td class="px-4 py-2 text-right space-x-2">
                    <button @click="openDistrictModal(s)" class="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">Manage Districts</button>
                    <button @click="openPasswordModal(s)" class="px-3 py-1.5 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700">Edit Password</button>
                    <button @click="deleteSupervisor(s.id)" class="px-3 py-1.5 text-sm bg-red-600 text-white rounded hover:bg-red-700">Delete</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Exports -->
      <div class="bg-white rounded-xl shadow-sm border p-6 mb-8">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-gray-900">Exports</h2>
        </div>
        <div class="flex items-center space-x-3">
          <button @click="downloadAllCsv" class="bg-indigo-600 text-white px-4 py-2 rounded"><i class="pi pi-download mr-2"/>Download All Assessments (CSV)</button>
          <button @click="downloadAllPdfs" class="bg-indigo-600 text-white px-4 py-2 rounded"><i class="pi pi-download mr-2"/>Download All PDFs (ZIP)</button>
        </div>
      </div>

      <!-- Manage Supervisors -->
      <div class="bg-white rounded-xl shadow-sm border p-6 mb-8">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-gray-900">Manage Supervisors</h2>
          <button @click="loadSupervisors" class="bg-gray-700 text-white px-3 py-1.5 rounded">Refresh</button>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-2 text-left">Name</th>
                <th class="px-4 py-2 text-left">Email</th>
                <th class="px-4 py-2 text-left">National ID</th>
                <th class="px-4 py-2 text-left">Phone</th>
                <th class="px-4 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="s in supervisors" :key="s.id" class="border-b">
                <td class="px-4 py-2">{{ s.fullName }}</td>
                <td class="px-4 py-2">
                  <div class="flex items-center space-x-2">
                    <span class="font-mono text-sm">{{ isSupervisorRevealed(s.id) ? s.email : maskEmail(s.email) }}</span>
                    <button 
                      @click="toggleSupervisorDetails(s.id)"
                      class="text-gray-500 hover:text-gray-700"
                      :title="isSupervisorRevealed(s.id) ? 'Hide details' : 'Show details'"
                    >
                      <i :class="isSupervisorRevealed(s.id) ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
                    </button>
                  </div>
                </td>
                <td class="px-4 py-2">
                  <span class="font-mono text-sm">{{ isSupervisorRevealed(s.id) ? s.nationalId : maskNationalId(s.nationalId) }}</span>
                </td>
                <td class="px-4 py-2">
                  <input 
                    v-if="isSupervisorRevealed(s.id)"
                    v-model="s.phoneNumber" 
                    class="px-2 py-1 border rounded w-48 font-mono text-sm" 
                  />
                  <span v-else class="font-mono text-sm">{{ maskPhone(s.phoneNumber) }}</span>
                </td>
                <td class="px-4 py-2 text-right space-x-2">
                  <button 
                    v-if="isSupervisorRevealed(s.id)"
                    @click="saveSupervisorPhone(s)" 
                    class="px-3 py-1.5 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Save
                  </button>
                  <button 
                    @click="testSupervisorLogin(s)" 
                    class="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
                    :title="isSupervisorRevealed(s.id) ? 'Test login' : 'Reveal details to test login'"
                    :disabled="!isSupervisorRevealed(s.id)"
                    :class="{ 'opacity-50 cursor-not-allowed': !isSupervisorRevealed(s.id) }"
                  >
                    Test Login
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Dangerous actions -->
      <div class="bg-white rounded-xl shadow-sm border p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Danger Zone</h2>
        <p class="text-sm text-gray-600 mb-4">Only superadmins can delete assessments.</p>
        <NuxtLink to="/admin" class="inline-flex items-center bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
          <i class="pi pi-trash mr-2"></i> Go to Admin to Delete Assessments
        </NuxtLink>
      </div>
    </div>

    <!-- Password Reset Modal -->
    <div v-if="showPasswordModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Reset Supervisor Password</h3>
        <div class="mb-4">
          <p class="text-sm text-gray-600 mb-2">Supervisor: <strong>{{ selectedSupervisor?.fullName }}</strong></p>
          <p class="text-sm text-gray-600">Email: <strong>{{ isSupervisorRevealed(selectedSupervisor?.id) ? selectedSupervisor?.email : maskEmail(selectedSupervisor?.email) }}</strong></p>
          <p class="text-sm text-gray-600">National ID: <strong>{{ isSupervisorRevealed(selectedSupervisor?.id) ? selectedSupervisor?.nationalId : maskNationalId(selectedSupervisor?.nationalId) }}</strong></p>
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">New Password</label>
          <input 
            v-model="passwordForm.newPassword" 
            type="password" 
            placeholder="Enter new password" 
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
          <input 
            v-model="passwordForm.confirmPassword" 
            type="password" 
            placeholder="Confirm new password" 
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div class="flex justify-end space-x-3">
          <button 
            @click="closePasswordModal" 
            class="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button 
            @click="resetSupervisorPassword" 
            class="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
          >
            Reset Password
          </button>
        </div>
      </div>
    </div>

    <!-- District Management Modal -->
    <div v-if="showDistrictModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
      <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
        <h2 class="text-2xl font-bold mb-4">Manage Districts for {{ selectedSupervisor?.fullName }}</h2>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Select Districts</label>
          <div class="max-h-60 overflow-y-auto border border-gray-300 rounded-md p-3">
            <div v-for="district in districts" :key="district.id" class="flex items-center mb-2">
              <input 
                :id="`district-${district.id}`"
                v-model="selectedDistricts"
                :value="district.id"
                type="checkbox"
                class="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label :for="`district-${district.id}`" class="text-sm text-gray-700">
                {{ district.name }}
              </label>
            </div>
          </div>
        </div>
        <div class="flex justify-end space-x-3">
          <button 
            @click="closeDistrictModal" 
            class="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button 
            @click="saveSupervisorDistricts" 
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Save Districts
          </button>
        </div>
      </div>
    </div>

    <!-- Error Details Modal -->
    <div v-if="showErrorDetails" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
      <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-gray-900">Import Error Details</h2>
          <button @click="showErrorDetails = false" class="text-gray-400 hover:text-gray-600">
            <i class="pi pi-times text-xl"></i>
          </button>
        </div>
        
        <div class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div class="text-red-800 font-medium">
            {{ csvImportSummary.message }}
          </div>
          <div class="text-red-600 text-sm mt-1">
            Total rows: {{ csvImportSummary.total }}, Errors: {{ csvImportSummary.errors }}
          </div>
          <div v-if="csvImportSummary.errors > 0" class="mt-3">
            <div class="text-red-700 font-medium text-sm mb-2">Common Error Types:</div>
            <div class="text-red-600 text-xs space-y-1">
              <div v-for="(count, errorType) in getErrorSummary()" :key="errorType" class="flex justify-between">
                <span>{{ errorType }}:</span>
                <span class="font-medium">{{ count }} occurrence(s)</span>
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-3 max-h-96 overflow-y-auto">
          <div 
            v-for="result in csvImportSummary.results.filter(r => r.status === 'error')" 
            :key="result.row"
            class="p-4 bg-red-50 border border-red-200 rounded-lg"
          >
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <div class="font-medium text-red-800 text-lg">Row {{ result.row }}</div>
                <div class="text-red-600 text-sm mt-2 font-medium">Error Details:</div>
                <div class="text-red-700 text-sm mt-1 bg-red-100 p-2 rounded border-l-4 border-red-400">
                  {{ result.error }}
                </div>
                <div v-if="result.candidateNo" class="text-red-500 text-xs mt-2 bg-red-100 p-2 rounded">
                  <strong>Candidate Number:</strong> {{ result.candidateNo }}
                </div>
                <div class="text-gray-600 text-xs mt-2">
                  <strong>Tip:</strong> Check that all required columns are present and data is properly formatted.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-6 flex justify-end">
          <button 
            @click="showErrorDetails = false"
            class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>

    <!-- Supervisor Import Error Details Modal -->
    <div v-if="showSupErrorDetails" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden">
        <div class="p-6 border-b border-gray-200">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold text-gray-900">Supervisor Import Error Details</h3>
            <button 
              @click="showSupErrorDetails = false"
              class="text-gray-400 hover:text-gray-600"
            >
              <i class="pi pi-times text-xl"></i>
            </button>
          </div>
        </div>

        <div class="p-6">
          <div class="mb-4 text-sm text-gray-600">
            <div class="font-medium">Import Summary:</div>
            <div>Total rows: {{ supImportSummary?.total }}, Created: {{ supImportSummary?.created }}, Updated: {{ supImportSummary?.updated }}, Errors: {{ supImportSummary?.errors }}</div>
          </div>
        </div>

        <div class="space-y-3 max-h-96 overflow-y-auto">
          <div 
            v-for="result in supImportSummary?.results.filter(r => r.status === 'error')" 
            :key="result.row"
            class="p-4 bg-red-50 border border-red-200 rounded-lg"
          >
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <div class="font-medium text-red-800 text-lg">Row {{ result.row }}</div>
                <div class="text-red-600 text-sm mt-2 font-medium">Error Details:</div>
                <div class="text-red-700 text-sm mt-1 bg-red-100 p-2 rounded border-l-4 border-red-400">
                  {{ result.error }}
                </div>
                <div v-if="result.nationalId" class="text-red-500 text-xs mt-2 bg-red-100 p-2 rounded">
                  <strong>National ID:</strong> {{ result.nationalId }}
                </div>
                <div class="text-gray-600 text-xs mt-2">
                  <strong>Tip:</strong> Check that all required columns are present and data is properly formatted.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-6 flex justify-end">
          <button 
            @click="showSupErrorDetails = false"
            class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'superadmin-auth' })

const stats = reactive({ totalAssessments: 0, totalStudents: 0, totalSupervisors: 0, averageScore: 0, csvImportedStudents: 0 })
const csvImportSummary = ref(null)
const supImportSummary = ref(null)
const showErrorDetails = ref(false)
const showSupErrorDetails = ref(false)

const admins = ref([])
const supervisors = ref([])
const districts = ref([])
const newDistrict = ref('')
const newAdmin = ref({ fullName: '', email: '', password: '', role: 'admin', assignedDistrictId: undefined })
const newSupervisor = ref({ fullName: '', email: '', phoneNumber: '', nationalId: '', pin: '', districtId: undefined })
const resetForm = ref({ id: undefined, email: '', newPassword: '' })

// Password reset modal
const showPasswordModal = ref(false)
const selectedSupervisor = ref(null)
const passwordForm = ref({ newPassword: '', confirmPassword: '' })

// District management modal
const showDistrictModal = ref(false)
const selectedDistricts = ref([])

// Track which supervisors have details revealed
const revealedSupervisorIds = ref(new Set())

const loadStats = async () => {
  try {
    const [assessmentsRes, csvCountRes, supervisorsRes] = await Promise.all([
      $fetch('/api/assessments'),
      $fetch('/api/students/csv-imported-count'),
      $fetch('/api/supervisors')
    ])
    stats.totalAssessments = assessmentsRes.statistics?.totalAssessments || 0
    stats.totalStudents = assessmentsRes.statistics?.totalStudents || 0
    stats.totalSupervisors = supervisorsRes.supervisors?.length || 0
    stats.averageScore = assessmentsRes.statistics?.averageScore || 0
    stats.csvImportedStudents = csvCountRes.csvImportedStudents || 0
  } catch (e) {
    // ignore
  }
}

const loadDistrictsAdmins = async () => {
  try {
    const [d, a, s] = await Promise.all([
      $fetch('/api/districts'),
      $fetch('/api/admins'),
      $fetch('/api/supervisors'),
    ])
    districts.value = d.districts || []
    admins.value = a.admins || []
    supervisors.value = s.supervisors || []
    
    // Update supervisor count in stats
    stats.totalSupervisors = supervisors.value.length
  } catch (e) {
    // ignore
  }
}

const createSupervisor = async (evt) => {
  if (evt && evt.preventDefault) evt.preventDefault()
  try {
    const payload = { ...newSupervisor.value }
    await $fetch('/api/supervisors', { method: 'POST', body: payload })
    alert('Supervisor created')
    newSupervisor.value = { fullName: '', email: '', phoneNumber: '', nationalId: '', pin: '', districtId: undefined }
    await loadDistrictsAdmins()
    await loadStats()
  } catch (e) {
    alert('Failed to create supervisor')
  }
}

const onAssignSupervisorDistrict = async (supervisorId, value) => {
  try {
    const districtId = value ? parseInt(String(value)) : undefined
    if (!districtId) return
    await $fetch('/api/supervisors/assign-district', { method: 'POST', body: { supervisorId, districtId } })
    await loadDistrictsAdmins()
  } catch (e) {
    alert('Failed to assign district')
  }
}

const deleteSupervisor = async (id) => {
  if (!confirm('Delete this supervisor?')) return
  try {
    await $fetch(`/api/supervisors/${id}`, { method: 'DELETE' })
    await loadDistrictsAdmins()
  } catch (e) {
    alert('Failed to delete supervisor')
  }
}

const loadSupervisors = async () => {
  try {
    const res = await $fetch('/api/supervisors')
    supervisors.value = res.supervisors || []
  } catch (e) {
    // ignore
  }
}

const onImportStudentsCsv = async (e) => {
  const file = e.target.files?.[0]
  if (!file) return
  try {
    const form = new FormData()
    form.append('file', file)
    const result = await $fetch('/api/students/import-csv', { method: 'POST', body: form })
    csvImportSummary.value = result
    
    if (result.errors > 0) {
      // Show detailed error information
      console.log('Import errors:', result.results.filter(r => r.status === 'error'))
      alert(`Students import completed with ${result.errors} errors. Click "View Error Details" to see specific issues.`)
    } else {
      alert(`Students import successful! Created: ${result.created}, Updated: ${result.updated}`)
    }
  } catch (err) {
    console.error('CSV import error:', err)
    const errorMessage = err.data?.statusMessage || err.message || 'Please verify the CSV format and try again.'
    alert(`Import failed: ${errorMessage}`)
  } finally {
    e.target.value = ''
  }
}

const onImportSupervisorsCsv = async (e) => {
  const file = e.target.files?.[0]
  if (!file) return
  try {
    const form = new FormData()
    form.append('file', file)
    const result = await $fetch('/api/supervisors/import-csv', { method: 'POST', body: form })
    supImportSummary.value = result
    
    if (result.errors > 0) {
      // Show detailed error information
      console.log('Supervisor import errors:', result.results.filter(r => r.status === 'error'))
      alert(`Supervisors import completed with ${result.errors} errors. Check the console for details.`)
    } else {
      alert(`Supervisors import successful! Created: ${result.created}, Updated: ${result.updated}`)
    }
  } catch (err) {
    console.error('Supervisor CSV import error:', err)
    const errorMessage = err.data?.statusMessage || err.message || 'Please verify the CSV format and try again.'
    alert(`Import failed: ${errorMessage}`)
  } finally {
    e.target.value = ''
  }
}

const createAdmin = async (evt) => {
  if (evt && evt.preventDefault) evt.preventDefault()
  try {
    const payload = { ...newAdmin.value }
    const res = await $fetch('/api/admins', { method: 'POST', body: payload })
    alert('Admin created')
    newAdmin.value = { fullName: '', email: '', password: '', role: 'admin', assignedDistrictId: undefined }
    await loadDistrictsAdmins()
  } catch (e) {
    alert('Failed to create admin')
  }
}

const addDistrict = async () => {
  if (!newDistrict.value.trim()) return
  try {
    await $fetch('/api/districts', { method: 'POST', body: { name: newDistrict.value.trim() } })
    newDistrict.value = ''
    await loadDistrictsAdmins()
  } catch (e) {
    alert('Failed to add district')
  }
}

const onAssignDistrict = async (adminId, value) => {
  try {
    const districtId = value ? parseInt(String(value)) : undefined
    if (!districtId) return
    await $fetch('/api/admins/assign-district', { method: 'POST', body: { adminId, districtId } })
    await loadDistrictsAdmins()
  } catch (e) {
    alert('Failed to assign district')
  }
}

const deleteAdmin = async (id) => {
  if (!confirm('Delete this admin?')) return
  try {
    await $fetch(`/api/admins/${id}`, { method: 'DELETE' })
    await loadDistrictsAdmins()
  } catch (e) {
    alert('Failed to delete admin')
  }
}

const resetAdminPassword = async (evt) => {
  if (evt && evt.preventDefault) evt.preventDefault()
  try {
    if (!resetForm.value.newPassword.trim()) {
      alert('Enter a new password')
      return
    }
    const payload = { newPassword: resetForm.value.newPassword }
    if (resetForm.value.email && resetForm.value.email.trim()) payload.email = resetForm.value.email.trim().toLowerCase()
    if (!payload.email && resetForm.value.id) payload.id = resetForm.value.id
    if (!payload.email && !payload.id) {
      alert('Provide email or ID to reset')
      return
    }
    await $fetch('/api/admins/reset-password', { method: 'POST', body: payload })
    alert('Password reset successful')
    resetForm.value = { id: undefined, email: '', newPassword: '' }
  } catch (e) {
    alert('Failed to reset password')
  }
}

const saveSupervisorPhone = async (s) => {
  try {
    await $fetch(`/api/supervisors/${s.id}`, { method: 'PUT', body: { phoneNumber: s.phoneNumber } })
    alert('Phone updated')
  } catch (e) {
    alert('Failed to update phone')
  }
}

const testSupervisorLogin = async (s) => {
  try {
    const last4 = (s.phoneNumber || '').replace(/\D/g, '').slice(-4)
    if (!last4) {
      alert('Supervisor phone must have at least 4 digits')
      return
    }
    
    // Perform a test login request without navigating; this will set cookies in dev
    await $fetch('/api/auth/supervisor-login', { method: 'POST', body: { nationalId: s.nationalId, pin: last4 } })
    alert('Test login successful')
  } catch (e) {
    alert('Test login failed')
  }
}

const openPasswordModal = (supervisor) => {
  selectedSupervisor.value = supervisor
  passwordForm.value = { newPassword: '', confirmPassword: '' }
  showPasswordModal.value = true
}

const closePasswordModal = () => {
  showPasswordModal.value = false
  selectedSupervisor.value = null
  passwordForm.value = { newPassword: '', confirmPassword: '' }
}

const resetSupervisorPassword = async () => {
  try {
    if (!passwordForm.value.newPassword.trim()) {
      alert('Enter a new password')
      return
    }
    
    if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
      alert('Passwords do not match')
      return
    }
    
    if (passwordForm.value.newPassword.length < 4) {
      alert('Password must be at least 4 characters long')
      return
    }
    
    const payload = {
      supervisorId: selectedSupervisor.value.id,
      newPassword: passwordForm.value.newPassword
    }
    
    await $fetch('/api/supervisors/reset-password', { method: 'POST', body: payload })
    alert('Supervisor password updated successfully')
    closePasswordModal()
  } catch (e) {
    alert('Failed to update password: ' + (e.data?.message || e.message || 'Unknown error'))
  }
}

// District management methods
const openDistrictModal = (supervisor) => {
  selectedSupervisor.value = supervisor
  selectedDistricts.value = supervisor.districts?.map(d => d.district.id) || []
  showDistrictModal.value = true
}

const closeDistrictModal = () => {
  showDistrictModal.value = false
  selectedSupervisor.value = null
  selectedDistricts.value = []
}

const saveSupervisorDistricts = async () => {
  try {
    if (!selectedSupervisor.value) return
    
    const payload = {
      supervisorId: selectedSupervisor.value.id,
      districtIds: selectedDistricts.value
    }
    
    await $fetch('/api/supervisors/assign-districts', { method: 'POST', body: payload })
    alert('Supervisor districts updated successfully')
    
    // Refresh supervisors list
    await loadDistrictsAdmins()
    closeDistrictModal()
  } catch (e) {
    alert('Failed to update districts: ' + (e.data?.message || e.message || 'Unknown error'))
  }
}

const downloadAllCsv = async () => {
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
  }
}

const downloadAllPdfs = async () => {
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
  }
}

// Function to analyze error patterns
const getErrorSummary = () => {
  if (!csvImportSummary.value?.results) return {}
  
  const errorCounts = {}
  const errorResults = csvImportSummary.value.results.filter(r => r.status === 'error')
  
  errorResults.forEach(result => {
    const error = result.error || 'Unknown error'
    let errorType = 'Other'
    
    if (error.includes('Missing required fields')) {
      errorType = 'Missing Required Fields'
    } else if (error.includes('Invalid email format')) {
      errorType = 'Invalid Email Format'
    } else if (error.includes('Invalid sex value')) {
      errorType = 'Invalid Sex Value'
    } else if (error.includes('columns but header has')) {
      errorType = 'Column Count Mismatch'
    } else if (error.includes('Missing required columns')) {
      errorType = 'Missing Required Columns'
    }
    
    errorCounts[errorType] = (errorCounts[errorType] || 0) + 1
  })
  
  return errorCounts
}

// Helper functions for masking sensitive data
const toggleSupervisorDetails = (supervisorId) => {
  if (revealedSupervisorIds.value.has(supervisorId)) {
    revealedSupervisorIds.value.delete(supervisorId)
  } else {
    revealedSupervisorIds.value.add(supervisorId)
  }
  // Force reactivity update
  revealedSupervisorIds.value = new Set(revealedSupervisorIds.value)
}

const isSupervisorRevealed = (supervisorId) => {
  return revealedSupervisorIds.value.has(supervisorId)
}

const maskEmail = (email) => {
  if (!email) return '••••••••'
  const [local, domain] = email.split('@')
  if (!domain) return '••••••••'
  return `${local.substring(0, 2)}••••@${domain}`
}

const maskPhone = (phone) => {
  if (!phone) return '••••••••'
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length < 4) return '••••••••'
  return `••••${cleaned.slice(-4)}`
}

const maskNationalId = (nationalId) => {
  if (!nationalId) return '••••••••'
  if (nationalId.length < 4) return '••••••••'
  return `••••${nationalId.slice(-4)}`
}

onMounted(() => { loadStats(); loadDistrictsAdmins(); loadSupervisors() })
</script>

