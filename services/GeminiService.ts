
import { GoogleGenerativeAI } from "@google/generative-ai";

export const generateQuestion = async (apiKey: string, subject: string, topic: string, type: string) => {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `Generate a ${type} question about ${subject}, specifically focusing on ${topic}. 
    Format the output as JSON with the following keys:
    - question: The question text. Use LaTeX for math equations, enclosed in $...$ for inline or $$...$$ for block.
    - answer: The clean answer text. Use LaTeX for math if needed.
    - math: Boolean, true if the question involves math formulas.
    
    Make the question challenging but appropriate for an exam. 
    Do not include any markdown code blocks (like \`\`\`json), just the raw JSON object.`;

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
