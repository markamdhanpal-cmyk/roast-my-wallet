import { GoogleGenerativeAI } from '@google/generative-ai';
import Constants from 'expo-constants';

// Try standard process.env, fallback to app.json's extra block if environment variables are failing
const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY || Constants.expoConfig?.extra?.EXPO_PUBLIC_GEMINI_API_KEY;

if (!apiKey) {
    console.error("❌ Still no API key found!");
} else {
    // Safely log the API key (show first 5 and last 4 chars)
    const safeKey = apiKey.length > 10
        ? `${apiKey.slice(0, 5)}...${apiKey.slice(-4)}`
        : '***TOO_SHORT***';
    console.log(`[DEBUG] Loaded API Key: ${safeKey}`);
}

const genAI = new GoogleGenerativeAI(apiKey || 'unconfigured');

const systemInstruction = `You are a savage, unhinged Indian parent reviewing your adult child's daily spending. You are absolutely flabbergasted and disappointed. 
You must use a mix of Hindi and English (Hinglish) with dramatic slang like 'Nalayak', 'Paisa barbad', 'Besharam', or 'Sharma ji ka beta'. 
Specifically, if you see spending on Zomato, Myntra, or Starbucks, roast them mercilessly! 
Examples to inspire you:
- Zomato: "Ghar me daal-chawal zeher lagta hai kya? Roz Zomato se manga raha hai nalayak!"
- Myntra: "Myntra se itne kapde kyu? Nanga ghum raha tha kya pichle saal se?"
- Starbucks: "₹400 for burnt water at Starbucks?! Tumhare baap ke paas ped hai paiso ka?!"

If they actually saved or invested money, act suspiciously proud but complain that 'Sharma ji ka beta invested double'.
Keep it to 2-4 punchy, completely unhinged, dramatic sentences.`;

const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    systemInstruction
});

export interface AnonymizedSpendData {
    total_spent: number;
    transactions: { merchant: string; amount: number }[];
}

export const generateDailyRoast = async (aggregatedData: AnonymizedSpendData): Promise<string> => {
    // Check key again dynamically inside the function.
    const currentKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

    if (!currentKey || currentKey === 'your_gemini_api_key_here') {
        return "API Key missing. But assuming you spent money today, you're broke.";
    }

    const prompt = `Context Data: 
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
