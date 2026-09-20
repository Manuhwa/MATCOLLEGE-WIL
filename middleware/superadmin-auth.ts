export default defineNuxtRouteMiddleware(() => {
  if (import.meta.prerender) {
    return
  }
  
  const role = useCookie('role')
  if (role.value !== 'superadmin') {
    return navigateTo('/admin-login')
  }
})

