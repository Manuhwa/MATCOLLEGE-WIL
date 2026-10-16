<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header -->
    <header class="bg-white/90 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16 gap-2">
          <!-- Logo -->
          <div class="flex items-center min-w-0">
            <NuxtLink to="/" class="flex items-center gap-3 group min-w-0">
              <div class="w-10 h-10 shrink-0 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <i class="pi pi-graduation-cap text-white text-xl"></i>
              </div>
              <div class="min-w-0">
                <h1 class="text-base sm:text-xl font-bold truncate bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Madziwa Teachers College
                </h1>
                <p class="text-xs text-gray-500 truncate">WIL Assessment Platform</p>
              </div>
            </NuxtLink>
          </div>

          <!-- Desktop Navigation -->
          <nav class="hidden lg:flex items-center gap-4 xl:gap-6">
            <NuxtLink 
              to="/" 
              class="nav-link"
              :class="{ 'active': $route.path === '/' }"
            >
              <i class="pi pi-home mr-2"></i>
              Home
            </NuxtLink>
            <template v-if="role === 'supervisor'">
              <NuxtLink 
                to="/supervisor" 
                class="nav-link"
                :class="{ 'active': $route.path === '/supervisor' }"
              >
                <i class="pi pi-home mr-2"></i>
                Supervisor
              </NuxtLink>
              <NuxtLink 
                to="/assessment" 
                class="nav-link"
                :class="{ 'active': $route.path === '/assessment' || $route.path.startsWith('/assessment/') }"
              >
                <i class="pi pi-plus mr-2"></i>
                New Assessment
              </NuxtLink>
            </template>
            <template v-if="!isAuthenticated">
              <NuxtLink 
                to="/supervisor-login" 
                class="nav-link"
                :class="{ 'active': $route.path === '/supervisor-login' }"
              >
                <i class="pi pi-user mr-2"></i>
                Supervisor Login
              </NuxtLink>
              <NuxtLink 
                to="/admin-login" 
                class="nav-link"
                :class="{ 'active': $route.path === '/admin-login' }"
              >
                <i class="pi pi-shield mr-2"></i>
                Admin Login
              </NuxtLink>
            </template>
            <template v-if="role === 'admin' || role === 'superadmin'">
              <NuxtLink 
                to="/admin" 
                class="nav-link"
                :class="{ 'active': $route.path === '/admin' }"
              >
                <i class="pi pi-cog mr-2"></i>
                Admin
              </NuxtLink>
              <NuxtLink 
                to="/admin-students" 
                class="nav-link"
                :class="{ 'active': $route.path === '/admin-students' }"
              >
                <i class="pi pi-users mr-2"></i>
                Students
              </NuxtLink>
            </template>
            <template v-if="role === 'superadmin'">
              <NuxtLink 
                to="/supervisor" 
                class="nav-link"
                :class="{ 'active': $route.path === '/supervisor' }"
              >
                <i class="pi pi-briefcase mr-2"></i>
                Supervisor
              </NuxtLink>
              <NuxtLink 
                to="/superadmin" 
                class="nav-link"
                :class="{ 'active': $route.path === '/superadmin' }"
              >
                <i class="pi pi-shield mr-2"></i>
                Superadmin
              </NuxtLink>
            </template>
            <button
              v-if="role === 'supervisor' && pendingCount > 0"
              @click="syncQueue"
              :disabled="syncing"
              class="px-3 py-1.5 text-sm border rounded-lg text-amber-700 bg-amber-50 border-amber-200 hover:bg-amber-100 flex items-center gap-2"
              title="Assessments saved offline on this device, waiting to sync"
            >
              <i :class="syncing ? 'pi pi-spin pi-spinner' : 'pi pi-cloud-upload'"></i>
              {{ syncing ? 'Syncing…' : `${pendingCount} pending sync` }}
            </button>
            <button v-if="isAuthenticated" @click="logout" class="px-3 py-1.5 text-sm border rounded-lg text-gray-700 hover:bg-gray-100">Logout</button>
          </nav>

          <!-- Mobile menu button -->
          <div class="lg:hidden shrink-0">
            <button 
              @click="mobileMenuOpen = !mobileMenuOpen"
              aria-label="Toggle menu"
              class="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
            >
              <i :class="mobileMenuOpen ? 'pi pi-times' : 'pi pi-bars'" class="text-xl"></i>
            </button>
          </div>
        </div>

        <!-- Mobile Navigation -->
        <div v-if="mobileMenuOpen" class="lg:hidden py-4 border-t border-gray-200 max-h-[calc(100vh-4rem)] overflow-y-auto">
          <div class="flex flex-col space-y-4">
            <NuxtLink 
              to="/" 
              class="nav-link py-2"
              :class="{ 'active': $route.path === '/' }"
              @click="mobileMenuOpen = false"
            >
              <i class="pi pi-home mr-2"></i>
              Home
            </NuxtLink>
            <template v-if="role === 'supervisor'">
              <NuxtLink 
                to="/supervisor" 
                class="nav-link py-2"
                :class="{ 'active': $route.path === '/supervisor' }"
                @click="mobileMenuOpen = false"
              >
                <i class="pi pi-home mr-2"></i>
                Supervisor
              </NuxtLink>
              <NuxtLink 
                to="/assessment" 
                class="nav-link py-2"
                :class="{ 'active': $route.path === '/assessment' || $route.path.startsWith('/assessment/') }"
                @click="mobileMenuOpen = false"
              >
                <i class="pi pi-plus mr-2"></i>
                New Assessment
              </NuxtLink>
            </template>
            <template v-if="!isAuthenticated">
              <NuxtLink 
                to="/supervisor-login" 
                class="nav-link py-2"
                :class="{ 'active': $route.path === '/supervisor-login' }"
                @click="mobileMenuOpen = false"
              >
                <i class="pi pi-user mr-2"></i>
                Supervisor Login
              </NuxtLink>
              <NuxtLink 
                to="/admin-login" 
                class="nav-link py-2"
                :class="{ 'active': $route.path === '/admin-login' }"
                @click="mobileMenuOpen = false"
              >
                <i class="pi pi-shield mr-2"></i>
                Admin Login
              </NuxtLink>
            </template>
            <template v-if="role === 'admin' || role === 'superadmin'">
              <NuxtLink 
                to="/admin" 
                class="nav-link py-2"
                :class="{ 'active': $route.path === '/admin' }"
                @click="mobileMenuOpen = false"
              >
                <i class="pi pi-cog mr-2"></i>
                Admin
              </NuxtLink>
              <NuxtLink 
                to="/admin-students" 
                class="nav-link py-2"
                :class="{ 'active': $route.path === '/admin-students' }"
                @click="mobileMenuOpen = false"
              >
                <i class="pi pi-users mr-2"></i>
                Students
              </NuxtLink>
            </template>
            <template v-if="role === 'superadmin'">
              <NuxtLink 
                to="/supervisor" 
                class="nav-link py-2"
                :class="{ 'active': $route.path === '/supervisor' }"
                @click="mobileMenuOpen = false"
              >
                <i class="pi pi-briefcase mr-2"></i>
                Supervisor
              </NuxtLink>
              <NuxtLink 
                to="/superadmin" 
                class="nav-link py-2"
                :class="{ 'active': $route.path === '/superadmin' }"
                @click="mobileMenuOpen = false"
              >
                <i class="pi pi-shield mr-2"></i>
                Superadmin
              </NuxtLink>
            </template>
            <button
              v-if="role === 'supervisor' && pendingCount > 0"
              @click="syncQueue"
              :disabled="syncing"
              class="w-full text-left px-3 py-2 border rounded-lg text-amber-700 bg-amber-50 border-amber-200 hover:bg-amber-100 flex items-center gap-2"
            >
              <i :class="syncing ? 'pi pi-spin pi-spinner' : 'pi pi-cloud-upload'"></i>
              {{ syncing ? 'Syncing…' : `${pendingCount} assessment(s) pending sync` }}
            </button>
            <div v-if="isAuthenticated" class="pt-2">
              <button @click="() => { logout(); mobileMenuOpen = false }" class="w-full text-left px-3 py-2 border rounded-lg text-gray-700 hover:bg-gray-100">Logout</button>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid md:grid-cols-3 gap-8 grid-cols-1">
          <!-- College Info -->
          <div>
            <div class="flex items-center gap-3 mb-4 flex-wrap">
              <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <i class="pi pi-graduation-cap text-white"></i>
              </div>
              <h3 class="text-lg font-semibold">Madziwa Teachers College</h3>
            </div>
            <p class="text-gray-300 mb-4">
              Empowering educators through comprehensive WIL assessment and evaluation.
            </p>
            <div class="flex gap-4 flex-wrap">
              <a href="#" class="text-gray-400 hover:text-white transition-colors duration-200">
                <i class="pi pi-facebook text-xl"></i>
              </a>
              <a href="#" class="text-gray-400 hover:text-white transition-colors duration-200">
                <i class="pi pi-twitter text-xl"></i>
              </a>
              <a href="#" class="text-gray-400 hover:text-white transition-colors duration-200">
                <i class="pi pi-linkedin text-xl"></i>
              </a>
            </div>
          </div>

          <!-- Quick Links -->
          <div>
            <h3 class="text-lg font-semibold mb-4">Quick Links</h3>
            <ul class="space-y-2">
              <li>
                <NuxtLink to="/" class="text-gray-300 hover:text-white transition-colors duration-200">
                  Home
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/assessment/new" class="text-gray-300 hover:text-white transition-colors duration-200">
                  New Assessment
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/admin" class="text-gray-300 hover:text-white transition-colors duration-200">
                  Admin Dashboard
                </NuxtLink>
              </li>
            </ul>
          </div>

          <!-- Contact Info -->
          <div>
            <h3 class="text-lg font-semibold mb-4">Contact Us</h3>
            <div class="space-y-3">
              <div class="flex items-center gap-3 flex-wrap">
                <i class="pi pi-phone text-blue-400"></i>
                <a href="tel:+263772504845" class="text-gray-300 hover:text-white transition-colors duration-200">
                  +263772504845
                </a>
              </div>
              <div class="flex items-center gap-3 flex-wrap">
                <i class="pi pi-envelope text-blue-400"></i>
                <a href="mailto:info@madziwatc.ac.zw" class="text-gray-300 hover:text-white transition-colors duration-200">
                  info@madziwatc.ac.zw
                </a>
              </div>
              <div class="flex items-center gap-3 flex-wrap">
                <i class="pi pi-map-marker text-blue-400"></i>
                <span class="text-gray-300">
                  Madziwa, Zimbabwe
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom Footer -->
        <div class="border-t border-gray-700 mt-8 pt-8 text-center">
          <p class="text-gray-400">
            © {{ new Date().getFullYear() }} Madziwa Teachers College. All rights reserved. 
            <span class="text-blue-400">WIL Assessment Platform</span>
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useOfflineSync } from '~/composables/useOfflineSync'

const mobileMenuOpen = ref(false)
const role = useCookie('role')

const isAuthenticated = computed(() => !!role.value)

const { pendingCount, syncing, syncQueue } = useOfflineSync()

const logout = () => {
  const r = useCookie('role')
  const sid = useCookie('supervisorId')
  r.value = null
  sid.value = null
  navigateTo('/')
}
</script>

<style scoped>
/* Custom styles for the layout */
.nav-link {
  @apply text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200 
         relative after:absolute after:bottom-0 after:left-0 after:h-0.5 
         after:w-0 after:bg-blue-600 after:transition-all after:duration-300 
         hover:after:w-full;
}

.nav-link.active {
  @apply text-blue-600 after:w-full;
}

/* Smooth transitions */
* {
  transition: all 0.3s ease;
}

/* Custom scrollbar for the layout */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  @apply bg-gray-100 rounded-full;
}

::-webkit-scrollbar-thumb {
  @apply bg-gradient-to-b from-blue-400 to-blue-600 rounded-full;
}

::-webkit-scrollbar-thumb:hover {
  @apply bg-gradient-to-b from-blue-500 to-blue-700;
}
</style> 