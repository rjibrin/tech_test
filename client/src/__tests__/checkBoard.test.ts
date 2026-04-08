import { checkBoard } from '../gameLogic'
import { Board } from '../types'

const emptyBoard = (size: number): Board =>
  Array.from({ length: size }, () => Array(size).fill(undefined))

for (let size = 3; size <= 15; size++) {
  describe(`${size}x${size} board`, () => {
    it('returns playing for an empty board', () => {
      expect(checkBoard(emptyBoard(size))).toEqual({ status: 'playing' })
    })

    it('returns playing for an in-progress board', () => {
      const board = emptyBoard(size)
      board[0][0] = 'X'
      board[0][1] = 'O'
      expect(checkBoard(board)).toEqual({ status: 'playing' })
    })

    for (let row = 0; row < size; row++) {
      it(`detects X winning on row ${row}`, () => {
        const board = emptyBoard(size)
        for (let c = 0; c < size; c++) board[row][c] = 'X'
        expect(checkBoard(board)).toEqual({
          status: 'win',
          winner: 'X',
          winningCells: Array.from({ length: size }, (_, c) => [row, c])
        })
      })
    }

    for (let col = 0; col < size; col++) {
      it(`detects O winning on column ${col}`, () => {
        const board = emptyBoard(size)
        for (let r = 0; r < size; r++) board[r][col] = 'O'
        expect(checkBoard(board)).toEqual({
          status: 'win',
          winner: 'O',
          winningCells: Array.from({ length: size }, (_, r) => [r, col])
        })
      })
    }

    it('detects X winning on main diagonal (top-left to bottom-right)', () => {
      const board = emptyBoard(size)
      for (let i = 0; i < size; i++) board[i][i] = 'X'
      expect(checkBoard(board)).toEqual({
        status: 'win',
        winner: 'X',
        winningCells: Array.from({ length: size }, (_, i) => [i, i])
      })
    })

    it('detects O winning on anti-diagonal (top-right to bottom-left)', () => {
      const board = emptyBoard(size)
      for (let i = 0; i < size; i++) board[i][size - 1 - i] = 'O'
      expect(checkBoard(board)).toEqual({
        status: 'win',
        winner: 'O',
        winningCells: Array.from({ length: size }, (_, i) => [i, size - 1 - i])
      })
    })
  })
}

describe('3x3 edge cases', () => {
  it('detects a draw', () => {
    const board: Board = [
      ['X', 'O', 'X'],
      ['X', 'X', 'O'],
      ['O', 'X', 'O'],
    ]
    expect(checkBoard(board)).toEqual({ status: 'draw' })
  })

  it('last move triggers a win', () => {
    const board: Board = [
      ['X', 'O', 'X'],
      ['O', 'X', 'O'],
      ['O', 'X', 'X'],
    ]
    expect(checkBoard(board).status).toBe('win')
  })

  it('near-win but no winner is still playing', () => {
    const board: Board = [
      ['X', 'X', 'O'],
      ['O', 'O', 'X'],
      ['X', undefined, undefined],
    ]
    expect(checkBoard(board)).toEqual({ status: 'playing' })
  })
})
