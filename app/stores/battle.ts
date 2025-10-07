import { defineStore } from 'pinia'
import { useNuxtApp } from '#app'



export type Player = {
  id: string
  name: string
  score: number
  lastTimeMs?: number | null
}

export const useBattleStore = defineStore('battle', {
  state: () => ({
    players: [] as Player[],
    me: null as { id: string; name: string } | null,
    roomId: 'default',
    totalRounds: 5,
    currentRound: 0,
    currentCommand: '',
    roundActive: false,
    message: ''
  }),
  getters: {
    leaderboard: (s) => [...s.players].sort((a,b) => b.score - a.score || (a.lastTimeMs ?? Infinity) - (b.lastTimeMs ?? Infinity))
  },
  actions: {
    initSocket() {
      const nuxt = useNuxtApp()
      const socket = nuxt.$socket
      if (!socket) return

      socket.on('connect', () => {
        console.log('connected to socket', socket.id)
        // save my id
        this.me = { id: socket.id!, name: this.me?.name ?? '' }
      })

      socket.on('players:update', (players: any[]) => {
        this.players = players.map(p => ({ id: p.id, name: p.name, score: p.score ?? 0, lastTimeMs: p.lastTimeMs ?? null }))
      })

      socket.on('game:started', (payload: any) => {
        this.totalRounds = payload.totalRounds ?? this.totalRounds
        this.message = 'Game started'
      })

      socket.on('round:started', (payload: any) => {
        this.currentRound = payload.round
        this.currentCommand = payload.command
        this.roundActive = true
        this.message = ''
      })

      socket.on('round:finished', (payload: any) => {
        // update players state broadcast
        this.players = payload.players.map((p: any) => ({ id: p.id, name: p.name, score: p.score ?? 0, lastTimeMs: p.lastTimeMs ?? null }))
        const winner = payload.winner
        this.roundActive = false
        if (winner) {
          this.message = `✅ ${winner.name} a gagné la manche en ${(winner.timeMs/1000).toFixed(2)}s`
        } else {
          this.message = 'Manche terminée'
        }
      })

      socket.on('game:over', (payload: any) => {
        this.players = payload.players.map((p: any) => ({ id: p.id, name: p.name, score: p.score ?? 0, lastTimeMs: p.lastTimeMs ?? null }))
        this.message = '🏁 Game over'
      })

      socket.on('disconnect', () => {
        this.message = 'Déconnecté du serveur'
      })
    },

    join(name: string, roomId = 'default') {
      const nuxt = useNuxtApp()
      const socket = nuxt.$socket
      if (!socket) return
      this.roomId = roomId
      // id initial vide ou assigné après connect
      this.me = { id: '', name }

      socket.on('connect', () => {
        if (this.me) {
          this.me.id = socket.id! // TypeScript ok
        }
      })

      socket.emit('join', { roomId: this.roomId, name })
    },

    leave() {
      const nuxt = useNuxtApp()
      const socket = nuxt.$socket
      if (!socket) return
      socket.emit('leave', { roomId: this.roomId })
      this.players = []
      this.me = null
    },

    startGame(totalRounds = 5) {
      const nuxt = useNuxtApp()
      const socket = nuxt.$socket
      if (!socket) return
      socket.emit('startGame', { roomId: this.roomId, totalRounds })
    },

    submit(text: string) {
      const nuxt = useNuxtApp()
      const socket = nuxt.$socket
      if (!socket || !this.me) return
      socket.emit('submit', { roomId: this.roomId, text })
    }
  }
})
