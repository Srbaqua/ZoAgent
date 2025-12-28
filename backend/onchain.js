import { ethers } from "ethers"
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "./contract.js"

const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL)
const wallet = new ethers.Wallet(process.env.AGENT_PRIVATE_KEY, provider)

const contract = new ethers.Contract(
  CONTRACT_ADDRESS,
  CONTRACT_ABI,
  wallet
)

export async function writeReputationOnChain(user, score) {
  const tx = await contract.updateReputation(user, score)
  await tx.wait()
  return tx.hash
}
