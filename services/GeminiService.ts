
import { GoogleGenerativeAI } from "@google/generative-ai";

export const generateQuestion = async (apiKey: string, subject: string, topic: string, type: string) => {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are an expert exam question generator for National University (NU) Bangladesh Economics program.

Generate a high-quality ${type} question about "${subject}" focusing on the topic "${topic}".

CRITICAL LANGUAGE RULES:
1. Write ALL question and answer text in **Bangla (Bengali)** language
2. Keep ALL mathematical formulas, equations, and LaTeX in **English**
3. Keep technical economic terms in English when commonly used (e.g., GDP, elasticity, demand, supply)
4. Use Bangla for explanations, descriptions, and general text

CRITICAL FORMATTING RULES:
1. For mathematical formulas, use LaTeX notation with SINGLE backslashes (e.g., \\frac{a}{b}, \\lambda, \\Delta)
2. Wrap inline math in single dollar signs: $formula$
3. Wrap display math in double dollar signs: $$formula$$
4. Use proper mathematical notation (subscripts with _, superscripts with ^)

QUESTION QUALITY STANDARDS:
- Make questions challenging but fair for university-level economics students
- Include real-world applications when relevant
- For theoretical questions, ask for explanations with examples
- For mathematical questions, require step-by-step solutions in Bangla
- Ensure answers are comprehensive and educational

OUTPUT FORMAT (JSON):
{
  "question": "বাংলায় প্রশ্ন with $inline math$ or $$display math$$",
  "answer": "বাংলায় বিস্তারিত উত্তর with $math formulas$ where needed",
  "options": ["বিকল্প A", "বিকল্প B", "বিকল্প C", "বিকল্প D"],
  "math": true
}

EXAMPLES OF PROPER LATEX (always in English):
- Fractions: $\\frac{numerator}{denominator}$
- Greek letters: $\\alpha$, $\\beta$, $\\lambda$
- Limits: $\\lim_{x \\to \\infty}$
- Summation: $\\sum_{i=1}^{n}$
- Subscripts/Superscripts: $x_1$, $x^2$

${type === 'MCQ' ? 'Include exactly 4 options in Bangla. Make distractors plausible but clearly incorrect.' : 'Provide a comprehensive answer in Bangla with step-by-step explanation.'}

Return ONLY the JSON object, no markdown formatting.`;

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
