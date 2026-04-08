export type XorO = 'X' | 'O'
export type Board = (XorO | undefined)[][]
export type GameStatus =
  | { status: 'playing' }
  | { status: 'draw' }
  | { status: 'win'; winner: XorO; winningCells: [number, number][] }