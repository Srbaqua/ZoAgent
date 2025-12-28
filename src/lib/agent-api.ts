export async function fetchRecommendations(wallet: string) {
  const res = await fetch(`http://localhost:4000/agent/${wallet}`)
  if (!res.ok) return null
  return res.json()
}
