import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function reviewCode(code: string, language: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: `You are an expert developer. Review the following ${language} code for bugs, optimization, and security issues. 
      Provide your response in JSON format with fields: 'bugs' (array of strings), 'optimizations' (array of strings), 'summary' (string).
      Code:
      ${code}`,
      config: {
        responseMimeType: "application/json"
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("AI Review Error:", error);
    return { summary: "Could not perform AI review at this time." };
  }
}

export async function generatePortfolioSummary(techStack: string[], bio: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Create a futuristic, compelling portfolio summary for a developer with the following bio and tech stack:
      Bio: ${bio}
      Tech Stack: ${techStack.join(", ")}
      Keep it professional and high-tech. Response should be plain text.`,
    });

    return response.text;
  } catch (error) {
    console.error("AI Portfolio Error:", error);
    return "Talented developer building the future of tech.";
  }
}

export async function suggestCodeOptimizations(code: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: `Optimize the following code for better performance and readability. Return the optimized code block only.
      Code:
      ${code}`,
    });

    return response.text;
  } catch (error) {
    console.error("AI Optimization Error:", error);
    return code;
  }
}
