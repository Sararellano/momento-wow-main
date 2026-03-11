# AGENT.md

This file provides guidance to IA when working with code in this repository.

## Project Overview

Momento Wow transforms traditional event invitations (paper/PDF) into interactive digital experiences that create the "first emotion" of the event. We sell memorable experiences through a single link with music, games, and animations — not a conventional web agency.

Built with Next.js 16 and configured for **static export** (`output: 'export'` in next.config.mjs).

### Goals

- Eliminate the disinterest of static PDFs and chaotic RSVPs
- Mobile-first solution where info (maps, schedules, RSVP) is always accessible
- "Código con corazón": custom development, no templates or generic builders

### Hosting

- **Platform**: Vercel
- **Production URL**: https://momento-wow-main.vercel.app/

## Commands

- `pnpm dev` — start dev server
- `pnpm build` — static export build (outputs to `out/`)
- `pnpm lint` — run ESLint

No test framework is configured.

## Architecture

- **Next.js App Router** with static export — no server-side features (no API routes, no SSR)
- **TypeScript** with `@/*` path alias mapping to project root
- **Tailwind CSS v4** with `tw-animate-css` for animations
- **shadcn/ui** (new-york style, RSC-compatible) — primitives in `components/ui/`
- **GSAP (GreenSock)** for scroll animations, entrance effects, and complex micro-interactions (confetti, reveal effects)
- **Framer Motion** for additional micro-animations and UI transitions
- **Fonts**: Montserrat (geometric, legibility) + Pacifico/Script moderna (emotional accents), loaded via `next/font/google`
- **Design**: Playful Minimalism — rounded corners (24px), soft shadows, hand-crafted code optimized for extreme load speed (< 2s)

### Key Directories

- `app/page.tsx` — landing page, composed of section components
- `app/demo/` — interactive demo invitations (boda, baby-shower, cumpleanos-infantil with mini-games)
- `components/` — landing page sections (header, hero, portfolio, pricing, contact, footer)
- `components/ui/` — shadcn/ui primitives (do not edit manually, use `npx shadcn@latest add`)
- `hooks/` — custom hooks (use-mobile, use-toast)
- `lib/utils.ts` — `cn()` helper (clsx + tailwind-merge)

### Landing Page Sections

- **Hero**: Immediate emotional impact ("La invitación de papel termina en la basura")
- **Problem**: Contrast between traditional methods and the digital solution
- **Portfolio demos**: Boda Real, Cumpleaños Gamer (mini-games: Puzzle, Hundir la Flota), Baby Shower
- **Pricing**: Esencial 149€ / Experiencia 249€ / Pack WOW 399€
- **Tech**: Value justification via performance metrics (60fps, 100% custom code)

### Static Output

The `out/` directory contains the pre-built static site. The `static-final/` directory also exists as a build artifact. Both are generated — do not edit directly.

## Conventions

- All user-facing text is in **Spanish**
- Images are unoptimized (required for static export)
- `typescript.ignoreBuildErrors: true` is set in next.config — TypeScript errors won't block builds
- Vercel Analytics is integrated via `@vercel/analytics`

## Design & Brand Guidelines

- **No templates**: Everything must be clean, custom code
- **Speed first**: Every element optimized for fast loading on mobile networks
- **Brand tone**: Professional but exciting and approachable — always highlight emotional value over technical value
- **Colors**: White/Cream background, Lila Eléctrico (primary accent), Verde Menta (secondary accent)
