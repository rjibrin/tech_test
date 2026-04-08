import { Board, GameStatus } from './types'

export const checkBoard = (board: Board): GameStatus => {
  // assumes square board
  const size = board.length

  // check for winners along rows and columns
  for (let i = 0; i < size; i++) {
    const rowStart = board[i][0]
    if (rowStart && board[i].every(cell => cell === rowStart))
      return { status: 'win', winner: rowStart, winningCells: board[i].map((_, c) => [i, c]) }

    const colStart = board[0][i]
    if (colStart && board.every(row => row[i] === colStart))
      return { status: 'win', winner: colStart, winningCells: board.map((_, r) => [r, i]) }
  }

  // check for winners on main diagonal (top-left to bottom-right)
  const topLeft = board[0][0]
  if (topLeft && board.every((row, i) => row[i] === topLeft))
    return { status: 'win', winner: topLeft, winningCells: board.map((_, i) => [i, i]) }

  // check for winners on anti-diagonal (top-right to bottom-left)
  const topRight = board[0][size - 1]
  if (topRight && board.every((row, i) => row[size - 1 - i] === topRight))
    return { status: 'win', winner: topRight, winningCells: board.map((_, i) => [i, size - 1 - i]) }

  // if all cells are defined and reached here then must be a draw
  if (board.every(row => row.every(cell => cell !== undefined))) return { status: 'draw' }

  // none of the above then game must continue
  return { status: 'playing' }
}
