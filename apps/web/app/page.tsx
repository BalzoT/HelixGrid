import { Button } from '@ui'

export default function Page() {
  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">HelixGrid</h1>
      <p className="text-sm text-muted-foreground">
        Next.js + Tailwind + shadcn/ui starter in an Nx-ready monorepo.
      </p>
      <Button>Get Started</Button>
    </main>
  )
}

