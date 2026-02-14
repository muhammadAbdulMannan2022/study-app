
import { GoogleGenerativeAI } from "@google/generative-ai";

export const generateQuestion = async (apiKey: string, subject: string, topic: string, type: string) => {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are an expert exam paper generator for National University (NU) Bangladesh. 
    Generate a high-quality ${type} question about ${subject}, focusing on ${topic}.
    
    Guidelines:
    1. If the subject is Economics, Business, or Science, use LaTeX for all formulas.
    2. If type is 'MCQ', provide exactly 4 options.
    3. Follow NU Honours exam standards.
    4. All the questions should be in Bangla only use english for math formulas and naming things. 
    5. Keep in mind all the question is for economics students of national university of bangladesh.
    
    Format the output as a clean JSON object:
    - "question": "The question text (with LaTeX if needed)"
    - "answer": "The detailed correct answer or explanation"
    - "options": ["Option A", "Option B", "Option C", "Option D"] (Only if type is MCQ, else empty array)
    - "math": true/false (Set to true if LaTeX is used)

    Return ONLY the JSON object. Do not include markdown formatting.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean up if the model adds markdown code blocks despite instructions
    const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
