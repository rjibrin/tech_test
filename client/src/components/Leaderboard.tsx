import React, { useEffect, useState } from 'react'
import { PlayerStats } from '../types'

export const Leaderboard = ({ onBack }: { onBack: () => void }) => {
  const [stats, setStats] = useState<PlayerStats[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch('http://localhost:3000/api/players/leaderboard')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch leaderboard')
        return res.json()
      })
      .then((data: PlayerStats[]) => {
        setStats(data)
      })
      .catch(err => {
        console.error(err)
        setError(true)
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className='flex flex-col mt-10 items-center gap-10'>
      <div className='font-bold text-2xl'>Leaderboard</div>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Network error. Please try again later.</div>
      ) : stats.length === 0 ? (
        <div>No games played yet.</div>
      ) : (
        <table className='border-collapse text-center'>
          <thead>
            <tr className='border-b-2 border-gray-900'>
              <th className='px-4 py-2'>Player</th>
              <th className='px-4 py-2'>Wins</th>
              <th className='px-4 py-2'>Losses</th>
              <th className='px-4 py-2'>Draws</th>
            </tr>
          </thead>
          <tbody>
            {stats.map(player => (
              <tr key={player.id} className='border-b border-gray-300'>
                <td className='px-4 py-2 font-bold'>{player.userName}</td>
                <td className='px-4 py-2'>{player.wins}</td>
                <td className='px-4 py-2'>{player.losses}</td>
                <td className='px-4 py-2'>{player.draws}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button
        className='px-4 py-2 bg-gray-900 text-white font-bold rounded hover:bg-gray-700'
        onClick={onBack}
      >
        Back to Game
      </button>
    </div>
  )
}
