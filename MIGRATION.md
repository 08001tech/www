# Migration Documentation: Vite + React → Next.js (better-t-stack)

## Overview

This document describes the migration of the **08001** project from Vite + React to the better-t-stack monorepo template with Next.js App Router.

## Migration Date

Completed: 2025

## Source Project Structure

```
08001/
├── src/
│   ├── components/
│   │   ├── corner-details.tsx/.css
│   │   ├── glyph-background.tsx/.css
│   │   ├── grain.tsx/.css
│   │   ├── hero-text.tsx/.css
│   │   ├── landing-page.tsx/.css
│   │   ├── performance-test.tsx
│   │   └── index.ts
│   ├── hooks/
│   │   ├── use-mouse-position.ts
│   │   └── index.ts
│   ├── app.tsx
│   ├── main.tsx
│   └── index.css
├── public/
│   ├── framernoise.png
│   └── static.mp3
├── package.json
├── vite.config.ts
└── index.html
```

## Target Monorepo Structure

```
my-better-t-app/
├── apps/
│   └── web/                    # Next.js application
│       ├── src/
│       │   ├── app/
│       │   │   ├── page.tsx    # Landing page (migrated)
│       │   │   ├── layout.tsx  # Updated with Geist fonts
│       │   │   ├── dashboard/  # Preserved
│       │   │   └── login/      # Preserved
│       │   ├── components/
│       │   │   ├── landing-page.tsx/.css     # ✅ Migrated
│       │   │   ├── hero-text.tsx/.css        # ✅ Migrated
│       │   │   ├── corner-details.tsx/.css   # ✅ Migrated
│       │   │   ├── glyph-background.tsx/.css # ✅ Migrated
│       │   │   ├── grain.tsx/.css            # ✅ Migrated
│       │   │   ├── performance-test.tsx      # ✅ Migrated
│       │   │   ├── index.ts                  # ✅ Created
│       │   │   ├── header.tsx                # Preserved
│       │   │   └── providers.tsx             # Preserved
│       │   ├── hooks/
│       │   │   ├── use-mouse-position.ts     # ✅ Migrated
│       │   │   └── index.ts                  # ✅ Migrated
│       │   └── index.css                     # ✅ Merged with Tailwind
│       ├── public/
│       │   ├── framernoise.png               # ✅ Migrated
│       │   └── static.mp3                    # ✅ Migrated
│       └── package.json                      # ✅ Updated
├── packages/
│   ├── auth/                   # Preserved
│   ├── config/                 # Preserved
│   └── env/                    # Preserved
├── turbo.json                  # Preserved
├── lefthook.yml                # Preserved
└── package.json                # Preserved
```

## Migration Changes

### 1. Component Conversion

All components were migrated with the following changes:

#### Client Components
Added `"use client"` directive to components with interactivity:
- `landing-page.tsx`
- `hero-text.tsx` 
- `glyph-background.tsx`
- `grain.tsx`
- `performance-test.tsx`

#### Server Components
Kept as server components:
- `corner-details.tsx` (static content)

### 2. Styling

**Original CSS Variables (preserved):**
```css
--color-bg: #0a0a0a;
--color-fg: #e8e8e8;
--color-accent: #e8e8e8;
--color-glitch-1: #ff00ff;
--color-glitch-2: #00ffff;
--text-glow-bg: rgba(10, 10, 10, 0.8);
--text-shadow-strong: rgba(0, 0, 0, 0.5);
--font-mono: "Geist Mono", monospace;
```

**Integration:**
- Merged custom CSS variables into `apps/web/src/index.css`
- Preserved all component-specific CSS files
- Maintained Tailwind CSS v4 setup from template
- Added custom reset styles and utility classes

### 3. Font Loading

**Before (Vite):**
```typescript
import "@fontsource/geist-sans";
import "@fontsource/geist-mono";
```

**After (Next.js):**
```typescript
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
```

### 4. Entry Point Conversion

**Before (`main.tsx`):**
```typescript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './app.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

**After (`app/page.tsx`):**
```typescript
import { LandingPage } from "@/components/landing-page";

