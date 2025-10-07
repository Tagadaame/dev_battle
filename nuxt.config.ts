// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
compatibilityDate: '2024-11-01',
devtools: { enabled: true },
modules: [
'@pinia/nuxt',
['@nuxtjs/tailwindcss', { viewer: false }]
],
typescript: { strict: true },
app: {
head: {
title: 'Dev Battle – CLI',
meta: [
{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
{ name: 'description', content: 'Mini‑jeu CLI: tape la commande affichée, le plus rapide gagne !' }
]
}
}
})