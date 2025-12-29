"use client"

import { useEffect, useState } from "react"
import { useAccount } from "wagmi"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { fetchRecommendations } from "@/lib/agent-api"
import { OnboardingData } from "@/lib/onboarding-schema"
import { FadeUp } from "@/components/Motion"


export function Dashboard({ profile }: { profile: OnboardingData }) {
  const { address } = useAccount()
  const [recs, setRecs] = useState<any>(null)

  useEffect(() => {
    if (!address) return
    fetchRecommendations(address).then(setRecs)
  }, [address])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Builder Profile */}
      <FadeUp delay={0.05}>
      <Card className="bg-zinc-900 border-zinc-800/80 shadow-lg hover:shadow-xl transition-shadow
" >
        <CardHeader>
            {/* <Badge className="bg-zinc-800 text-zinc-100 border border-zinc-700"></Badge> */}
          <CardTitle>Builder Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-zinc-200">


          <p><b>Name:</b> {profile.name}</p>
          <p><b>Role:</b> {profile.role}</p>
          <div className="flex flex-wrap gap-2">
            {profile.skills.split(",").map((s) => (
              <Badge className="bg-zinc-800 text-zinc-100 border border-zinc-700"key={s} variant="secondary">
                {s.trim()}
              </Badge>
            //   <Badge className="bg-zinc-800 text-zinc-100 border border-zinc-700"></Badge>
            ))}
          </div>
          <p className="text-zinc-400 text-xs">
            Zo House: {profile.zoHouse}
          </p>
        </CardContent>
      </Card>
      </FadeUp>

      {/* AI Agent */}
      <FadeUp delay={0.15}>
     <Card className="relative bg-gradient-to-br from-indigo-900/40 via-purple-900/30 to-fuchsia-900/30 border-indigo-700 shadow-2xl overflow-hidden">
  <div className="absolute -inset-0.5 bg-indigo-500/20 blur-xl pointer-events-none" />


        <CardHeader>
          <CardTitle>AI Agent Output</CardTitle>
          <p className="text-xs text-indigo-300">
            Generated autonomously
          </p>
        </CardHeader>

        <CardContent className="space-y-4 text-sm">
          {!recs && (
  <p className="text-indigo-200 italic">
    Agent is analyzing your profile…
  </p>
)}


          {recs && (
            <>
              <div>
                <p className="font-medium">Collaborations</p>
                <ul className="list-disc ml-4">
                  {recs.collaborations.map((c: string, i: number) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>

              <p><b>Bounty:</b> {recs.bounty}</p>
              <p><b>Activity:</b> {recs.activity}</p>
            </>
          )}
        </CardContent>
      </Card>
      </FadeUp>
    </div>
  )
}
