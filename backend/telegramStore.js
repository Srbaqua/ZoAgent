// telegramStore.js

// telegramUserId -> walletAddress
export const telegramWalletMap = new Map()

export function linkWallet(telegramId, wallet) {
  telegramWalletMap.set(telegramId, wallet)
}

export function getWalletByTelegramId(telegramId) {
  return telegramWalletMap.get(telegramId)
}