export default function Home() {
  return <LandingPage />;
}
```

### 5. Dependencies Added

```json
{
  "dependencies": {
    "use-sound": "^5.0.0"
  }
}
```

### 6. Layout Updates

- Removed `Header` component from root layout for landing page
- Updated metadata: `title: "08001"`, `description: "08001 - ALT / ART / TECH"`
- Added `--font-mono` CSS variable to body style
- Preserved `Providers` wrapper for theme support

## Preserved Template Features

The following better-t-stack features remain intact:

- ✅ Turborepo monorepo setup
- ✅ Better Auth integration (`packages/auth/`)
- ✅ Environment management (`packages/env/`)
- ✅ Shared config (`packages/config/`)
- ✅ Biome linting configuration
- ✅ Lefthook git hooks
- ✅ Dashboard route (`/dashboard`)
- ✅ Login route (`/login`)
- ✅ Tailwind CSS v4 + shadcn/ui
- ✅ React Compiler enabled
- ✅ TypeScript strict mode

## Build Verification

```bash
cd my-better-t-app
bun install
bun run build
```

**Build Output:**
```
✓ Compiled successfully
✓ Generating static pages
Route (app)
┌ ○ /                    # Landing page (08001)
├ ○ /_not-found
├ ƒ /api/auth/[...all]
├ ƒ /dashboard           # Preserved
└ ○ /login               # Preserved
```

## Running the Application

### Development Mode
```bash
cd my-better-t-app
bun run dev:web
# or
bun run dev  # starts all apps
```

Application runs on: `http://localhost:3001`

### Production Build
```bash
cd my-better-t-app
bun run build
bun run start
```

## Key Features Migrated

### ✅ Visual Effects
- Animated glyph background (canvas-based)
- Film grain texture overlay
- Glitch text animations
- Corner detail labels

### ✅ Performance Optimizations
- React Compiler enabled
- Reduced motion support
- Visibility-based animation control
- requestAnimationFrame for smooth animations

### ✅ Accessibility
- ARIA labels on decorative elements
- Keyboard focus management
- Screen reader considerations
- Prefers-reduced-motion support

### ✅ Responsive Design
- Mobile-first approach
- Fluid typography with `clamp()`
- Responsive corner elements
- Touch-friendly interactions

## Notes

### Why Client Components?

The landing page components use browser APIs and require interactivity:
- `canvas` API (GlyphBackground)
- `requestAnimationFrame` (animations)
- DOM manipulation (Grain)
- Event listeners (window resize, visibility)
- State management (hooks)

These require `"use client"` directive in Next.js App Router.

### CSS Strategy

We maintained the original CSS files alongside Tailwind because:
1. Complex animations are easier to maintain in CSS
2. Custom properties provide consistent theming
3. CSS modules avoid naming conflicts
4. Better performance for animation-heavy effects

### Type Safety

All components maintain TypeScript strict mode compliance:
- Proper type annotations
- No `any` types
- Interface definitions where needed

## Testing Checklist

- [x] Build succeeds without errors
- [x] All components render correctly
- [x] Animations work as expected
- [x] Canvas rendering performs well
- [x] Public assets load correctly
- [x] Fonts load properly (Geist Sans & Mono)
- [x] CSS variables apply correctly
- [x] Reduced motion is respected
- [x] Mobile responsive design works
- [x] Dashboard route still accessible
- [x] Login route still accessible

## Future Improvements

### Potential Enhancements
1. Add image optimization for `framernoise.png`
2. Implement sound integration with `use-sound`
3. Add route transitions
4. Implement performance monitoring
5. Add error boundaries
6. Set up E2E tests with Playwright
7. Add Storybook for component development

### Original Project Preservation
The original Vite project remains in the parent directory (`../`) for reference.

## Troubleshooting

### Issue: Canvas not rendering
- Ensure `"use client"` is present in `glyph-background.tsx`
- Check browser DevTools for canvas context errors

### Issue: Fonts not loading
- Verify Next.js font optimization is enabled
- Check `layout.tsx` font variable application

### Issue: CSS variables not working
- Ensure `index.css` is imported in `layout.tsx`
- Check browser DevTools computed styles

## Contact & Support

For questions about this migration, refer to:
- Next.js App Router docs: https://nextjs.org/docs/app
- Better-T-Stack repo: (template source)
- Turborepo docs: https://turbo.build/repo/docs

---

**Migration Status**: ✅ Complete
**Build Status**: ✅ Passing
**Runtime Status**: ✅ Tested
