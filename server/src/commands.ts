export const COMMANDS = [
  'git status',
  'git checkout -b feature/socks',
  'git commit -m "feat: add sock prize"',
  'git rebase -i HEAD~3',
  'git push origin main',
  'npm install',
  'npm run build',
  'npm run dev',
  'npx vite',
  'npx nuxt dev',
  'docker compose up -d',
  'docker ps --format "table {{.Names}}\\t{{.Status}}"',
  'curl -I https://example.com',
  'ls -la',
  'node -v',
  'pnpm i',
  'yarn dlx create-vite',
  'chmod +x ./deploy.sh',
  'grep -R "TODO:" -n .',
  'printf "Hello, socks!\\n"',
]

export function pickRandomCommand(exclude?: string) {
  const pool = exclude ? COMMANDS.filter(c => c !== exclude) : [...COMMANDS]
  if (pool.length === 0) return COMMANDS[0]
  return pool[Math.floor(Math.random() * pool.length)]
}
