import { z } from "zod"

export const onboardingSchema = z.object({
  name: z.string().min(2),
  role: z.string().min(2),
  skills: z.string().min(2),
  interests: z.string().min(2),
  zoHouse: z.enum(["BLRxZo", "WTFxZo", "SFOxZo", "Remote"]),
})

export type OnboardingData = z.infer<typeof onboardingSchema>
