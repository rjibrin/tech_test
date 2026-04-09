import React, { useState } from 'react'
import { Game } from './components/Game'
import { Leaderboard } from './components/Leaderboard'

export const App = () => {
  const [view, setView] = useState<'game' | 'leaderboard'>('game')

  if (view === 'leaderboard') {
    return <Leaderboard onBack={() => setView('game')} />
  }
  return <Game onLeaderboard={() => setView('leaderboard')} />
}
