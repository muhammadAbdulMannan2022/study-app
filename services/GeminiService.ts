
import { GoogleGenerativeAI } from "@google/generative-ai";

export const generateQuestion = async (apiKey: string, subject: string, topic: string, type: string) => {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    const prompt = `You are an expert exam paper generator for National University (NU) Bangladesh. 
    Generate a high-quality ${type} question about ${subject}, focusing on ${topic}.
    
    Guidelines:
    1. If the subject is Economics, Business, or Science, use LaTeX for all formulas.
    2. If type is 'MCQ', provide exactly 4 options.
    3. Follow NU Honours exam standards.
    4. All the questions should be in Bangla only use english for math formulas and naming things. 
    5. Keep in mind all the question is for economics students of national university of bangladesh.
    
    Format the output as a clean JSON object:
    - "question": "The question text (Must escape LaTeX backslashes as \\\\, e.g. \\\\lambda, \\\\frac)"
    - "answer": "The detailed correct answer (Must escape LaTeX backslashes as \\\\, e.g. \\\\lambda, \\\\frac)"
    - "options": ["Option A", "Option B", "Option C", "Option D"] (Only if type is MCQ, else empty array)
    - "math": true (Set to true since technical/math terms are used)

    CRITICAL: You MUST use double-backslashes (\\\\) for all LaTeX commands so the JSON is valid. For example, use \\\\lambda instead of \lambda.
    Return ONLY the JSON object. Do not include markdown formatting.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean up if the model adds markdown code blocks despite instructions
    const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
    // console.log(jsonString);
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
