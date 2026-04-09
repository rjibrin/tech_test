import React, { useState, useEffect, useMemo } from 'react'
import { XorO, Board, GameStatus, Player } from '../types'
import { checkBoard } from '../lib/gameLogic'

const firstPlayer:XorO = 'X'

export const Game = ({ onLeaderboard }: { onLeaderboard: () => void }) => {
  const [players, setPlayers] = useState<Player[]>([])
  const [playerXId, setPlayerXId] = useState<Player["id"]|undefined>(undefined)
  const [playerOId, setPlayerOId] = useState<Player["id"]|undefined>(undefined)
  const [boardSize, setBoardSize] = useState<number>(3)
  const [currentPlayer, setCurrentPlayer] = useState<XorO>(firstPlayer)
  const [gameStatus, setGameStatus] = useState<GameStatus>({ status: 'stopped' })
  const [board, setBoard] = useState<Board>(Array.from({ length: 3 }, () => Array(3).fill(undefined)))

  // fallback allows offline playing if players cannot be fetched
  const getPlayerName = (id: Player["id"] | undefined, fallback: string) => players.find(p => p.id === id)?.userName || fallback

  const getStatusMessage = useMemo(() => {
    const playerXName = getPlayerName(playerXId, 'Player X')
    const playerOName = getPlayerName(playerOId, 'Player O')
    switch (gameStatus.status) {
      case 'playing': return `${currentPlayer === 'X' ? playerXName +"'s turn (X)" : playerOName +"'s turn (O)"}`
      case 'win': return `${gameStatus.winner === 'X' ? playerXName : playerOName} wins!`
      case 'draw': return 'Draw!'
      case 'stopped': return 'Select settings and start new game!'
    }
  }, [gameStatus])

  // Fetch players on mount
  useEffect(() => {
    fetch('http://localhost:3000/api/players')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch players')
        return res.json()
      })
      .then((data: Player[]) => {
        setPlayers(data)
        if (data.length > 0) setPlayerXId(data[0].id)
        if (data.length > 1) setPlayerOId(data[1].id)
      })
      // left for application monitoring
      .catch(console.error)
  }, [])

  // Post game results to db when game ends
  useEffect(() => {
    if (gameStatus.status !== 'win' && gameStatus.status !== 'draw') return
    // do not post if no players were selected
    if (!playerXId || !playerOId) return

    let result: 'x_won' | 'o_won' | 'draw'
    switch (gameStatus.status) {
      case 'win':
        result = gameStatus.winner === 'X' ? 'x_won' : 'o_won'
        break
      case 'draw':
        result = 'draw'
    }

    fetch('http://localhost:3000/api/games', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ boardSize, playerXId, playerOId, result })
    }).catch(console.error)
  }, [gameStatus])

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
    setBoard(Array.from({ length: boardSize }, () => Array(boardSize).fill(undefined)))
  }
  
  
  return <div className='flex flex-col mt-10 items-center gap-5'>
    <div className='font-bold text-2xl'>Tic Tac Toe</div>
    <div>{getStatusMessage}</div>
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
    <div className='flex gap-4'>
      <button 
        className='px-4 py-2 bg-gray-900 text-white font-bold rounded hover:bg-gray-700 disabled:opacity-50' 
        disabled={gameStatus.status === 'playing'} 
        onClick={resetGame}
      >
        Start Game
      </button>
      <button
        className='px-4 py-2 bg-gray-900 text-white font-bold rounded hover:bg-gray-700 disabled:opacity-50'
        disabled={gameStatus.status !== 'playing'}
        onClick={() => setGameStatus({ status: 'stopped' })}
      >
        Stop Game
      </button>
      <button
        className='px-4 py-2 bg-gray-900 text-white font-bold rounded hover:bg-gray-700 disabled:opacity-50'
        disabled={gameStatus.status === 'playing'}
        onClick={onLeaderboard}
      >
        Leaderboard
      </button>
    </div>
    <div className='flex gap-4'>
      <label className='flex flex-col items-center gap-2'>
        <span className='text-sm text-gray-500'>Player X</span>
        <select
          className='border border-gray-300 rounded px-3 py-2 disabled:opacity-50'
          disabled={gameStatus.status === 'playing'}
          value={playerXId}
          onChange={e => setPlayerXId(Number(e.target.value))}
        >
          {players.map(p => (
            <option key={p.id} value={p.id} disabled={p.id === playerOId}>
              {p.userName} {p.id === playerOId ? '(playing O)' : ''}
            </option>
          ))}
        </select>
      </label>
      <label className='flex flex-col items-center gap-2'>
        <span className='text-sm text-gray-500'>Player O</span>
        <select
          className='border border-gray-300 rounded px-3 py-2 disabled:opacity-50'
          disabled={gameStatus.status === 'playing'}
          value={playerOId}
          onChange={e => setPlayerOId(Number(e.target.value))}
        >
          {players.map(p => (
            <option key={p.id} value={p.id} disabled={p.id === playerXId}>
              {p.userName} {p.id === playerXId ? '(playing X)' : ''}
            </option>
          ))}
        </select>
      </label>
      <label className='flex flex-col items-center gap-2'>
        <span className='text-sm text-gray-500'>Board size</span>
        <select
          className='border border-gray-300 rounded px-3 py-2 disabled:opacity-50'
          disabled={gameStatus.status === 'playing'}
          value={boardSize}
          onChange={e => setBoardSize(Number(e.target.value))}
        >
          {Array.from({ length: 13 }, (_, i) => i + 3).map(size => (
            <option key={size} value={size}>{size} x {size}</option>
          ))}
        </select>
      </label>
    </div>
  </div>
}
