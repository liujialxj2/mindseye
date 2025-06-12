import React from 'react';
import { useParams } from 'react-router-dom';
import GameDetail from '../components/GameDetail';

const GamePage: React.FC = () => {
  // Get gameId from URL parameters
  const { gameId } = useParams<{ gameId: string }>();
  
  if (!gameId) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <p className="text-white text-xl">Game not found</p>
      </div>
    );
  }
  
  return <GameDetail gameId={gameId} />;
};

export default GamePage; 