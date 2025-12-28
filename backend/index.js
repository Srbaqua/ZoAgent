import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import dotenv from "dotenv"
import { generateRecommendations } from "./agent.js"

dotenv.config()

const app = express()
app.use(cors())
app.use(bodyParser.json())

const profiles = new Map() 

app.post("/profile", (req, res) => {
  const { wallet, data } = req.body
  profiles.set(wallet, data)
  res.json({ success: true })
})
const recommendations = new Map()


app.get("/profile/:wallet", (req, res) => {
  const profile = profiles.get(req.params.wallet)
  res.json(profile || null)
})
app.post("/agent/run", async (req, res) => {
  const { wallet } = req.body

  const profile = profiles.get(wallet)
  if (!profile) {
    return res.status(404).json({ error: "Profile not found" })
  }

  try {
    const recs = await generateRecommendations(profile)
    recommendations.set(wallet, recs)

    res.json({
      success: true,
      recommendations: recs,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Agent failed" })
  }
})
app.get("/agent/:wallet", (req, res) => {
  const recs = recommendations.get(req.params.wallet)
  res.json(recs || null)
})


app.listen(4000, () => {
  console.log("Backend running on http://localhost:4000")
})
