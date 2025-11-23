import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLeaderboard } from '../services/apiService';

interface ScoreEntry {
  username: string;
  high_score: number;
}

const Leaderboard: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<ScoreEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await getLeaderboard();
        setLeaderboard(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch leaderboard.');
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="flex flex-col items-center p-8 bg-gray-800 rounded-lg shadow-xl w-1/2 min-w-[300px]">
      <h2 className="text-3xl font-bold mb-6 text-green-400">Leaderboard</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {!loading && leaderboard.length === 0 && <p>No scores yet!</p>}
      {!loading && leaderboard.length > 0 && (
        <table className="w-full text-left table-auto">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="py-2">Rank</th>
              <th className="py-2">Player</th>
              <th className="py-2 text-right">High Score</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry, index) => (
              <tr key={index} className="border-b border-gray-700 last:border-b-0">
                <td className="py-2">{index + 1}</td>
                <td className="py-2">{entry.username}</td>
                <td className="py-2 text-right">{Math.floor(entry.high_score)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button
        className="mt-8 px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-md text-lg font-semibold transition-colors duration-200"
        onClick={() => navigate('/')}
      >
        Back to Main Menu
      </button>
    </div>
  );
};

export default Leaderboard;
