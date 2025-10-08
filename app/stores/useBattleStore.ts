import { defineStore } from 'pinia'
import { io, Socket } from 'socket.io-client'
import { ref, computed } from 'vue'

// Le socket global, connecté au serveur défini dans ton .env
const socket: Socket = io(process.env.SOCKET_URL ?? 'http://localhost:4000', {
  autoConnect: true,
  transports: ['websocket'],
})

// Types
interface Player {
  id: string
  name: string
  score: number
}

interface RoundData {
  round: number
  total: number
  command: string
}

export const useBattleStore = defineStore('battle', () => {
  // 🔹 État global
  const playerName = ref('')
  const roomCode = ref('')
  const players = ref<Player[]>([])
  const currentRound = ref(0)
  const totalRounds = ref(5)
  const currentCommand = ref('')
  const leaderboard = ref<Player[]>([])
  const winner = ref<string | null>(null)
  const started = ref(false)
  const gameOver = ref(false)

  // 🔹 État dérivé
  const isHost = computed(() => players.value[0]?.name === playerName.value)
  const me = computed(() => players.value.find(p => p.name === playerName.value))

  // 🔹 Écoute des événements Socket.IO
  socket.on('connect', () => {
    console.log('✅ Connected to server', socket.id)
  })

  socket.on('player-list', (list: Player[]) => {
    players.value = list
    leaderboard.value = [...list].sort((a, b) => b.score - a.score)
  })

  socket.on('start-round', (data: RoundData) => {
    currentRound.value = data.round
    totalRounds.value = data.total
    currentCommand.value = data.command
    started.value = true
    winner.value = null
    console.log(`⚔️ Round ${data.round}/${data.total} : ${data.command}`)
  })

  socket.on('round-winner', ({ winner: winName, scores }: { winner: string; scores: Player[] }) => {
    leaderboard.value = [...scores].sort((a, b) => b.score - a.score)
    winner.value = winName
    console.log(`🏅 ${winName} a gagné le round !`)
  })

  socket.on('game-over', ({ winner: finalWinner, scores }: { winner: Player; scores: Player[] }) => {
    gameOver.value = true
    leaderboard.value = [...scores].sort((a, b) => b.score - a.score)
    winner.value = finalWinner.name
    console.log(`🏆 Fin du jeu, gagnant : ${finalWinner.name}`)
  })

  // 🔹 Actions
  function joinGame(name: string, room: string) {
    playerName.value = name
    roomCode.value = room
    socket.emit('join', { player: name, room })
  }

  function submitCommand(value: string) {
    if (!started.value || !roomCode.value) return
    socket.emit('submit-command', { room: roomCode.value, command: value })
  }

  function quitGame() {
    socket.disconnect()
    reset()
  }

  function reset() {
    players.value = []
    leaderboard.value = []
    currentRound.value = 0
    currentCommand.value = ''
    started.value = false
    winner.value = null
    gameOver.value = false
  }

  return {
    // state
    playerName,
    roomCode,
    players,
    currentRound,
    totalRounds,
    currentCommand,
    leaderboard,
    winner,
    started,
    gameOver,
    // computed
    isHost,
    me,
    // actions
    joinGame,
    submitCommand,
    quitGame,
    reset,
  }
})
