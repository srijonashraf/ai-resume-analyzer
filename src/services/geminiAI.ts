import { GoogleGenerativeAI } from "@google/generative-ai";
import { AnalysisResult, JobMatchResult } from "../state/useStore";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Helper function to clean JSON response
const cleanAndParseJSON = (text: string) => {
  // Remove markdown code blocks and any extra whitespace
  const cleanedText = text.replace(/```json\n?|\n?```/g, "").trim();
  return JSON.parse(cleanedText);
};

/**
 * Analyze a resume using Gemini API
 */
export const analyzeResume = async (
  resumeText: string
): Promise<AnalysisResult> => {
  try {
    if (!GEMINI_API_KEY) {
      return getMockAnalysisResults();
    }

    const prompt = `
      You are a professional resume analyzer. Analyze the following resume text.
      1. Score the resume in terms of skills, experience, and formatting (scale of 1-10).
      2. Provide suggestions for improvement.
      3. Return ONLY a JSON object with NO markdown formatting, following this structure:
      {
        "skills": number,
        "experience": number,
        "format": number,
        "suggestions": string[],
        "missingSkills": string[]
      }
      
      Resume text: ${resumeText}
    `;

    const result = await model.generateContent(prompt);
    const content = result.response.text();
    return cleanAndParseJSON(content);
  } catch (error) {
    console.error("Error analyzing resume:", error);
    return getMockAnalysisResults();
  }
};

// Compare resume with job description using Gemini

export const compareWithJobDescription = async (
  resumeText: string,
  jobDescription: string
): Promise<JobMatchResult> => {
  try {
    if (!GEMINI_API_KEY) {
      return getMockJobMatchResults();
    }

    const prompt = `
      You are a professional resume analyzer. Compare the following resume with the job description.
      1. Calculate a match percentage (0-100).
      2. Identify missing skills or qualifications.
      3. Provide suggestions for improving the resume to better match the job.
      4. Return ONLY a JSON object with NO markdown formatting, following this structure:
      {
        "matchPercentage": number,
        "missingSkills": string[],
        "suggestions": string[]
      }
      
      Resume text: ${resumeText}
      
      Job Description: ${jobDescription}
    `;

    const result = await model.generateContent(prompt);
    const content = result.response.text();
    return cleanAndParseJSON(content);
  } catch (error) {
    console.error("Error comparing with job description:", error);
    return getMockJobMatchResults();
  }
};

// Mock data if API fails
const getMockAnalysisResults = (): AnalysisResult => ({
  skills: 7,
  experience: 6,
  format: 8,
  suggestions: [
    "Add more quantifiable achievements",
    "Include relevant certifications",
    "Improve skills section with more technical details",
  ],
  missingSkills: ["Project management", "Team leadership", "Data analysis"],
});

const getMockJobMatchResults = (): JobMatchResult => ({
  matchPercentage: 75,
  missingSkills: ["Docker", "Kubernetes", "CI/CD pipelines"],
  suggestions: [
    "Highlight experience with cloud technologies",
    "Add more details about team collaboration",
    "Include specific examples of problem-solving",
  ],
});
