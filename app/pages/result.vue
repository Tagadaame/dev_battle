<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useBattleStore } from '@/stores/battle'


const router = useRouter()
const store = useBattleStore()


if (store.players.length === 0) {
router.replace('/')
}


const winners = computed(() => {
const lb = store.leaderboard
const top = lb[0]?.score ?? 0
return lb.filter(p => p.score === top)
})
</script>


<template>
<main class="min-h-screen p-6 grid place-items-center">
<section class="w-full max-w-3xl rounded-2xl border border-cliAccent/20 bg-black/30 p-6 shadow-soft-glow">
<h2 class="text-2xl text-cliAccent mb-4">🏁 Classement final</h2>


<div class="mb-6">
<div class="text-cliDim mb-2">Gagnant{{ winners.length > 1 ? 's' : '' }}</div>
<div class="flex flex-wrap gap-2">
<span v-for="w in winners" :key="w.id" class="rounded-full border border-cliAccent/40 px-3 py-1">{{ w.name }} ({{ w.score }})</span>
</div>
</div>


<ol class="space-y-2">
<li v-for="(p, idx) in store.leaderboard" :key="p.id" class="flex items-center justify-between rounded-xl border border-cliAccent/20 px-3 py-2">
<span class="text-cliDim">#{{ idx + 1 }}</span>
<span class="flex-1 mx-3">{{ p.name }}</span>
<span class="font-semibold">{{ p.score }} pt{{ p.score>1?'s':'' }}</span>
</li>
</ol>


<div class="mt-6 flex gap-3 justify-end">
<NuxtLink to="/" class="rounded-xl border border-cliAccent/50 px-4 py-2 hover:bg-cliAccent/10">Rejouer</NuxtLink>
</div>
</section>
</main>
</template>