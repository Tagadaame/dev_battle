

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useBattleStore } from '@/stores/battle'
import { useRouter } from 'vue-router'

const router = useRouter()
const battle = useBattleStore()

const input = ref('')
const currentCommand = ref('')
const round = ref(0)
const totalRounds = ref(5)
const winner = ref('')
const leaderboard = ref<{ name: string; score: number }[]>([])

onMounted(() => {
  if (!battle.socket) {
    // Si on reload la page sans store, on retourne au lobby
    router.push('/')
    return
  }

  // ✅ Synchronisation des événements temps réel
  battle.socket.on('start-round', (data: { round: number; total: number; command: string }) => {
    round.value = data.round
    totalRounds.value = data.total
    currentCommand.value = data.command
    winner.value = ''
  })

  battle.socket.on('round-winner', (data: { winner: string; scores: any[] }) => {
    winner.value = data.winner
    leaderboard.value = data.scores
    currentCommand.value = ''
  })

  battle.socket.on('player-list', (players: any[]) => {
    leaderboard.value = players
  })
})

onUnmounted(() => {
  battle.socket?.off('start-round')
  battle.socket?.off('round-winner')
  battle.socket?.off('player-list')
})

function submit() {
  if (!input.value.trim()) return
  battle.socket?.emit('submit-command', {
    room: battle.roomId, 
    command: input.value.trim(),
  })
  input.value = ''
}

function quit() {
  battle.socket?.disconnect()
  router.push('/')
}
</script>

<template>
  <main class="min-h-screen flex flex-col items-center justify-center p-6">
    <section class="w-full max-w-3xl rounded-2xl border border-cliAccent/20 bg-black/30 p-6 shadow-soft-glow">
      <div class="flex justify-between items-center mb-4">
        <h1 class="text-2xl text-cliAccent">⚔️ Dev Battle – CLI</h1>
        <button
          @click="quit"
          class="text-sm border border-cliAccent/40 px-3 py-1 rounded-md hover:bg-cliAccent/10"
        >
          Quitter
        </button>
      </div>

      <p class="text-cliDim mb-4">
        Round {{ round }}/{{ totalRounds }}
      </p>

      <div v-if="currentCommand" class="bg-black/60 border border-green-400/40 rounded-lg p-4 mb-6">
        <p class="text-green-400 font-mono text-lg mb-3">👉 {{ currentCommand }}</p>
        <input
          v-model="input"
          @keyup.enter="submit"
          placeholder="Tape la commande..."
          class="w-full border border-green-400/40 bg-transparent px-3 py-2 rounded-lg outline-none"
        />
      </div>

      <div v-else class="bg-black/40 border border-cliAccent/20 rounded-lg p-4 mb-6">
        <p v-if="winner" class="text-cliAccent mb-2 font-semibold">
          🏆 {{ winner }} a gagné ce round !
        </p>
        <p v-else class="text-cliDim italic">En attente du prochain round...</p>
      </div>

      <div class="bg-black/40 border border-cliAccent/20 rounded-lg p-4">
        <h2 class="text-cliAccent text-lg mb-3">Leaderboard</h2>
        <ul>
          <li
            v-for="p in leaderboard"
            :key="p.name"
            class="flex justify-between border-b border-cliAccent/10 py-1"
          >
            <span>{{ p.name }}</span>
            <span class="text-cliAccent">{{ p.score }}</span>
          </li>
        </ul>
      </div>
    </section>
  </main>
</template>

<style scoped>
.shadow-soft-glow {
  box-shadow: 0 0 20px rgba(0, 255, 128, 0.15);
}
</style>

