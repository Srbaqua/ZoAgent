import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import dotenv from "dotenv"
import cron from "node-cron"
import "./telegramBot.js"


import { generateRecommendations } from "./agent.js"
import { writeReputationOnChain } from "./onchain.js"

dotenv.config()

const app = express()
app.use(cors())
app.use(bodyParser.json())

/* =======================
   In-memory state (MVP)
======================= */
const profiles = new Map()
const recommendations = new Map()
const lastAgentRun = new Map()
const lastReputation = new Map()
const pendingTx = new Set()

const AGENT_COOLDOWN_MS = 30_000 // 30s

function calculateReputation(profile, recs) {
  let score = 0
  score += profile.skills.split(",").length * 10
  score += recs.collaborations.length * 20
  return score
}

/* =======================
   IMMEDIATE AGENT RUN
======================= */
app.post("/profile", async (req, res) => {
  const { wallet, data } = req.body
  profiles.set(wallet, data)

  try {
    // 🔒 Cooldown check
    const now = Date.now()
    const lastRun = lastAgentRun.get(wallet) || 0
    if (now - lastRun < AGENT_COOLDOWN_MS) {
      console.log(`⏳ Cooldown active for ${wallet}, skipping agent`)
      return res.json({ success: true })
    }
    lastAgentRun.set(wallet, now)

    const recs = await generateRecommendations(data)
    recommendations.set(wallet, recs)

    const reputationScore = calculateReputation(data, recs)
    const prevScore = lastReputation.get(wallet)

    if (prevScore === reputationScore) {
      console.log(`⏭ Reputation unchanged for ${wallet}`)
      return res.json({ success: true })
    }

    lastReputation.set(wallet, reputationScore)

    if (pendingTx.has(wallet)) {
      console.log(`⏳ Tx already pending for ${wallet}`)
      return res.json({ success: true })
    }

    try {
      pendingTx.add(wallet)
      const txHash = await writeReputationOnChain(wallet, reputationScore)
      console.log(`Immediate agent run for ${wallet}`)
      console.log(`Reputation written on-chain: ${txHash}`)
    } finally {
      pendingTx.delete(wallet)
    }
  } catch (err) {
    console.error("Immediate agent run failed", err)
  }

  res.json({ success: true })
})

/* =======================
   AUTONOMOUS AGENT LOOP
======================= */
cron.schedule("*/5 * * * *", async () => {
  console.log("🤖 Agent loop running...")

  for (const [wallet, profile] of profiles.entries()) {
    try {
      const now = Date.now()
      const lastRun = lastAgentRun.get(wallet) || 0
      if (now - lastRun < AGENT_COOLDOWN_MS) {
        console.log(`⏳ Cooldown active for ${wallet}, skipping cron`)
        continue
      }
      lastAgentRun.set(wallet, now)

      const recs = await generateRecommendations(profile)
      recommendations.set(wallet, recs)

      const reputationScore = calculateReputation(profile, recs)
      const prevScore = lastReputation.get(wallet)

      if (prevScore === reputationScore) {
        console.log(`⏭ Reputation unchanged for ${wallet}`)
        continue
      }

      lastReputation.set(wallet, reputationScore)

      if (pendingTx.has(wallet)) {
        console.log(`⏳ Tx already pending for ${wallet}`)
        continue
      }

      try {
        pendingTx.add(wallet)
        const txHash = await writeReputationOnChain(wallet, reputationScore)
        console.log(`Updated reputation for ${wallet}`)
        console.log(`Reputation written on-chain: ${txHash}`)
      } finally {
        pendingTx.delete(wallet)
      }
    } catch (err) {
      console.error(`Agent failed for ${wallet}`, err)
    }
  }
})

/* =======================
   READ APIs
======================= */
app.get("/profile/:wallet", (req, res) => {
  res.json(profiles.get(req.params.wallet) || null)
})

app.get("/agent/:wallet", (req, res) => {
  res.json(recommendations.get(req.params.wallet) || null)
})
export { profiles, recommendations }

app.listen(4000, () => {
  console.log("Backend running on http://localhost:4000")
})
