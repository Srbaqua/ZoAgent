import dotenv from "dotenv"
dotenv.config()

import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" })

export async function generateRecommendations(profile) {
  const prompt = `
You are an autonomous AI agent operating inside Zo World.

Builder profile:
Name: ${profile.name}
Role: ${profile.role}
Skills: ${profile.skills}
Interests: ${profile.interests}
Zo House: ${profile.zoHouse}

Context:
Zo Houses are physical + cultural hubs.
BLRxZo focuses on early-stage builders and experimentation.
SFOxZo focuses on scaling, founders, and investors.
WTFxZo focuses on creative tech, media, and culture.

Your task:
1. Suggest 2 HIGH-VALUE collaboration ideas that make sense specifically for ${profile.zoHouse}
2. Suggest 1 bounty or initiative relevant to that Zo House
3. Suggest 1 concrete action the builder should take THIS WEEK inside Zo World

Rules:
- Be practical, not generic
- Use Zo House context explicitly
- Respond in JSON only

JSON format:
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
