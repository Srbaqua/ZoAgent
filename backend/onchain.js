import { ethers } from "ethers"
import dotenv from "dotenv"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

dotenv.config()

// Resolve __dirname for ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load ABI safely
const abiPath = path.join(__dirname, "ZoReputationABI.json")
const CONTRACT_ABI = JSON.parse(fs.readFileSync(abiPath, "utf-8"))

// Provider
const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL)

// Signer
const signer = new ethers.Wallet(
  process.env.PRIVATE_KEY,
  provider
)

// Contract
const contract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  CONTRACT_ABI,
  signer
)

export async function writeReputationOnChain(wallet, score) {
  const tx = await contract.updateReputation(wallet, score)
  await tx.wait()
  return tx.hash
}

export async function readReputation(wallet) {
  return await contract.reputation(wallet)
}
