<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useBattleStore } from '~/stores/useBattleStore'

const router = useRouter()
const battle = useBattleStore()

const playerName = ref('')
const roomCode = ref('dev-room') // tu peux mettre un code par défaut

function join() {
  const name = playerName.value.trim()
  const room = roomCode.value.trim()
  if (!name || !room) {
    alert('Entre un pseudo et un code de room')
    return
  }

  battle.joinGame(name, room)
  router.push('/battle')
}
</script>

<template>
  <main class="min-h-screen grid place-items-center bg-black text-green-400 font-mono p-6">
    <section class="max-w-md w-full border border-green-500/40 p-6 rounded-2xl bg-black/60 shadow-lg">
      <h1 class="text-2xl mb-4 text-center">⚔️ Dev Battle – CLI</h1>
      <p class="text-sm text-green-300 mb-6 text-center">
        Rejoins une room ou crée la tienne.<br />Le plus rapide à taper gagne !
      </p>

      <div class="space-y-4">
        <div>
          <label class="block text-sm mb-1">Pseudo</label>
          <input
            v-model="playerName"
            class="w-full border border-green-400/40 bg-transparent px-3 py-2 rounded-lg outline-none"
            placeholder="Ex: Neo"
          />
        </div>

        <div>
          <label class="block text-sm mb-1">Code de la salle</label>
          <input
            v-model="roomCode"
            class="w-full border border-green-400/40 bg-transparent px-3 py-2 rounded-lg outline-none"
            placeholder="Ex: matrix42"
          />
        </div>

        <button
          @click="join"
          class="w-full border border-green-500/70 hover:bg-green-500/20 transition-colors px-3 py-2 rounded-lg"
        >
          🚀 Rejoindre la bataille
        </button>
      </div>
    </section>
  </main>
</template>
