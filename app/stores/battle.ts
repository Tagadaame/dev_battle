import { defineStore } from 'pinia'
import { io, Socket } from 'socket.io-client'

interface Player {
  id: string
  name: string
  score: number
}

interface BattleState {
  socket: Socket | null
  players: Player[]
  me: Player | null
  roomId: string
  totalRounds: number
  currentRound: number
  currentCommand: string
  roundActive: boolean
  message: string
}

export const useBattleStore = defineStore('battle', {
  state: (): BattleState => ({
    socket: null,
    players: [],
    me: null,
    roomId: '',
    totalRounds: 0,
    currentRound: 0,
    currentCommand: '',
    roundActive: false,
    message: '',
  }),

  actions: {
    /** 🔌 Initialise la connexion Socket.IO */
    initSocket() {
      if (this.socket) return

      const url = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001'
      this.socket = io(url, { transports: ['websocket'] })

      this.socket.on('connect', () => {
        console.log('✅ Connecté au serveur Socket.IO', this.socket?.id)
      })

      this.socket.on('disconnect', () => {
        console.log('❌ Déconnecté du serveur')
        this.socket = null
      })

      // Écoute les updates de joueurs
      this.socket.on('player-list', (players: Player[]) => {
        this.players = players
      })

      // Commande du round
      this.socket.on('start-round', (data: any) => {
        this.currentCommand = data.command
        this.currentRound = data.round
        this.totalRounds = data.total
        this.roundActive = true
        this.message = ''
      })

      // Résultat du round
      this.socket.on('round-winner', (data: any) => {
        this.roundActive = false
        this.message = `🏆 ${data.winner} a gagné ce round !`
        this.players = data.scores
      })
    },

    /** 🚪 Rejoint une partie */
    join(name: string, roomId: string) {
      this.initSocket()
      this.roomId = roomId
      this.me = { id: this.socket?.id ?? '', name, score: 0 }
      this.socket?.emit('join-room', { name, room: roomId })
    },

    /** 🚀 Lance la partie */
    startGame(rounds = 5) {
      this.socket?.emit('start-game', { room: this.roomId, rounds })
    },

    /** 💬 Soumet la commande */
    submitCommand(command: string) {
      if (!this.socket) return
      this.socket.emit('submit-command', {
        room: this.roomId,
        name: this.me?.name,
        command,
      })
    },
  },
})
