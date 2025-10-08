<template>
  <div class="p-6 text-green-400 font-mono bg-black min-h-screen">
    <h1 class="text-xl mb-2">⚔️ Dev Battle – Round {{ battle.currentRound }}/{{ battle.totalRounds }} - room {{ battle.roomCode }}</h1>

    <div v-if="battle.currentCommand && !battle.gameOver">
      <p class="mb-4">Commande : <strong>{{ battle.currentCommand }}</strong></p>
      <TerminalInput
        :playerName="battle.playerName"
        :command="battle.currentCommand"
        :disabled="battle.gameOver"
        :onSubmit="battle.submitCommand"
      />
    </div>

    <div v-if="battle.winner && !battle.gameOver" class="mt-4">
      <p>🏅 <strong>{{ battle.winner }}</strong> a gagné le round !</p>
    </div>

    <div class="mt-8">
      <h2 class="text-lg">🏆 Leaderboard</h2>
      <ul>
        <li v-for="p in battle.leaderboard" :key="p.id">
          {{ p.name }} – {{ p.score }} pts
        </li>
      </ul>
    </div>

    <div class="mt-6">
      <button class="bg-red-500 px-3 py-2 rounded" @click="battle.quitGame">Quitter la partie</button>
    </div>

    <div v-if="battle.gameOver" class="mt-6 text-yellow-400">
      <p>🏁 Partie terminée ! Gagnant : <strong>{{ battle.winner }}</strong></p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBattleStore } from '~/stores/useBattleStore'
import TerminalInput from '~/components/TerminalInput.vue'

const battle = useBattleStore()
</script>
