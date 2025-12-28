import dotenv from "dotenv"
dotenv.config()

import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" })

export async function generateRecommendations(profile) {
  const prompt = `
You are an AI agent for Zo World.

Builder profile:
Name: ${profile.name}
Role: ${profile.role}
Skills: ${profile.skills}
Interests: ${profile.interests}
Zo House: ${profile.zoHouse}

Task:
1. Suggest 2 collaboration ideas inside Zo World
2. Suggest 1 suitable bounty type
3. Suggest 1 Zo House activity

Respond ONLY in valid JSON with this structure:
{
  "collaborations": [],
  "bounty": "",
  "activity": ""
}
`

  const result = await model.generateContent(prompt)
  const text = result.response.text()

  // Gemini sometimes wraps JSON in ``` or text → clean it
  const cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim()

  return JSON.parse(cleaned)
}
