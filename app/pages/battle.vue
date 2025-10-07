<template>
  <div class="min-h-screen bg-black text-green-400 font-mono flex flex-col items-center p-4">
    <h1 class="text-3xl mb-4">🧦 Dev Battle CLI</h1>

    <!-- Command actuelle -->
    <div class="w-full max-w-xl mb-4">
      <p class="mb-2">Round {{ store.currentRound }} / {{ store.totalRounds }}</p>
      <div v-if="store.roundActive" class="bg-black border border-green-400 p-3 rounded">
        Tape la commande exacte : <code>{{ store.currentCommand }}</code>
      </div>
      <p v-else class="text-green-300 mt-2">{{ store.message }}</p>
    </div>

<TerminalInput
  v-if="store.roundActive && store.me"
  :playerName="store.me.name"
  :command="store.currentCommand"
  @submit="handleSubmit"
  class="w-full max-w-xl mb-6"
/>

    <!-- Leaderboard -->
    <div class="w-full max-w-xl bg-black border border-green-400 p-4 rounded">
      <h2 class="text-xl mb-2">Leaderboard 🏆</h2>
      <ul>
        <li
          v-for="p in store.leaderboard"
          :key="p.id"
          class="flex justify-between border-b border-green-600 py-1"
        >
          <span>{{ p.name }}</span>
          <span>
            {{ p.score }} pts
            <span v-if="p.lastTimeMs"> ({{ (p.lastTimeMs / 1000).toFixed(2) }}s)</span>
          </span>
        </li>
      </ul>
    </div>

    <!-- Bouton quitter -->
    <button
      @click="leave"
      class="mt-6 bg-green-400 text-black px-4 py-2 rounded hover:bg-green-500 transition"
    >
      Quitter la partie
    </button>
  </div>
</template>

<script setup lang="ts">
import { useBattleStore } from '@/stores/battle'
import TerminalInput from '@/components/TerminalInput.vue' // ton component terminal input

const store = useBattleStore()

// handler pour le terminal input
function handleSubmit(value: string) {
  store.submit(value)
}

function leave() {
  store.leave()
  // rediriger vers la page Join
  window.location.href = '/join'
}

// si ce n'est pas déjà fait, initialiser le socket
if (!store.me) {
  store.initSocket()
}
</script>

<style scoped>
code {
  background-color: rgba(0, 255, 0, 0.1);
  padding: 2px 4px;
  border-radius: 4px;
}
</style>
