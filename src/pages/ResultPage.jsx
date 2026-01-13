import React from 'react';
import { useGameStore } from '../store/gameStore';
import PixelCard from '../components/PixelCard';
import { useNavigate } from 'react-router-dom';

const ResultPage = () => {
    const result = useGameStore((state) => state.result);
    const resetGame = useGameStore((state) => state.resetGame);
    const navigate = useNavigate();

    if (!result) {
        // Fallback if accessed directly
        return (
            <div className="pixel-container">
                <button onClick={() => navigate('/')}>RETURN HOME</button>
            </div>
        );
    }

    const handleRetry = () => {
        resetGame();
        navigate('/');
    };

    return (
        <div className="pixel-container">
            <h1 className="text-4xl mb-8 animate-pulse text-accent" style={{ textShadow: '4px 4px var(--pixel-dark)' }}>
                {result.isPass ? "MISSION CLEAR!" : "GAME OVER"}
            </h1>

            <PixelCard className="w-full max-w-md flex flex-col gap-4 items-center">
                <div className="text-6xl mb-4 font-bold text-primary">
                    {result.score}
                </div>
                <div className="text-sm text-center mb-6 space-y-2">
                    <p>CORRECT: {result.correctCount} / {result.totalQuestions}</p>
                    <p>{result.isPass ? "YOU DEFEATED THE BOSS!" : "TRY AGAIN, HERO!"}</p>
                </div>

                <button onClick={handleRetry} className="w-full animate-bounce">
                    PLAY AGAIN
                </button>
            </PixelCard>
        </div>
    );
};

export default ResultPage;
