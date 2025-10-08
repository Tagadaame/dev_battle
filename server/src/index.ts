import express from 'express'
import { createServer } from 'http'
import { Server, Socket } from 'socket.io'

interface Player {
  id: string
  name: string
  score: number
}

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: { origin: '*' },
})

// Typage du socket
io.on('connection', (socket: Socket) => {
  console.log('⚡ Nouveau joueur connecté', socket.id)

  socket.on('join', (data: { player: string; room: string }) => {
    const { player, room } = data
    console.log(player, room)
  })

  socket.on('submit-command', (data: { room: string; command: string }) => {
    const { room, command } = data
    console.log(room, command)
  })
})

const PORT = parseInt(process.env.PORT || '4000')
httpServer.listen(PORT, () => console.log(`Server started on ${PORT}`))
