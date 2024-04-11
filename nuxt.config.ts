// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1, maximum-scale=1",
      link: [
        {
          rel: "icon",
          type: "image/png",
          href: "/favicon.png",
        },
      ],
      htmlAttrs: {
        lang: "en",
      },
    },
  },
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "@nuxt/image", "nuxt-icon", "@vueuse/nuxt"],
  nitro: {
    experimental: {
      database: true,
    },
  },
  image: {
    domains: ["https://picsum.photos", "https://i.pravatar.cc"],
    presets: {
      "avatar-sm": {
        modifiers: {
          format: "webp",
          width: 25,
          height: 25,
        },
      },
      "avatar-md": {
        modifiers: {
          format: "webp",
          width: 50,
          height: 50,
        },
      },
    },
  },
  routeRules: {
    "/": {
      ssr: false,
    },
  },
});
