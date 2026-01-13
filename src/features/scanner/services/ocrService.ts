import { GoogleGenerativeAI } from "@google/generative-ai";
import * as FileSystem from 'expo-file-system/legacy'; // Fix for Expo SDK 52+ deprecation

// NOTE: Key is now safely loaded from .env file (EXPO_PUBLIC_GEMINI_API_KEY)
const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || "";

const genAI = new GoogleGenerativeAI(API_KEY);

interface OCRResult {
    merchantName: string;
    date: string;
    totalAmount: number;
    items: { name: string; amount: number }[];
    category: string;
    currency?: string;
    confidence: number;
}

export const analyzeReceipt = async (imageUri: string): Promise<OCRResult> => {
    console.log('Analyzing receipt with Gemini:', imageUri);

    let base64: string = "";
    try {
        // 1. Convert image to Base64
        base64 = await FileSystem.readAsStringAsync(imageUri, {
            encoding: 'base64',
        });
    } catch (fsError) {
        console.error("FileSystem Error:", fsError);
        return {
            merchantName: "Error reading file",
            date: new Date().toISOString(),
            totalAmount: 0,
            items: [],
            category: "Error",
            confidence: 0
        };
    }

    // List of models to try in order of preference (Free Tier friendly first)
    const CANDIDATE_MODELS = [
        "gemini-2.0-flash-lite-preview-02-05", // Often good for free tier
        "gemini-2.0-flash-lite",
        "gemini-2.0-flash",
        "gemini-flash-latest",
        "gemini-1.5-flash",
        "gemini-pro-vision"
    ];

    let lastError: any = null;

    for (const modelName of CANDIDATE_MODELS) {
        try {
            console.log(`Attempting OCR with model: ${modelName}...`);
            const model = genAI.getGenerativeModel({ model: modelName });

            // 3. Prompt
            const prompt = `
                Analyze this receipt image and extract the following information in JSON format:
                - merchantName (string): The name of the store or merchant.
                - date (string): The date of the transaction in ISO 8601 format (YYYY-MM-DD). If not found, use today's date.
                - totalAmount (number): The total amount paid.
                - currency (string): The currency code. Default to "INR" if symbol is ₹, Rs, or unclear.
                - category (string): A category for this expense (e.g., Food, Travel, Utilities, Shopping, specific merchant type).
                - items (array): An array of objects with 'name' (string) and 'amount' (number) for each line item.
                
                Return ONLY raw JSON. No markdown formatting.
            `;

            // 4. Generate Content
            const result = await model.generateContent([
                prompt,
                { inlineData: { data: base64, mimeType: "image/jpeg" } }
            ]);

            const response = await result.response;
            const text = response.text();

            console.log(`Success with ${modelName}!`);

            // 5. Parse JSON
            const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
            const data = JSON.parse(jsonString);

            return {
                merchantName: data.merchantName || "Unknown Merchant",
                date: data.date || new Date().toISOString(),
                totalAmount: data.totalAmount || 0,
                items: data.items || [],
                category: data.category || "Uncategorized",
                confidence: 0.9,
            };

        } catch (error: any) {
            console.warn(`Model ${modelName} failed:`, error.message?.slice(0, 100)); // Log short error
            lastError = error;
            // Continue to next model in list
        }
    }

    // If we reach here, all models failed
    console.error("All Gemini models failed.", lastError);

    return {
        merchantName: "Scan Failed (Quota/API Error)",
        date: new Date().toISOString(),
        totalAmount: 0.00,
        items: [],
        category: "Error",
        confidence: 0,
    };
};
