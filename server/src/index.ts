import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import { pickRandomCommand } from './commands'

const app = express()
app.use(cors())
const server = http.createServer(app)
const io = new Server(server, { cors: { origin: '*' } })

type Player = { name: string; score: number; lastTimeMs?: number | null }
type RoomState = {
  players: Map<string, Player>
  totalRounds: number
  currentRound: number
  currentCommand: string | null
  roundActive: boolean
  roundStartAt: number
}

const rooms = new Map<string, RoomState>()

function getRoom(roomId = 'default'): RoomState {
  if (!rooms.has(roomId)) {
    rooms.set(roomId, {
      players: new Map(),
      totalRounds: 5,
      currentRound: 0,
      currentCommand: null,
      roundActive: false,
      roundStartAt: 0
    })
  }
  return rooms.get(roomId)!
}

io.on('connection', (socket) => {
  console.log(`🧦 New connection: ${socket.id}`)

  socket.on('join', ({ roomId = 'default', name }: { roomId?: string; name: string }) => {
    const room = getRoom(roomId)
    room.players.set(socket.id, { name, score: 0 })
    socket.join(roomId)
    io.to(roomId).emit('players:update', toArray(room.players))
    console.log(`👤 ${name} joined ${roomId}`)
  })

  socket.on('leave', ({ roomId = 'default' } = {}) => {
    const room = getRoom(roomId)
    room.players.delete(socket.id)
    socket.leave(roomId)
    io.to(roomId).emit('players:update', toArray(room.players))
  })

  socket.on('startGame', ({ roomId = 'default', totalRounds = 5 }: { roomId?: string; totalRounds?: number }) => {
    const room = getRoom(roomId)
    room.totalRounds = Math.max(1, totalRounds)
    room.currentRound = 0
    room.players.forEach((p) => (p.score = 0))
    io.to(roomId).emit('game:started', { totalRounds })
    startNextRound(roomId)
  })

  socket.on('submit', ({ roomId = 'default', text }: { roomId?: string; text: string }) => {
    const room = getRoom(roomId)
    if (!room.roundActive || !room.currentCommand) return
    if (text.trim() !== room.currentCommand) return

    const timeMs = Math.round(Date.now() - room.roundStartAt)
    const player = room.players.get(socket.id)
    if (!player) return

    player.score++
    player.lastTimeMs = timeMs
    room.roundActive = false

    const winner = { id: socket.id, name: player.name, timeMs }
    io.to(roomId).emit('round:finished', {
      round: room.currentRound,
      command: room.currentCommand,
      winner,
      players: toArray(room.players)
    })

    setTimeout(() => {
      if (room.currentRound >= room.totalRounds) {
        io.to(roomId).emit('game:over', { players: toArray(room.players) })
      } else {
        startNextRound(roomId)
      }
    }, 1000)
  })

  socket.on('disconnecting', () => {
    for (const roomId of socket.rooms) {
      if (roomId === socket.id) continue
      const room = getRoom(roomId)
      room.players.delete(socket.id)
      io.to(roomId).emit('players:update', toArray(room.players))
    }
  })
})

function startNextRound(roomId = 'default') {
  const room = getRoom(roomId)
  room.currentRound++
  const next = pickRandomCommand(room.currentCommand ?? undefined)
  room.currentCommand = next
  room.roundActive = true
  room.roundStartAt = Date.now()
  io.to(roomId).emit('round:started', {
    round: room.currentRound,
    totalRounds: room.totalRounds,
    command: next
  })
}

function toArray(map: Map<string, Player>) {
  return Array.from(map.entries()).map(([id, p]) => ({ id, ...p }))
}

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 4000
server.listen(PORT, () => console.log(`🔥 Dev Battle Server running on port ${PORT}`))
