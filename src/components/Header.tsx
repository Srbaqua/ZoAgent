"use client"

import { useAccount } from "wagmi"
import { WalletButton } from "./WalletButton"

export function Header() {
  const { address, isConnected } = useAccount()

  return (
    <div className="flex items-center justify-between mb-10">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">
          Zo House AI Agent
        </h1>
        <p className="text-sm text-zinc-400 mt-1 max-w-md">
          Autonomous builder reputation, collaboration & on-chain trust
        </p>
      </div>

      <div className="flex items-center gap-2">
        {isConnected && (
          <span className="text-xs px-3 py-1 rounded-full bg-zinc-800 border border-zinc-700">
            {address?.slice(0, 6)}…{address?.slice(-4)}
          </span>
        )}
        <WalletButton />
      </div>
    </div>
  )
}
