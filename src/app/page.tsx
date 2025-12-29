"use client"

import { useEffect, useState } from "react"
import { useAccount } from "wagmi"

import { WalletButton } from "@/components/WalletButton"
import { OnboardingForm } from "@/components/Onboardingform"
import { Dashboard } from "@/components/Dashboard"
import { Header } from "@/components/Header"
import { Shell } from "@/components/Shell"

import { OnboardingData } from "@/lib/onboarding-schema"
import { isMetaMaskInstalled } from "@/lib/wallet"

export default function Page() {
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

  // Prevent hydration issues
  if (!mounted) return null

  /* 🚫 MetaMask missing */
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

  return (
    <Shell>
      <Header />

      {/* 🔌 Wallet not connected */}
      {!isConnected && (
        <div className="flex justify-center mt-12">
          <WalletButton />
        </div>
      )}

      {/* ⏳ Loading profile */}
      {isConnected && loadingProfile && (
        <p className="text-center text-zinc-400 mt-12">
          Loading profile…
        </p>
      )}

      {/* 📝 Onboarding */}
      {isConnected && !loadingProfile && !profile && (
        <div className="flex justify-center mt-12">
          <OnboardingForm onComplete={setProfile} />
        </div>
      )}

      {/* 📊 Dashboard */}
      {isConnected && profile && (
        <div className="mt-10">
          <Dashboard profile={profile} />
        </div>
      )}
    </Shell>
  )
}
