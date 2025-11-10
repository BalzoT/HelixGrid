# libs/ui

Starter shared UI library for HelixGrid.

Notes
- Tailwind classes in this library are consumed by apps with Tailwind configured. Ensure each consuming app includes `../../libs/**/*.{ts,tsx}` in its Tailwind `content` array.
- Components expect shadcn-style CSS variables defined in the consuming app's `globals.css`.

Example usage
```tsx
// Preferred subpath import (Node/TS):
import { Button } from '#ui'
// Fallback alias (tsconfig paths):
// import { Button } from '@ui'

export default function Page() {
  return <Button variant="secondary">Hello</Button>
}
```
