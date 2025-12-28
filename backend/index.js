import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import dotenv from "dotenv"

dotenv.config()

const app = express()
app.use(cors())
app.use(bodyParser.json())

const profiles = new Map() // in-memory for MVP

app.post("/profile", (req, res) => {
  const { wallet, data } = req.body
  profiles.set(wallet, data)
  res.json({ success: true })
})

app.get("/profile/:wallet", (req, res) => {
  const profile = profiles.get(req.params.wallet)
  res.json(profile || null)
})

app.listen(4000, () => {
  console.log("Backend running on http://localhost:4000")
})
