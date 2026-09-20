#!/bin/bash
# Verification script for offline PWA fix
# Run after: npm run build

set -e

echo "============================================"
echo "Offline PWA Fix Verification"
echo "============================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

SUCCESS="${GREEN}✅${NC}"
FAIL="${RED}❌${NC}"
INFO="${YELLOW}ℹ${NC}"

FAILED=0

# Check 1: HTML files exist
echo "1. Checking HTML files exist..."
if [ -f ".output/public/supervisor/index.html" ]; then
    SIZE=$(du -h .output/public/supervisor/index.html | cut -f1)
    echo -e "   $SUCCESS supervisor/index.html exists (${SIZE})"
else
    echo -e "   $FAIL supervisor/index.html NOT FOUND"
    FAILED=1
fi

if [ -f ".output/public/assessment/new/index.html" ]; then
    SIZE=$(du -h .output/public/assessment/new/index.html | cut -f1)
    echo -e "   $SUCCESS assessment/new/index.html exists (${SIZE})"
else
    echo -e "   $FAIL assessment/new/index.html NOT FOUND"
    FAILED=1
fi

echo ""

# Check 2: HTML contains app shell (not meta-refresh)
echo "2. Checking HTML content..."

if grep -q "importmap" .output/public/supervisor/index.html; then
    echo -e "   $SUCCESS supervisor HTML has importmap (Nuxt entry)"
else
    echo -e "   $FAIL supervisor HTML missing importmap"
    FAILED=1
fi

if grep -q "http-equiv=\"refresh\"" .output/public/supervisor/index.html; then
    echo -e "   $FAIL supervisor HTML contains meta-refresh redirect"
    FAILED=1
else
    echo -e "   $SUCCESS supervisor HTML has no meta-refresh"
fi

if grep -q "window.__NUXT__" .output/public/supervisor/index.html; then
    echo -e "   $SUCCESS supervisor HTML has Nuxt state"
else
    echo -e "   $FAIL supervisor HTML missing Nuxt state"
    FAILED=1
fi

echo ""

# Check 3: Service worker exists
echo "3. Checking service worker..."
if [ -f ".output/public/sw.js" ]; then
    SIZE=$(du -h .output/public/sw.js | cut -f1)
    echo -e "   $SUCCESS sw.js exists (${SIZE})"
else
    echo -e "   $FAIL sw.js NOT FOUND"
    FAILED=1
    exit 1
fi

echo ""

# Check 4: Service worker precache includes HTML
echo "4. Checking service worker precache..."

if ! command -v node &> /dev/null; then
    echo -e "   ${YELLOW}⚠${NC} Node.js not found, skipping SW content check"
else
    node <<'EOF'
const fs = require('fs');
const sw = fs.readFileSync('.output/public/sw.js', 'utf8');

const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const NC = '\x1b[0m';
const SUCCESS = `${GREEN}✅${NC}`;
const FAIL = `${RED}❌${NC}`;

let failed = false;

// Check for HTML in precache
const hasSuper = sw.includes('url:"supervisor"') || sw.includes('url:\\"supervisor\\"');
const hasAssess = sw.includes('url:"assessment/new"') || sw.includes('url:\\"assessment/new\\"');

if (hasSuper) {
    console.log(`   ${SUCCESS} Precache includes supervisor`);
} else {
    console.log(`   ${FAIL} Precache missing supervisor`);
    failed = true;
}

if (hasAssess) {
    console.log(`   ${SUCCESS} Precache includes assessment/new`);
} else {
    console.log(`   ${FAIL} Precache missing assessment/new`);
    failed = true;
}

// Check navigation fallback
const match = sw.match(/createHandlerBoundToURL\("([^"]+)"\)/);
if (match) {
    const fallback = match[1];
    console.log(`   ${SUCCESS} NavigateFallback: ${fallback}`);
    
    const fallbackInCache = sw.includes(`url:"${fallback.replace(/^\//, '')}"`) || 
                            sw.includes(`url:\\"${fallback.replace(/^\//, '')}\\"`);
    if (fallbackInCache) {
        console.log(`   ${SUCCESS} Fallback URL is in precache`);
    } else {
        console.log(`   ${FAIL} Fallback URL NOT in precache`);
        failed = true;
    }
} else {
    console.log(`   ${FAIL} NavigateFallback not found`);
    failed = true;
}

if (failed) {
    process.exit(1);
}
EOF
    if [ $? -ne 0 ]; then
        FAILED=1
    fi
fi

echo ""
echo "============================================"

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ ALL CHECKS PASSED${NC}"
    echo ""
    echo "The offline PWA fix is correctly implemented!"
    echo ""
    echo "Next steps:"
    echo "  1. Deploy to production (pm2 restart)"
    echo "  2. Visit site online and login"
    echo "  3. Open DevTools → Application → Cache Storage"
    echo "  4. Verify HTML entries are cached"
    echo "  5. Go offline (Network tab)"
    echo "  6. Reload → should load from cache ✅"
    echo ""
    exit 0
else
    echo -e "${RED}❌ SOME CHECKS FAILED${NC}"
    echo ""
    echo "Please fix the issues above before deploying."
    echo ""
    echo "Common fixes:"
    echo "  - Run: npm run build"
    echo "  - Check middleware has: if (import.meta.prerender) return"
    echo "  - Check nuxt.config.ts has: nitro.prerender.routes"
    echo ""
    exit 1
fi
