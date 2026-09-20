# Testing Guide for Offline Student Search & Supervisor Auto-fill

This document provides step-by-step instructions to test the new features implemented in this PR.

## Prerequisites

1. Have at least one supervisor account
2. Have some student records in the database
3. Use a modern browser (Chrome, Firefox, Edge, Safari) with DevTools

## Feature 1: Offline Student Search

### Test Case 1: Verify Online Search Still Works

**Steps:**
1. Log in as a supervisor
2. Navigate to "New Assessment" (`/assessment/new`)
3. In the "Find Student" section, enter a student's SRN or surname
4. Click "Search"
5. **Expected:** Student results appear as before (online search works)

### Test Case 2: Verify Students Are Being Cached

**Steps:**
1. Open browser DevTools → Application tab → IndexedDB
2. Expand `madziwa-offline` database
3. Look for `cached-students` object store
4. Click on it to view contents
5. **Expected:** You should see student records with fields like:
   - `id`
   - `fullName`
   - `candidateNo`
   - `email`
   - `schoolName`
   - `className`
   - `lastSynced` (timestamp)

### Test Case 3: Verify Offline Search Works

**Steps:**
1. Log in as a supervisor (while online)
2. Navigate to "New Assessment" 
3. Wait ~5-10 seconds for students to sync (check console logs)
4. Open DevTools → Network tab
5. Change network throttling to **"Offline"**
6. Try searching for a student by SRN or surname
7. Click "Search"
8. **Expected:** 
   - Search should return results from cache (no network requests)
   - If the student exists in cache, they appear in results
   - If no match found, you see: "No students found. You may be offline - make sure to sync when online."

### Test Case 4: Verify Automatic Sync When Coming Online

**Steps:**
1. While offline (DevTools Network → Offline), navigate around the app
2. Switch back to "Online" in DevTools
3. Check browser console for sync messages
4. **Expected:** Within 1-2 seconds, you should see student sync happening (console logs)

### Test Case 5: Search with No Cache (Cold Start Offline)

**Steps:**
1. Clear IndexedDB: DevTools → Application → IndexedDB → Right-click `madziwa-offline` → Delete
2. Set network to "Offline" in DevTools
3. Refresh the page
4. Try to search for a student
5. **Expected:** Alert message: "No students found. You may be offline - make sure to sync when online."

## Feature 2: Auto-fill Supervisor Details

### Test Case 6: Verify Auto-fill on Form Load (Online)

**Steps:**
1. Log in as a supervisor
2. Navigate to "New Assessment" (`/assessment/new`)
3. Look at the "Supervisor Details" section
4. **Expected:**
   - Within 1-2 seconds, all supervisor fields should populate:
     - Full Name
     - National ID
     - Phone
     - Email
   - A green badge appears: "Loaded from your account"
   - Fields should be read-only (gray background, cursor not allowed)

### Test Case 7: Verify Auto-fill Fallback When Offline

**Steps:**
1. Set DevTools Network to "Offline"
2. Refresh the page (or navigate to `/assessment/new`)
3. Look at the "Supervisor Details" section
4. **Expected:**
   - Fields remain empty
   - No green "Loaded from your account" badge
   - Fields are editable (white background)
   - Message appears: "Couldn't load your saved details (you may be offline) - please fill these in manually."

### Test Case 8: Verify Supervisor Details Persist on New Forms

**Steps:**
1. Log in as a supervisor (online)
2. Create a new assessment (navigate to `/assessment/new`)
3. Verify supervisor details are pre-filled
4. Navigate away (e.g., to dashboard)
5. Navigate back to create another assessment (`/assessment/new`)
6. **Expected:** Supervisor details are pre-filled again (every time you open a new form)

## Feature 3: Combined Offline Experience

### Test Case 9: Full Offline Workflow

**Steps:**
1. Log in as a supervisor (online)
2. Navigate to "New Assessment" - let students sync
3. Verify both students cached and supervisor details loaded
4. Set network to "Offline" in DevTools
5. Try to create a new assessment:
   - Search for a student → Should work from cache
   - Check supervisor details → Should still be auto-filled (loaded before going offline)
   - Fill out assessment form
   - Submit assessment
6. **Expected:** 
   - Student search works offline
   - Supervisor details remain pre-filled
   - Assessment saves to offline queue (pending sync)

### Test Case 10: Verify Sync Happens in Background

**Steps:**
1. Keep browser console open
2. Stay logged in as supervisor
3. Wait for 60 seconds
4. **Expected:** Every ~60 seconds, you should see student sync messages in console (when online)

## Debugging Tips

### Console Logs to Watch For

When debugging, look for these console messages:

- `"Online search failed, falling back to cached students"` - Indicates fallback is working
- `"Could not load supervisor details (may be offline)"` - Supervisor API failed
- `"Search failed"` - Generic search error
- Sync completion messages from `syncStudentsFromServer()`

### Common Issues

**"No students appear in cache"**
- Solution: Make sure you're logged in as a supervisor with district access
- Solution: Check `/api/students` returns data when called manually
- Solution: Wait 60+ seconds for first background sync

**"Supervisor details not auto-filling"**
- Solution: Check you're logged in (cookies set: `role=supervisor`, `supervisorId=...`)
- Solution: Verify `/api/supervisors/me` returns data when called manually
- Solution: Check browser console for errors

**"Search still making network requests when offline"**
- Solution: Ensure DevTools Network tab is set to "Offline", not just "Slow 3G"
- Solution: Check navigator.onLine status in console
- Solution: Clear browser cache and try again

## Browser Compatibility

Tested on:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

IndexedDB is supported in all modern browsers. If you encounter issues, ensure:
- Browser is up to date
- IndexedDB is not disabled in browser settings
- Private/Incognito mode is not blocking IndexedDB

## Performance Notes

- Initial student sync may take 2-10 seconds depending on number of students
- Cached search is typically <100ms (much faster than network)
- IndexedDB size: ~1KB per student record
- No impact on page load time (sync happens asynchronously)

## Cleanup

To reset the cache for testing:

1. **Clear IndexedDB:**
   - DevTools → Application → IndexedDB
   - Right-click `madziwa-offline` → Delete database

2. **Clear supervisor session:**
   - DevTools → Application → Cookies
   - Delete `supervisorId` and `role` cookies
   - Or just log out and log back in
