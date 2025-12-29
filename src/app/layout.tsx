"use client"

import "./globals.css"
import { WagmiProvider } from "wagmi"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { wagmiConfig } from "@/lib/wagmi"

const queryClient = new QueryClient()

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#0a0a0a] text-zinc-100 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.15),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(168,85,247,0.12),transparent_40%)]" />
        
        <WagmiProvider config={wagmiConfig}>
          <QueryClientProvider client={queryClient}>
            <div className="relative z-10">
              {children}
            </div>
          </QueryClientProvider>
        </WagmiProvider>
      </body>
    </html>
  )
}
