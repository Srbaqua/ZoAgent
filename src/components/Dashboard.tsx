"use client"

import { useEffect, useState } from "react"
import { useAccount } from "wagmi"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { fetchRecommendations } from "@/lib/agent-api"
import { OnboardingData } from "@/lib/onboarding-schema"

export function Dashboard({ profile }: { profile: OnboardingData }) {
  const { address } = useAccount()
  const [recs, setRecs] = useState<any>(null)

  useEffect(() => {
    if (!address) return

    fetchRecommendations(address).then(setRecs)
  }, [address])

  return (
    <div className="grid gap-4 max-w-3xl w-full">
      {/* Wallet */}
      <Card>
        <CardHeader>
          <CardTitle>Wallet</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          {address}
        </CardContent>
      </Card>

      {/* Profile */}
      <Card>
        <CardHeader>
          <CardTitle>Builder Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Role:</strong> {profile.role}</p>
          <p>
            <strong>Skills:</strong>{" "}
            {profile.skills.split(",").map((s) => (
              <Badge key={s} variant="secondary" className="mr-1">
                {s.trim()}
              </Badge>
            ))}
          </p>
          <p><strong>Interests:</strong> {profile.interests}</p>
          <p><strong>Zo House:</strong> {profile.zoHouse}</p>
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>AI Agent Recommendations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {!recs && <p>Waiting for agent update…</p>}

          {recs && (
            <>
              <div>
                <strong>Collaborations</strong>
                <ul className="list-disc ml-5">
                  {recs.collaborations.map((c: string, i: number) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>

              <p>
                <strong>Bounty:</strong> {recs.bounty}
              </p>

              <p>
                <strong>Activity:</strong> {recs.activity}
              </p>

              <p className="text-xs text-muted-foreground">
                Generated autonomously by Zo House AI Agent
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
