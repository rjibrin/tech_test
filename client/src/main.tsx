import React, { useState } from 'react'
import { XorO, Board, GameStatus } from './types'
import { checkBoard } from './gameLogic'

const playerX:string = "James"
const playerO:string = "Bob"
const firstPlayer:XorO = 'X'

export const Main = () => {
  const [currentPlayer, setCurrentPlayer] = useState<XorO>(firstPlayer)
  const [gameStatus, setGameStatus] = useState<GameStatus>({ status: 'playing' })
  const [board, setBoard] = useState<Board>([
    [undefined, undefined, undefined],
    [undefined, undefined, undefined],
    [undefined, undefined, undefined]
  ])

  const getStatusMessage = () => {
    switch (gameStatus.status) {
      case 'playing': return `${currentPlayer === 'X' ? playerX +"'s turn (X)" : playerO +"'s turn (O)"}`
      case 'win': return `${gameStatus.winner === 'X' ? playerX : playerO} wins!`
      case 'draw': return 'Draw!'
    }
  }

  const handleCellClick = (rowIndex: number, colIndex: number) => {
    // return if cell already taken or game is finished. redundant with button disabled
    if (board[rowIndex][colIndex]) return
    if (gameStatus.status !== 'playing') return
    
    // implement move
    const newBoard = board.map(row => [...row])
    newBoard[rowIndex][colIndex] = currentPlayer
    setBoard(newBoard)
    
    // check if someone won, draw, or continue playing
    const result = checkBoard(newBoard)
    setGameStatus(result)

    // switch player turns if game continues
    if (result.status === 'playing') {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X')
    }
  }
        
  const resetGame = () => {
      setCurrentPlayer(firstPlayer)
      setGameStatus({ status: 'playing' })
      setBoard([
        [undefined, undefined, undefined],
        [undefined, undefined, undefined],
        [undefined, undefined, undefined]
      ])
  }
  
  return <div className='flex flex-col mt-10 items-center gap-10'>
    <div className='font-bold text-2xl'>Tic Tac Toe</div>
    <div>{getStatusMessage()}</div>
    <div className='flex flex-col gap-1'>
      {board.map((row, rowIndex) => <div className='flex gap-1' key={rowIndex}>
        {row.map((cell, colIndex) => 
          <button 
            key={colIndex} 
            disabled={gameStatus.status !== 'playing' || cell !== undefined}
            className={`border-2 border-gray-900 w-10 h-10 p-0 cursor-pointer items-center justify-center text-2xl font-bold flex disabled:cursor-default ${gameStatus.status === 'win' && gameStatus.winningCells.some(([r, c]) => r === rowIndex && c === colIndex) ? 'bg-green-300' : 'bg-transparent'}`}
            onClick={() => handleCellClick(rowIndex, colIndex)}
          >
            {cell}
          </button>
        )}
      </div>)}
    </div>
    <button className='px-4 py-2 bg-gray-900 text-white font-bold rounded hover:bg-gray-700' onClick={resetGame}>Start New Game</button>
  </div>
}
