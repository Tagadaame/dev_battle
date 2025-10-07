<template>
  <div class="terminal-input w-full">
    <div class="flex items-center">
      <span class="text-green-400 mr-2">{{ playerName }}$</span>
      <input
        ref="inputEl"
        v-model="typed"
        :disabled="disabled"
        @keydown.enter.prevent="submitCommand"
        @paste.prevent
        class="bg-black border border-green-400 rounded px-2 py-1 flex-1 outline-none text-green-400 font-mono"
        autocomplete="off"
        autocorrect="off"
        autocapitalize="off"
        spellcheck="false"
      />
    </div>
    <p v-if="error" class="text-red-500 text-sm mt-1">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, defineProps } from 'vue'

interface Props {
  playerName: string
  command: string
  disabled?: boolean
  onSubmit?: (value: string) => void
}

const props = defineProps<Props>()

const typed = ref('')
const error = ref('')
const inputEl = ref<HTMLInputElement>()

// met le focus sur le champ à l'ouverture
onMounted(() => {
  inputEl.value?.focus()
})

// animation de saisie simulée (optionnel)
watch(typed, (v) => {
  if (v.length > props.command.length) {
    typed.value = v.slice(0, props.command.length)
  }
})

function submitCommand() {
  if (typed.value.trim() === props.command) {
    error.value = ''
    props.onSubmit?.(typed.value.trim())
    typed.value = ''
  } else {
    error.value = 'Commande incorrecte'
  }
}
</script>

<style scoped>
.terminal-input input {
  transition: background 0.2s, color 0.2s;
}

.terminal-input input:focus {
  box-shadow: 0 0 5px #00ff00;
}
</style>
