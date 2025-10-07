export type Player = {
  id: string // socket id
  name: string
  score: number
  lastTimeMs?: number | null
}
