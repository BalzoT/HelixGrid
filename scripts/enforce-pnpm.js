/**
 * Prevent installs with npm or yarn. Enforce pnpm.
 */
const ua = process.env.npm_config_user_agent || ''
if (!ua.includes('pnpm')) {
  console.error('\nThis workspace uses pnpm.\nPlease install dependencies with: \x1b[1mpnpm install\x1b[0m\n')
  process.exit(1)
}

