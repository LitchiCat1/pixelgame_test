import { create } from 'zustand';

export const useGameStore = create((set) => ({
    userId: '',
    setUserId: (id) => set({ userId: id }),

    questions: [],
    setQuestions: (qs) => set({ questions: qs }),

    currentQuestionIndex: 0,
    nextQuestion: () => set((state) => ({ currentQuestionIndex: state.currentQuestionIndex + 1 })),

    answers: {}, // { questionId: 'A' }
    setAnswer: (qId, optionId) => set((state) => ({
        answers: { ...state.answers, [qId]: optionId }
    })),

    gameStatus: 'idle', // idle, playing, loading, finished
    setGameStatus: (status) => set({ gameStatus: status }),

    result: null, // { score, isPass, correctCount, ... }
    setResult: (res) => set({ result: res }),

    resetGame: () => set({
        currentQuestionIndex: 0,
        answers: {},
        gameStatus: 'idle',
        result: null,
        // Keep userId? Yes.
    })
}));
