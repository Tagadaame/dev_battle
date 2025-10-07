<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useBattleStore } from '@/stores/battle' 


const store = useBattleStore()
const router = useRouter()

const rounds = ref(5)
const newName = ref('')
const names = ref<string[]>([])


function addName() {
const n = newName.value.trim()
if (!n) return
if (names.value.includes(n)) return
names.value.push(n)
newName.value = ''
}


function removeName(i: number) {
names.value.splice(i, 1)
}

function start() {
  const clean = names.value.map(n => n.trim()).filter(Boolean)
  if (clean.length < 2) return alert('Ajoute au moins 2 joueurs')
  // join each player? In network mode, each client joins themselves.
  // For a single-host test, we join each name as a "local observer" (optional).
  // Simpler approach: store first name as local player and others will join from their browsers.
  const myName = clean[0]
  store.initSocket()
  store.join(myName) // this client acts as the first player
  store.startGame(rounds.value)
  router.push('/battle')
}

</script>


<template>
<main class="min-h-screen grid place-items-center p-6">
<section class="w-full max-w-3xl rounded-2xl border border-cliAccent/20 bg-black/30 p-6 shadow-soft-glow">
<h1 class="text-2xl md:text-3xl mb-6 text-cliAccent">⚔️ Dev Battle – CLI</h1>
<p class="text-sm text-cliDim mb-6">Tape la commande affichée. Le plus rapide gagne la manche. Meilleur score au bout des rounds remporte les 🧦.</p>


<div class="grid md:grid-cols-[1fr_auto] gap-4 items-start">
<div>
<label class="block text-cliDim text-sm mb-2">Joueurs</label>
<div class="flex gap-2 mb-3">
<input v-model="newName" @keyup.enter="addName" placeholder="Pseudo" class="flex-1 rounded-lg border border-cliAccent/20 bg-transparent px-3 py-2 outline-none" />
<button @click="addName" class="rounded-lg border border-cliAccent/30 px-3 py-2 hover:bg-cliAccent/10">Ajouter</button>
</div>
<ul class="flex flex-wrap gap-2">
<li v-for="(n,i) in names" :key="n" class="flex items-center gap-2 rounded-full border border-cliAccent/30 px-3 py-1">
<span>{{ n }}</span>
<button @click="removeName(i)" class="text-cliDim hover:text-cliAccent">×</button>
</li>
</ul>
</div>
<div class="w-full md:w-56">
<label class="block text-cliDim text-sm mb-2">Nombre de rounds</label>
<input type="number" min="1" max="20" v-model.number="rounds" class="w-full rounded-lg border border-cliAccent/20 bg-transparent px-3 py-2 outline-none" />
</div>
</div>


<div class="mt-6 flex justify-end">
<button @click="start" class="rounded-xl border border-cliAccent/50 px-4 py-2 hover:bg-cliAccent/10">Start Battle ▶</button>
</div>
</section>
</main>
</template>