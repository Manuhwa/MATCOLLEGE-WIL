export default defineNuxtRouteMiddleware((to, from) => {
  if (import.meta.prerender) {
    return
  }
  
  const role = useCookie('role')
  const isAdmin = role.value === 'admin' || role.value === 'superadmin'
  if (role.value === 'admin' && to.path.startsWith('/api/assessments/export')) {
    return navigateTo('/admin')
  }

  if (!isAdmin) {
    return navigateTo('/admin-login')
  }
})