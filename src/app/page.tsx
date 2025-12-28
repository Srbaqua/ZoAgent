"use client"

import { useAccount } from "wagmi"
import { useState } from "react"

import { WalletButton } from "@/components/WalletButton"
import { OnboardingForm } from "@/components/Onboardingform"
import { OnboardingData } from "@/lib/onboarding-schema"

export default function Home() {
  const { isConnected } = useAccount()
  const [profile, setProfile] = useState<OnboardingData | null>(null)

  if (!isConnected) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <WalletButton />
      </main>
    )
  }

  if (!profile) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <OnboardingForm onComplete={setProfile} />
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-2">
        <h1 className="text-xl font-semibold">Welcome, {profile.name}</h1>
        <p className="text-muted-foreground">
          Agent is now tracking your Zo journey.
        </p>
      </div>
    </main>
  )
}
