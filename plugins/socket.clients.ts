import { io, Socket } from 'socket.io-client'
import { defineNuxtPlugin } from 'nuxt/app'


export default defineNuxtPlugin((nuxtApp) => {
  const url = process.env.SOCKET_URL ?? 'http://localhost:4000'
  const socket: Socket = io(url, { autoConnect: true })

  // typed injection
  return {
    provide: {
      socket // $socket sera de type Socket
    }
  }
})

