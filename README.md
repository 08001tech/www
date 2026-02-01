# 08001

ALT / ART / TECH - An experimental web experience built with modern TypeScript tools.

## Tech Stack

- **TypeScript** - Type-safe development
- **Next.js 16** - React framework with App Router
- **TailwindCSS v4** - Utility-first CSS
- **Better-Auth** - Authentication system
- **Turborepo** - Monorepo build system
- **Bun** - Fast package manager and runtime

## Getting Started

Install dependencies:

```bash
bun install
```

Run the development server:

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
08001/
├── apps/
│   └── web/              # Next.js application
│       ├── src/
│       │   ├── app/      # App Router pages
│       │   ├── components/
│       │   │   ├── landing-page.tsx
│       │   │   ├── glyph-background.tsx
│       │   │   ├── hero-text.tsx
│       │   │   ├── grain.tsx
│       │   │   └── corner-details.tsx
│       │   └── hooks/
│       │       └── use-mouse-position.ts
│       └── public/
│           ├── framernoise.png
│           └── static.mp3
├── packages/
│   ├── auth/             # Authentication configuration
│   ├── config/           # Shared TypeScript config
│   └── env/              # Environment variables
```

## Scripts

- `bun run dev` - Start all applications in development mode
- `bun run dev:web` - Start web app only
- `bun run build` - Build all applications for production
- `bun run check-types` - Type check all packages

## Configuration

The project uses workspace packages for shared configuration:

- `@08001/auth` - Better-Auth setup
- `@08001/config` - TypeScript and build configs
- `@08001/env` - Environment variable validation with Zod

## Development

The project uses:
- **Biome** for linting and formatting
- **Lefthook** for git hooks
- **Turborepo** for parallel builds and caching
