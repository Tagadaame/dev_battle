import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import { pickRandomCommand } from './commands'

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*',
  },
})

interface Player {
  id: string
  name: string
  score: number
}

interface RoomState {
  players: Player[]
  round: number
  currentCommand?: string
  started: boolean
}

const rooms = new Map<string, RoomState>()

// Lorsqu’un joueur se connecte
io.on('connection', (socket) => {
  console.log(`🟢 Nouveau joueur connecté : ${socket.id}`)

  // Lorsqu’un joueur rejoint une room
  socket.on('join', ({ player, room }) => {
    socket.join(room)

    if (!rooms.has(room)) {
      rooms.set(room, { players: [], round: 0, started: false })
    }

    const state = rooms.get(room)!
    const existing = state.players.find((p) => p.id === socket.id)
    if (!existing) {
      state.players.push({ id: socket.id, name: player, score: 0 })
    }

    io.to(room).emit('player-list', state.players)
    console.log(`👥 ${player} rejoint la room ${room} (${state.players.length} joueurs)`)

    // 🟢 Si une partie est déjà en cours, on renvoie l’état actuel au nouveau joueur
    if (state.started && state.currentCommand) {
      socket.emit('start-round', {
        round: state.round,
        total: 5,
        command: state.currentCommand,
      })
      socket.emit('player-list', state.players)
    }

    // ⚡ Si c’est la première fois qu’on atteint 2 joueurs, on démarre la partie
    if (state.players.length >= 2 && !state.started) {
      startRound(room)
    }
  })


  // Quand un joueur tape la commande
  socket.on('submit-command', ({ room, command }) => {
    const state = rooms.get(room)
    if (!state || !state.started) return
    if (command !== state.currentCommand) return // mauvaise commande

    // Premier à taper correctement = gagne le round
    const winner = state.players.find((p) => p.id === socket.id)
    if (winner) {
      winner.score += 1
      io.to(room).emit('round-winner', { winner: winner.name, scores: state.players })
    }

    // Passe au round suivant
    if (state.round < 5) {
      setTimeout(() => startRound(room), 1500)
    } else {
      endGame(room)
    }
  })

  // Déconnexion
  socket.on('disconnect', () => {
    for (const [room, state] of rooms.entries()) {
      const index = state.players.findIndex((p) => p.id === socket.id)
      if (index !== -1) {
        const left = state.players[index].name
        state.players.splice(index, 1)
        io.to(room).emit('player-list', state.players)
        console.log(`🔴 ${left} quitte la room ${room}`)

        // Si plus de joueurs → supprimer la room
        if (state.players.length === 0) {
          rooms.delete(room)
        }
      }
    }
  })
})

// 🔁 Fonction pour lancer un nouveau round
function startRound(room: string) {
  const state = rooms.get(room)
  if (!state) return

  state.round += 1
  state.started = true
  state.currentCommand = pickRandomCommand()
  io.to(room).emit('start-round', {
    round: state.round,
    total: 5,
    command: state.currentCommand,
  })

  console.log(`⚔️ Room ${room} → Round ${state.round} : ${state.currentCommand}`)
}

// 🏁 Fin de partie
function endGame(room: string) {
  const state = rooms.get(room)
  if (!state) return

  const winner = [...state.players].sort((a, b) => b.score - a.score)[0]
  io.to(room).emit('game-over', { winner, scores: state.players })
  console.log(`🏆 Fin de partie pour ${room} → gagnant : ${winner.name}`)

  rooms.delete(room)
}

// Démarrage du serveur
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 4000
server.listen(PORT, () => console.log(`🔥 Dev Battle Server running on port ${PORT}`))
