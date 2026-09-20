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
            navigateFallback: '/supervisor',
            navigateFallbackDenylist: [/^\/api\//, /^\/assets\//],
            globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
            runtimeCaching: [
                {
                    urlPattern: /^https?:\/\/.*\/(assessment|supervisor).*$/,
                    handler: 'StaleWhileRevalidate',
                    options: { cacheName: 'pages-cache' }
                },
                {
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
            navigateFallback: null,
            suppressWarnings: true
        }
    },
    nitro: {
        experimental: {
            wasm: true
        },
        prerender: {
            routes: ['/supervisor', '/assessment/new']
        }
    },
    runtimeConfig: {
        databaseUrl: process.env.DATABASE_URL || 'mysql://root:@localhost:3306/madziwa'
    },
    compatibilityDate: '2025-07-15',
    devtools: { enabled: true },
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