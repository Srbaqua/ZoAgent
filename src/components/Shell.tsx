export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-5xl">{children}</div>
    </main>
  )
}
