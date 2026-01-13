import React, { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { fetchQuestions, submitScore } from '../services/api';
import PixelCard from '../components/PixelCard';
import { useNavigate } from 'react-router-dom';

const GamePage = () => {
    const {
        userId, questions, currentQuestionIndex,
        setQuestions, nextQuestion, setAnswer, answers, setResult
    } = useGameStore();

    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);

    // Fetch Questions on Mount
    useEffect(() => {
        if (!userId) {
            navigate('/');
            return;
        }

        const loadData = async () => {
            try {
                setLoading(true);
                const count = import.meta.env.VITE_QUESTION_COUNT || 5;
                const data = await fetchQuestions(count);
                setQuestions(data.questions);
            } catch (err) {
                console.error(err);
                alert("Failed to load questions. Reload to try again.");
            } finally {
                setLoading(false);
            }
        };

        if (questions.length === 0) loadData();
        else setLoading(false);
    }, [userId, navigate, setQuestions]);

    const currentQuestion = questions[currentQuestionIndex];

    const handleOptionClick = (optId) => {
        if (selectedOption) return; // Prevent double click
        setSelectedOption(optId);

        // Tiny delay for visual feedback
        setTimeout(() => {
            setAnswer(currentQuestion.id, optId);

            if (currentQuestionIndex < questions.length - 1) {
                setSelectedOption(null);
                nextQuestion();
            } else {
                handleFinish();
            }
        }, 500);
    };

    const handleFinish = async () => {
        setSubmitting(true);
        // Combine current answer into state is handled by setAnswer above, 
        // but React state update might be slightly async in closure. 
        // We need to wait for the last setAnswer to stick? Zustand is sync.
        // But we need the UPDATED answers.
        // Let's grab fresh state.
        const allAnswers = useGameStore.getState().answers;

        try {
            const envThreshold = import.meta.env.VITE_PASS_THRESHOLD;
            const threshold = envThreshold ? parseInt(envThreshold, 10) : 3;
            const res = await submitScore(userId, allAnswers, threshold);
            setResult(res);
            navigate('/result');
        } catch (err) {
            alert("Error submitting score. Please try again.");
            setSubmitting(false);
        }
    };

    if (loading) return <div className="pixel-container">LOADING...</div>;
    if (submitting) return <div className="pixel-container">SAVING SCORE...</div>;
    if (!currentQuestion) return <div className="pixel-container">NO DATA</div>;

    // Boss Avatar - change per question or stay same? 
    // Let's change per question to make it like "defeating monsters" or "boss changing forms"
    // "關主" usually acts as one entity, but let's vary it for fun.
    const bossUrl = `https://api.dicebear.com/9.x/pixel-art/svg?seed=${currentQuestion.id}`;

    return (
        <div className="pixel-container justify-start pt-10">
            <div className="w-full max-w-2xl px-4 flex flex-col items-center mb-8 gap-2">
                <span className="text-accent text-2xl tracking-widest border-b-2 border-dashed border-gray-600 pb-1">
                    PLAYER: {userId}
                </span>
                <span className="text-secondary text-sm">
                    STAGE {currentQuestionIndex + 1}/{questions.length}
                </span>
            </div>

            <div className="mb-8 relative animate-bounce-slow">
                <img src={bossUrl} alt="Boss" className="w-32 h-32 pixelated" />
            </div>

            <PixelCard className="w-full max-w-2xl text-left bg-pixel-card">
                <h2 className="text-xl mb-6 leading-relaxed border-b-4 border-white pb-4">
                    {currentQuestion.question}
                </h2>

                <div className="grid grid-cols-1 gap-4">
                    {currentQuestion.options.map((opt) => (
                        <button
                            key={opt.id}
                            onClick={() => handleOptionClick(opt.id)}
                            className={`text-left hover:bg-white hover:text-black transition-colors
                        ${selectedOption === opt.id ? 'bg-white text-black' : ''}
                    `}
                        >
                            <span className="mr-4 text-accent">[{opt.id}]</span>
                            {opt.text}
                        </button>
                    ))}
                </div>
            </PixelCard>
        </div>
    );
};

export default GamePage;
