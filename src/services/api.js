import axios from 'axios';

const API_URL = import.meta.env.VITE_GOOGLE_APP_SCRIPT_URL;

// Mock Data for development
const MOCK_QUESTIONS = [
    {
        id: 'm1',
        index: 1,
        question: 'What is the standard resolution of the NES?',
        options: [
            { id: 'A', text: '256 x 240' },
            { id: 'B', text: '1920 x 1080' },
            { id: 'C', text: '320 x 200' },
            { id: 'D', text: '640 x 480' }
        ]
    },
    {
        id: 'm2',
        index: 2,
        question: 'Which character is known for jumping on Goombas?',
        options: [
            { id: 'A', text: 'Link' },
            { id: 'B', text: 'Mario' },
            { id: 'C', text: 'Sonic' },
            { id: 'D', text: 'Mega Man' }
        ]
    },
    {
        id: 'm3',
        index: 3,
        question: 'What does "HP" usually stand for in RPGs?',
        options: [
            { id: 'A', text: 'Horse Power' },
            { id: 'B', text: 'High Performance' },
            { id: 'C', text: 'Health Points' },
            { id: 'D', text: 'Harry Potter' }
        ]
    }
];

export const fetchQuestions = async (count = 5) => {
    if (!API_URL) {
        console.warn("No VITE_GOOGLE_APP_SCRIPT_URL set, using mock data");
        return { questions: MOCK_QUESTIONS.slice(0, count) };
    }

    try {
        const response = await axios.get(`${API_URL}?count=${count}`);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch questions:", error);
        throw error;
    }
};

export const submitScore = async (userId, answers, passThreshold = 3) => {
    if (!API_URL) {
        console.log("Mock Submit:", { userId, answers });
        const correctCount = Object.keys(answers).length; // Mock: assume all answered are mostly correct or just placeholder
        return {
            success: true,
            score: 100,
            correctCount: correctCount,
            totalQuestions: Object.keys(answers).length,
            isPass: true
        };
    }

    try {
        // GAS requires text/plain for CORS usually, or specific handling. 
        // Axios posts JSON by default. create-react-app proxy or specific text/plain might be needed.
        // For GAS `doPost(e)`, JSON.parse(e.postData.contents) handles the body.
        // We often need to send as string to avoid preflight issues if using 'no-cors' mode (fetch), 
        // but axios is usually standard. Let's try standard JSON first.
        // Note: GAS Web App URL redirects 302. Axios should follow unless config prevents.

        // Using stringify with standard 'application/x-www-form-urlencoded' or just text/plain 
        // is sometimes safer for simple GAS backends to avoid OPTIONS requests failures.
        const response = await axios.post(API_URL, JSON.stringify({
            userId,
            answers,
            passThreshold
        }), {
            headers: {
                'Content-Type': 'text/plain;charset=utf-8', // Bypass CORS preflight for complex types
            }
        });
        return response.data;
    } catch (error) {
        console.error("Failed to submit score:", error);
        throw error;
    }
};
