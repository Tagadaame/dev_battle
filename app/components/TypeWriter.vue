<script setup lang="ts">
import { onMounted, ref } from 'vue'


const props = defineProps<{ text: string; speed?: number }>()
const shown = ref('')
const done = ref(false)


onMounted(async () => {
const s = props.speed ?? 18
for (let i = 0; i <= props.text.length; i++) {
shown.value = props.text.slice(0, i)
await new Promise(r => setTimeout(r, s))
}
done.value = true
})
</script>

<template>
    <div class="text-cliAccent/90 select-none tracking-tight">
        <span class="opacity-60">$ </span>{{ shown }}<span :class="['ml-1 inline-block w-2 h-5 align-baseline', done ? 'opacity-0' : 'bg-cliAccent animate-pulse']"></span>
    </div>
</template>