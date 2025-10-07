<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-black text-green-400 font-mono">
    <h1 class="text-3xl mb-6">🧦 Dev Battle CLI</h1>

    <form @submit.prevent="joinRoom" class="flex flex-col gap-4 w-80">
      <div>
        <label class="block mb-1">Pseudo</label>
        <input
          v-model="name"
          type="text"
          placeholder="Ton pseudo"
          required
          class="w-full p-2 bg-black border border-green-400 rounded outline-none focus:ring-2 focus:ring-green-400"
        />
      </div>

      <div>
        <label class="block mb-1">Code de la room</label>
        <input
          v-model="room"
          type="text"
          placeholder="Ex: SOKS123"
          class="w-full p-2 bg-black border border-green-400 rounded outline-none focus:ring-2 focus:ring-green-400"
        />
        <small class="text-green-300">Laisse vide pour créer une room par défaut</small>
      </div>

      <button
        type="submit"
        class="bg-green-400 text-black p-2 rounded hover:bg-green-500 transition"
      >
        Rejoindre
      </button>
    </form>

    <p v-if="error" class="mt-4 text-red-500">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useBattleStore } from '@/stores/battle'

const router = useRouter()
const store = useBattleStore()

const name = ref('')
const room = ref('')
const error = ref('')

function joinRoom() {
  if (!name.value.trim()) {
    error.value = 'Entrez un pseudo valide'
    return
  }
  const roomId = room.value.trim() || 'default'

  store.initSocket()
  store.join(name.value.trim(), roomId)

  router.push({ path: '/battle' })
}
</script>
