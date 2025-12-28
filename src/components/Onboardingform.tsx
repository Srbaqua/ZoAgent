"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { onboardingSchema, OnboardingData } from "@/lib/onboarding-schema"
import { saveProfile } from "@/lib/api"
import { useAccount } from "wagmi"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function OnboardingForm({
  onComplete,
}: {
  onComplete: (d: OnboardingData) => void
}) {
  const { address } = useAccount()

  const form = useForm<OnboardingData>({
    resolver: zodResolver(onboardingSchema),
  })

  async function onSubmit(data: OnboardingData) {
    if (!address) return

    await saveProfile(address, data)
    onComplete(data)
  }

  return (
    <Card className="w-[420px]">
      <CardHeader>
        <CardTitle>Builder Onboarding</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <Input placeholder="Name" {...form.register("name")} />
        <Input placeholder="Role" {...form.register("role")} />
        <Input placeholder="Skills" {...form.register("skills")} />
        <Input placeholder="Interests" {...form.register("interests")} />
        <Input placeholder="Zo House (BLRxZo / SFOxZo / Remote)" {...form.register("zoHouse")} />

        <Button
          className="w-full"
          onClick={form.handleSubmit(onSubmit)}
        >
          Complete Onboarding
        </Button>
      </CardContent>
    </Card>
  )
}
