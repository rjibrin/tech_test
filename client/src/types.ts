export type XorO = 'X' | 'O'

export type Board = (XorO | undefined)[][]

export type GameStatus =
  | { status: 'playing' }
  | { status: 'draw' }
  | { status: 'win'; winner: XorO; winningCells: [number, number][] }
  | { status: 'stopped' }

export type Player = {
  id: number
  userName: string
}

export type PlayerStats = {
  id: number
  userName: string
  wins: number
  losses: number
  draws: number
}