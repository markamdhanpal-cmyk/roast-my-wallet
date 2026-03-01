import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

if (!apiKey) {
    console.warn('EXPO_PUBLIC_GEMINI_API_KEY is not defined in .env');
}

const genAI = new GoogleGenerativeAI(apiKey || 'unconfigured');
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

export interface AnonymizedSpendData {
    total_spent: number;
    transactions: { merchant: string; amount: number }[];
}

export const generateDailyRoast = async (aggregatedData: AnonymizedSpendData): Promise<string> => {
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
        return "API Key missing. But assuming you spent money today, you're broke.";
    }

    const prompt = `You are a disappointed, highly dramatic Indian parent reviewing your adult child's daily spending. You must use Hinglish (a mix of Hindi and English) and Indian slang like 'Nalayak', 'Paisa barbad', or 'Sharma ji ka beta'. Roast their food deliveries and useless shopping. If they invested money, act suspiciously proud but tell them it's not enough. Keep it to 2-3 punchy, dramatic sentences.

Context Data: 
Total Spent Today: ₹${aggregatedData.total_spent}
Transactions: ${JSON.stringify(aggregatedData.transactions)}
`;

    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        return text;
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        return "Even AI is speechless at your spending habits today. Try again later.";
    }
};
