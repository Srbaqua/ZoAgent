export function isMetaMaskInstalled(): boolean {
  if (typeof window === "undefined") return false
  return Boolean((window as any).ethereum?.isMetaMask)
}
