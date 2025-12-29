import TelegramBot from "node-telegram-bot-api"
import dotenv from "dotenv"
import { linkWallet } from "./telegramStore.js"
import { getWalletByTelegramId } from "./telegramStore.js"
import { profiles } from "./index.js"
import { readReputation } from "./onchain.js"

dotenv.config()

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
    polling: true,
})

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id
    bot.sendMessage(
        chatId,
        `👋 Welcome to Zo House Builder Bot!

This bot connects builders with the Zo House AI Agent.

Commands:
• /linkwallet <0x...>
• /profile
• /score
• /leaderboard`
    )
})
bot.onText(/\/linkwallet (0x[a-fA-F0-9]{40})/, (msg, match) => {
    const chatId = msg.chat.id
    const wallet = match[1]

    linkWallet(chatId, wallet)

    bot.sendMessage(
        chatId,
        `✅ Wallet linked successfully!

Wallet:
${wallet}

You can now use:
/profile
/score
/leaderboard`

    )
})

// bot.onText(/\/linkwallet/, (msg) => {
//   const chatId = msg.chat.id


// })
bot.onText(/\/profile/, (msg) => {
    const chatId = msg.chat.id
    const wallet = getWalletByTelegramId(chatId)

    if (!wallet) {
        return bot.sendMessage(
            chatId,
            "❌ Wallet not linked.\nUse /linkwallet 0x..."
        )
    }

    const profile = profiles.get(wallet)

    if (!profile) {
        return bot.sendMessage(
            chatId,
            "⚠️ No profile found. Please onboard via the web app."
        )
    }

    bot.sendMessage(
        chatId,
        `👤 Builder Profile

Name: ${profile.name}
Role: ${profile.role}
Skills: ${profile.skills}
Interests: ${profile.interests}
Zo House: ${profile.zoHouse}

Wallet:
${wallet}`
    )
})

bot.onText(/\/score/, async (msg) => {
  const chatId = msg.chat.id
  const wallet = getWalletByTelegramId(chatId)

  if (!wallet) {
    return bot.sendMessage(
      chatId,
      "❌ Wallet not linked.\nUse /linkwallet 0x..."
    )
  }

  try {
    const score = await readReputation(wallet)

    bot.sendMessage(
      chatId,
      `🏆 On-chain Reputation Score

Wallet:
${wallet}

Score:
${score.toString()}`
    )
  } catch (err) {
    bot.sendMessage(chatId, "⚠️ Failed to fetch score")
  }
})


bot.onText(/\/leaderboard/, async (msg) => {
  const chatId = msg.chat.id

  if (profiles.size === 0) {
    return bot.sendMessage(chatId, "No builders onboarded yet.")
  }

  let leaderboard = []

  for (const wallet of profiles.keys()) {
    try {
      const score = await readReputation(wallet)
      leaderboard.push({
        wallet,
        score: Number(score),
      })
    } catch {}
  }

  leaderboard
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)

  const text =
    "🏆 Zo House Leaderboard\n\n" +
    leaderboard
      .slice(0, 5)
      .map(
        (b, i) =>
          `${i + 1}. ${b.wallet.slice(0, 6)}…${b.wallet.slice(-4)} — ${b.score}`
      )
      .join("\n")

  bot.sendMessage(chatId, text)
})


console.log("Telegram bot running...")

export default bot
