"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAccount } from "wagmi"

import { onboardingSchema, OnboardingData } from "@/lib/onboarding-schema"
import { saveProfile } from "@/lib/api"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FadeUp } from "@/components/Motion"


export function OnboardingForm({
  onComplete,
}: {
  onComplete: (d: OnboardingData) => void
}) {
  const { address } = useAccount()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OnboardingData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      name: "",
      role: "",
      skills: "",
      interests: "",
      zoHouse: "",
    },
  })

  async function onSubmit(data: OnboardingData) {
    if (!address) return
    await saveProfile(address, data)
    onComplete(data)
  }

  return (
    
    <Card className="w-full max-w-md bg-zinc-900 border-zinc-800 shadow-2xl">
      <CardHeader>
        <CardTitle className="text-lg">Builder Onboarding</CardTitle>
        <p className="text-sm text-zinc-400">
          Help the agent understand your skills
        </p>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <div>
            <Input
              {...register("name")}
              className="bg-zinc-950 border-zinc-800"
              placeholder="Name"
            />
            {errors.name && (
              <p className="text-xs text-red-400 mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <Input
              {...register("role")}
              className="bg-zinc-950 border-zinc-800"
              placeholder="Role"
            />
            {errors.role && (
              <p className="text-xs text-red-400 mt-1">
                {errors.role.message}
              </p>
            )}
          </div>

          <div>
            <Input
              {...register("skills")}
              className="bg-zinc-950 border-zinc-800"
              placeholder="Skills (AI, Web3)"
            />
            {errors.skills && (
              <p className="text-xs text-red-400 mt-1">
                {errors.skills.message}
              </p>
            )}
          </div>

          <div>
            <Input
              {...register("interests")}
              className="bg-zinc-950 border-zinc-800"
              placeholder="Interests"
            />
            {errors.interests && (
              <p className="text-xs text-red-400 mt-1">
                {errors.interests.message}
              </p>
            )}
          </div>

          <div>
            <Input
              {...register("zoHouse")}
              className="bg-zinc-950 border-zinc-800"
              placeholder="Zo House (BLRxZo / SFOxZo)"
            />
            {errors.zoHouse && (
              <p className="text-xs text-red-400 mt-1">
                {errors.zoHouse.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 text-sm font-medium bg-white text-black hover:bg-zinc-200"
          >
            {isSubmitting ? "Submitting…" : "Complete Onboarding"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
