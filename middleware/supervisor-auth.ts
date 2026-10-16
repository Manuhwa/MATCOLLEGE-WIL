export default defineNuxtRouteMiddleware(() => {
  if (import.meta.prerender) {
    return
  }
  
  const role = useCookie('role')
  if (role.value !== 'supervisor' && role.value !== 'superadmin') {
    return navigateTo('/supervisor-login')
  }
})

