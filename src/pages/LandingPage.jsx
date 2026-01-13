import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import PixelCard from '../components/PixelCard';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const [inputVal, setInputVal] = useState('');
    const setUserId = useGameStore((state) => state.setUserId);
    const setGameStatus = useGameStore((state) => state.setGameStatus);
    const navigate = useNavigate();

    const handleStart = () => {
        if (!inputVal.trim()) return;
        setUserId(inputVal);
        setGameStatus('loading');
        navigate('/game');
    };

    return (
        <div className="pixel-container">
            <h1 className="text-4xl mb-8 text-accent animate-pulse"
                style={{ textShadow: '4px 4px var(--pixel-dark)' }}>
                PIXEL QUIZ
            </h1>

            <PixelCard className="flex flex-col gap-6 w-full max-w-md bg-pixel-card">
                <div className="text-center mb-4">
                    <p className="mb-2">ENTER PLAYER ID</p>
                    <p className="text-xs text-secondary opacity-80">INSERT COIN TO START</p>
                </div>

                <input
                    type="text"
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    placeholder="USER_ID..."
                    className="text-center uppercase"
                    onKeyDown={(e) => e.key === 'Enter' && handleStart()}
                />

                <button
                    onClick={handleStart}
                    disabled={!inputVal.trim()}
                    className={clsx("w-full transition-all", { "opacity-50": !inputVal.trim() })}
                >
                    START GAME
                </button>
            </PixelCard>
        </div>
    );
};

export default LandingPage;
