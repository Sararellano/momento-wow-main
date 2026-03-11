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
- `app/demo/` — interactive demo invitations (boda, baby-shower, cumpleanos-infantil with mini-games, evento-corporativo)
- `components/` — landing page sections (header, hero, portfolio, pricing, contact, footer)
- `components/ui/` — shadcn/ui primitives (do not edit manually, use `npx shadcn@latest add`)
- `components/rsvp/` — reusable RSVP form system (rsvp-form, attendance-toggle, rsvp-success)
- `hooks/` — custom hooks (use-mobile, use-toast)
- `lib/utils.ts` — `cn()` helper (clsx + tailwind-merge)
- `lib/rsvp/` — RSVP types, Zod schema factory, and submission adapters (Google Sheets, Supabase)
- `lib/supabase/` — Supabase browser client singleton and database types
- `app/dashboard/` — RSVP dashboard (login, overview, confirmaciones, eventos)
- `components/dashboard/` — dashboard components (auth, sidebar, stats, charts, table, CSV export)

### Landing Page Sections

- **Hero**: Immediate emotional impact ("La invitación de papel termina en la basura")
- **Problem**: Contrast between traditional methods and the digital solution
- **Portfolio demos**: Boda Real, Cumpleaños Gamer (mini-games: Puzzle, Hundir la Flota), Baby Shower, Evento Corporativo (trivia, mapa interactivo)
- **Pricing**: Esencial 149€ / Experiencia 249€ / Pack WOW 399€
- **Tech**: Value justification via performance metrics (60fps, 100% custom code)

### Static Output

The `out/` directory contains the pre-built static site. The `static-final/` directory also exists as a build artifact. Both are generated — do not edit directly.

## Conventions

- All user-facing text is in **Spanish**
- Images are unoptimized (required for static export)
- `typescript.ignoreBuildErrors: true` is set in next.config — TypeScript errors won't block builds
- Vercel Analytics is integrated via `@vercel/analytics`

## RSVP System

Reusable, configurable RSVP form system with validation (Zod + react-hook-form) and remote submission.

- **Config-driven**: Each event page defines an `RSVPConfig` with fields, theme, labels, and adapter
- **Google Sheets adapter** (free tier): Sends data via `fetch` to a Google Apps Script web app. One Sheet handles all events — each `eventId` creates a separate tab automatically
- **Supabase adapter** (premium tier, Phase 2): REST API submission to a `rsvps` table with JSONB data
- **Multi adapter**: Fan-out to both destinations simultaneously — all 4 demos use `type: 'both'`
- **Demo mode**: If no `googleScriptUrl` is configured, the form succeeds locally without sending data
- **Apps Script code**: `lib/rsvp/google-apps-script.js` — client pastes this into their Google Sheet's Apps Script editor
- **Toaster**: Sonner `<Toaster>` is in `app/layout.tsx` for toast notifications on submit

## Dashboard

Client-side RSVP dashboard at `/dashboard/` with Supabase Auth (email/password). Fully client-rendered (compatible with static export).

- **Auth**: `AuthProvider` context with session, role, allowed events. `AuthGuard` redirects to `/dashboard/login` if unauthenticated
- **Multi-tenant**: Admin role sees all events/RSVPs. Client role sees only assigned events via `event_owners` table
- **Supabase tables**: `rsvps` (RSVP data), `user_roles` (admin/client), `event_owners` (event-to-user mapping)
- **RLS policies**: Public inserts on `rsvps`, admin reads all, clients read only their events
- **Realtime**: Supabase Realtime subscriptions for live RSVP updates + toast notifications
- **Features**: Stats cards, bar/donut charts (Recharts), searchable/filterable table, CSV export, event listing
- **Pages**: `/dashboard` (overview), `/dashboard/rsvps` (table), `/dashboard/eventos` (event list), `/dashboard/login`

## Design & Brand Guidelines

- **No templates**: Everything must be clean, custom code
- **Speed first**: Every element optimized for fast loading on mobile networks
- **Brand tone**: Professional but exciting and approachable — always highlight emotional value over technical value
- **Colors**: White/Cream background, Lila Eléctrico (primary accent), Verde Menta (secondary accent)
