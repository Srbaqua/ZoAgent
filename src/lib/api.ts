export async function saveProfile(wallet: string, data: any) {
  const res = await fetch("http://localhost:4000/profile", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ wallet, data }),
  })

  if (!res.ok) {
    throw new Error("Failed to save profile")
  }

  return res.json()
}
