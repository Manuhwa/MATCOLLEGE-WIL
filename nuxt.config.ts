// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    css: [
        'primeicons/primeicons.css',
        'assets/css/main.css'
    ],
    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
    },
    modules: [
        '@nuxtjs/tailwindcss',
        '@vite-pwa/nuxt'
    ],
    pwa: {
        filename: 'sw-offline-v2.js',
        registerType: 'autoUpdate',
        manifest: {
            name: 'Madziwa TP Assessment Platform',
            short_name: 'Madziwa WIL',
            description: 'Work Integrated Learning Assessment Platform - Madziwa Teachers College',
            theme_color: '#2563eb',
            background_color: '#ffffff',
            display: 'standalone',
            start_url: '/supervisor',
            icons: [
                { src: '/assets/images/logo.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' }
            ]
        },
        workbox: {
            navigateFallback: '/assessment/new',
            globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
            runtimeCaching: [
                {
                    // Assessment form & supervisor pages: serve cached copy first so
                    // they open instantly offline, refresh in the background when online
                    urlPattern: /^https?:\/\/.*\/(assessment|supervisor).*$/,
                    handler: 'StaleWhileRevalidate',
                    options: { cacheName: 'pages-cache' }
                },
                {
                    // Read-only API lookups used while filling the form (students, settings)
                    urlPattern: /^https?:\/\/.*\/api\/(students\/search|supervisors\/me|settings).*$/,
                    handler: 'NetworkFirst',
                    options: {
                        cacheName: 'api-cache',
                        networkTimeoutSeconds: 3,
                        expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 }
                    }
                }
            ]
        },
        devOptions: {
            enabled: true,
            type: 'module',
            // In dev, Vite serves files on-the-fly so there's nothing to precache -
            // suppress workbox's "no files matched" warnings for the dev SW build
            navigateFallback: null,
            suppressWarnings: true
        }
    },
    runtimeConfig: {
        databaseUrl: process.env.DATABASE_URL || 'mysql://root:@localhost:3306/madziwa'
    },
    compatibilityDate: '2025-07-15',
    devtools: { enabled: true },
    nitro: {
        experimental: {
            wasm: true
        }
    },
    vite: {
        server: {
            allowedHosts: [
                'paleethnological-unextinguishable-donte.ngrok-free.dev',
                '.ngrok-free.dev',
                '.ngrok.io'
            ]
        }
    }
}) 