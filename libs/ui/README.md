# libs/ui

Starter shared UI library for HelixGrid.

Notes
- Tailwind classes in this library are consumed by apps with Tailwind configured. Ensure each consuming app includes `../../libs/**/*.{ts,tsx}` in its Tailwind `content` array.
- Components expect shadcn-style CSS variables defined in the consuming app's `globals.css`.

Example usage
```tsx
// With Nx path alias (recommended):
// import { Button } from '@ui'
// Or without alias yet:
import { Button } from '../../libs/ui/src'

export default function Page() {
  return <Button variant="secondary">Hello</Button>
}
```
