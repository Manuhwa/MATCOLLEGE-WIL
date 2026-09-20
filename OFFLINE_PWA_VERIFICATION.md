# Offline PWA Verification Guide

## What Was Fixed

The MATCOLLEGE-WIL PWA now supports fully offline access for supervisors. Previously, the app would show "site can't be reached" when opened or reloaded while completely offline, even after visiting online. This was because:

1. **Before:** Service worker precached only JS/CSS assets, no HTML
2. **Before:** `navigateFallback` pointed to `/assessment/new` which wasn't in cache
3. **After:** Nitro prerender generates HTML shells for `/supervisor` and `/assessment/new`
4. **After:** Service worker precaches these HTML files and uses `/supervisor` as fallback

## Quick Verification Steps

### 1. Build Verification (Automated)

```bash
npm run build
```

**Check for success indicators:**
- Build completes without errors
- PWA section shows: `precache X entries`
- Files exist:
  - `.output/public/supervisor/index.html`
  - `.output/public/assessment/new/index.html`
  - `.output/public/sw.js`

**Verify precache includes HTML:**
```bash
node -e "const sw = require('fs').readFileSync('.output/public/sw.js', 'utf8'); console.log(sw.includes('url:\"supervisor\"') && sw.includes('url:\"assessment/new\"') ? '✅ HTML routes precached' : '❌ HTML routes missing');"
```

### 2. Manual Browser Test (Production/Staging)

