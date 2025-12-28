"use client"

import { useAccount } from "wagmi"
import { useEffect, useState } from "react"

import { WalletButton } from "@/components/WalletButton"
import { OnboardingForm } from "@/components/Onboardingform"
import { OnboardingData } from "@/lib/onboarding-schema"
import { isMetaMaskInstalled } from "@/lib/wallet"

export default function Home() {
  const { address, isConnected } = useAccount()

  const [mounted, setMounted] = useState(false)
  const [profile, setProfile] = useState<OnboardingData | null>(null)
  const [loadingProfile, setLoadingProfile] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Load profile when wallet connects
  useEffect(() => {
    if (!address) return

    setLoadingProfile(true)

    fetch(`http://localhost:4000/profile/${address}`)
      .then((res) => res.json())
      .then((data) => {
        setProfile(data)
      })
      .finally(() => setLoadingProfile(false))
  }, [address])

  if (!mounted) return null

  /* 1️⃣ MetaMask not installed */
  if (!isMetaMaskInstalled()) {
    return (
      <main className="min-h-screen flex items-center justify-center text-center">
        <div className="space-y-3">
          <h1 className="text-lg font-semibold">MetaMask Required</h1>
          <p className="text-muted-foreground">
            Please install MetaMask to continue.
          </p>
          <a
            href="https://metamask.io/download/"
            target="_blank"
            className="underline"
          >
            Install MetaMask
          </a>
        </div>
      </main>
    )
  }

  /* 2️⃣ Wallet not connected */
  if (!isConnected) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <WalletButton />
      </main>
    )
  }

  /* 3️⃣ Loading profile */
  if (loadingProfile) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>Loading profile…</p>
      </main>
    )
  }

  /* 4️⃣ Connected but no profile */
  if (!profile) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <OnboardingForm onComplete={setProfile} />
      </main>
    )
  }

  /* 5️⃣ Connected + profile exists */
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-2">
        <h1 className="text-xl font-semibold">
          Welcome, {profile.name}
        </h1>
        <p className="text-sm text-muted-foreground">
          Wallet: {address?.slice(0, 6)}…{address?.slice(-4)}
        </p>
        <p className="text-muted-foreground">
          Agent is tracking your Zo journey.
        </p>
      </div>
    </main>
  )
}
