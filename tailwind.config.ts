import type { Config } from 'tailwindcss'


export default <Partial<Config>>{
content: [
'./app/**/*.{vue,js,ts}',
'./components/**/*.{vue,js,ts}',
'./layouts/**/*.{vue,js,ts}',
'./pages/**/*.{vue,js,ts}',
'./plugins/**/*.{js,ts}',
'./nuxt.config.{js,ts}'
],
theme: {
extend: {
colors: {
cliBg: '#0b0f0a',
cliText: '#d2f8d2',
cliAccent: '#00ff88',
cliDim: '#6ee7b7'
},
boxShadow: {
'soft-glow': '0 0 30px rgba(0, 255, 136, 0.25)'
},
fontFamily: {
mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace']
}
}
}
}