**Prerequisites:**
- Chrome/Edge browser with DevTools
- Deployed site (e.g., https://matcollegewil.co.zw)

**Steps:**

1. **Online Setup (First Visit)**
   - Open DevTools (F12) → Application tab
   - Navigate to the site while **online**
   - Log in as a supervisor
   - Navigate through the app:
     - Visit supervisor dashboard (`/supervisor`)
     - Click "New Assessment" to visit assessment form
   
2. **Verify Service Worker Installation**
   - In Application tab → Service Workers section:
     - Should show service worker is **Activated and Running**
   - In Application tab → Cache Storage:
     - Should see `workbox-precache-v2-https://...` (or similar)
     - Open it and verify these entries exist:
       - `supervisor` (or `/supervisor`)
       - `assessment/new` (or `/assessment/new`)
       - Various `_nuxt/*.js` and `_nuxt/*.css` files

3. **Test Offline Reload**
   - In DevTools → Network tab, check ☑️ **Offline**
   - Reload the page (Ctrl+R / Cmd+R)
   - **✅ Expected Result:** 
     - Page loads successfully
     - Supervisor dashboard UI appears
     - No "site can't be reached" error
     - Can interact with UI, IndexedDB data is available
   
4. **Test Offline Navigation**
   - Still offline, click "New Assessment" link
   - **✅ Expected Result:**
     - Assessment form loads from cache
     - Form UI renders
     - Can fill form, data saves to IndexedDB offline queue
   
5. **Test Offline New Tab**
   - Still offline, open a new tab
   - Navigate directly to the site URL
   - **✅ Expected Result:**
     - Either redirects to login (if session expired)
     - Or loads supervisor dashboard if session cookie still valid
     - No "site can't be reached" error

6. **Test Sync When Back Online**
   - Uncheck **Offline** in DevTools Network tab
   - Wait a moment for online event
   - **✅ Expected Result:**
     - Console may show sync activity
     - Offline queued assessments sync to server
     - Badge count updates

### 3. Mobile Device Test

**On Android/iOS:**

1. Install PWA:
   - Visit site online
   - Tap "Install App" button in supervisor dashboard
   - Or use browser's "Add to Home Screen"

2. Use online:
   - Open installed app
   - Log in, navigate around
   - Let service worker cache everything

3. Go fully offline:
   - Enable Airplane Mode
   - Close and reopen the PWA app
   - **✅ Expected:** App loads and works offline

## Technical Details

### Configuration Changes

**File:** `nuxt.config.ts`

**Added:**
```typescript
nitro: {
  experimental: {
    wasm: true
  },
  prerender: {
    routes: ['/supervisor', '/assessment/new']
  }
}
```

**Updated PWA workbox config:**
```typescript
workbox: {
  navigateFallback: '/supervisor',  // Changed from '/assessment/new'
  navigateFallbackDenylist: [/^\/api\//, /^\/assets\//],  // Added
  // ... rest unchanged
}
```

### How It Works

1. **Build Time:**
   - Nitro prerender runs and generates static HTML for `/supervisor` and `/assessment/new`
   - Files written to `.output/public/supervisor/index.html` and `.output/public/assessment/new/index.html`
   - Vite PWA plugin scans `.output/public/` with `globPatterns: ['**/*.{js,css,html,svg,png,ico}']`
   - Finds the HTML files and includes them in precache manifest
   - Workbox generates `sw.js` with precache list

2. **First Online Visit:**
   - Browser loads site normally via SSR
   - Service worker registers and installs
   - Precache downloads and caches all assets including HTML shells
   - Runtime caching rules start working for subsequent navigations

3. **Offline Reload:**
   - Browser tries to navigate to site URL
   - Service worker intercepts via `NavigationRoute`
   - Returns cached `/supervisor` HTML from precache
   - HTML loads and boots Vue app client-side
   - Vue Router hydrates and takes over routing
   - App can access IndexedDB for offline data/queue

4. **Offline Client-Side Navigation:**
   - User clicks links within app
   - Vue Router handles navigation client-side (no network request)
   - Components load from cached JS bundles
   - IndexedDB provides data for offline queue and students

### What Still Requires Network

- **First-time login:** Auth endpoints (`/api/auth/*`) are not cached (security)
- **Initial visit:** User must visit online at least once to populate caches
- **Session refresh:** If session expires, login requires network

### Compatibility

- ✅ SSR mode (default Nuxt 4)
- ✅ Existing Contabo PM2 Node.js deployment
- ✅ All existing offline composables and plugins
- ✅ IndexedDB offline queue
- ✅ Install prompt functionality

## Troubleshooting

### "Site can't be reached" still appears offline

**Possible causes:**
1. User never visited online to populate cache
   - **Fix:** Visit site online first
2. Service worker not installed
   - **Fix:** Check DevTools → Application → Service Workers
3. Cache was cleared
   - **Fix:** Visit online again to repopulate
4. Service worker update pending
   - **Fix:** Close all tabs, reopen to activate new SW

### Service worker shows old version

**Solution:**
1. DevTools → Application → Service Workers
2. Check "Update on reload"
3. Click "Unregister" on old worker
4. Reload page

### HTML not in precache manifest

**Verify build config:**
```bash
# Check nuxt.config.ts has:
nitro: {
  prerender: {
    routes: ['/supervisor', '/assessment/new']
  }
}

# Rebuild:
npm run build

# Verify HTML files exist:
ls -la .output/public/supervisor/index.html
ls -la .output/public/assessment/new/index.html
```

### Offline queue not syncing when back online

This is a separate feature, unrelated to this fix. Check:
- `plugins/offline-sync.client.ts` is running
- `useOfflineSync` composable is working
- Browser console for sync errors
- Network requests in DevTools

## Deployment Checklist

- [ ] Build succeeds: `npm run build`
- [ ] HTML files in `.output/public/supervisor/` and `.output/public/assessment/new/`
- [ ] Service worker precaches HTML (verify in `sw.js`)
- [ ] Deploy `.output/` to Contabo server
- [ ] PM2 restart if needed
- [ ] Visit production site online
- [ ] Verify service worker installs
- [ ] Test offline reload works
- [ ] Test offline queue sync when back online

## References

- Nuxt 4 SSR Mode: https://nuxt.com/docs/guide/concepts/rendering
- Nitro Prerender: https://nitro.unjs.io/config#prerender
- @vite-pwa/nuxt: https://vite-pwa-org.netlify.app/frameworks/nuxt.html
- Workbox Navigation Route: https://developer.chrome.com/docs/workbox/modules/workbox-routing#navigation-route
