# Momento Wow

Interactive web invitations that turn events into unforgettable experiences. One link with music, games, and animations — no more boring PDFs.

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

| Command      | Description                          |
|--------------|--------------------------------------|
| `pnpm dev`   | Start development server             |
| `pnpm build` | Static export build (outputs to `out/`) |
| `pnpm lint`  | Run ESLint                           |

## Tech Stack

- **Next.js 16** (App Router, static export)
- **React 19** + **TypeScript**
- **Tailwind CSS v4** + **shadcn/ui** (new-york style)
- **GSAP** — scroll animations, entrance effects, micro-interactions
- **Framer Motion** — UI transitions and micro-animations
- **Fonts**: Montserrat + Pacifico via `next/font/google`

## Project Structure

```
app/
  page.tsx                    # Landing page
  layout.tsx                  # Root layout (fonts, metadata, analytics)
  demo/
    boda/                     # Wedding demo invitation
    baby-shower/              # Baby shower demo invitation
    cumpleanos-infantil/      # Kids birthday demo (includes mini-games)
      juego-puzzle/
      juego-battleship/
      juego-3-en-raya/
      juego-recoger-regalos/
    evento-corporativo/       # Corporate event demo (trivia, interactive map)
  dashboard/                  # RSVP dashboard (client-side, Supabase Auth)
    login/                    # Login page
    rsvps/                    # RSVP table with search/filter/export
    eventos/                  # Event listing with stats
  politica-privacidad/        # Privacy policy
  terminos-uso/               # Terms of use
components/
  ui/                         # shadcn/ui primitives
  rsvp/                       # Reusable RSVP form system
    rsvp-form.tsx             # Config-driven form (react-hook-form + Zod)
    attendance-toggle.tsx     # Yes/No toggle buttons
    rsvp-success.tsx          # Animated success state
  header.tsx                  # Navigation
  hero-section.tsx            # Hero with emotional hook
  problem-section.tsx         # Traditional vs digital contrast
  portfolio-section.tsx       # Demo showcase
  pricing-section.tsx         # Pricing tiers
  tech-section.tsx            # Performance metrics
  contact-section.tsx         # Contact form
  footer.tsx                  # Footer
  dashboard/                  # Dashboard components
    auth-provider.tsx         # Auth context (session, role, events)
    auth-guard.tsx            # Route protection
    login-form.tsx            # Login form
    dashboard-sidebar.tsx     # Sidebar navigation
    stats-cards.tsx           # Stats cards (total, confirmed, declined, guests)
    rsvp-charts.tsx           # Bar + Donut charts (Recharts)
    rsvp-table.tsx            # Searchable/filterable RSVP table
    csv-export-button.tsx     # CSV export
    event-selector.tsx        # Event filter dropdown
hooks/                        # Custom React hooks
lib/
  utils.ts                    # cn() helper (clsx + tailwind-merge)
  rsvp/                       # RSVP system logic
    types.ts                  # RSVPConfig, RSVPFieldConfig, adapters
    schemas.ts                # Dynamic Zod schema factory
    adapters/                 # Submission adapters
      google-sheets.ts        # Google Apps Script integration
      supabase.ts             # Supabase REST API (Phase 2)
      multi.ts                # Fan-out to multiple destinations
    google-apps-script.js     # Code for client's Google Sheet
  supabase/                   # Supabase integration
    client.ts                 # Browser client singleton
    types.ts                  # Database row types
```

## RSVP System

Reusable, config-driven RSVP form system with validation and remote submission.

- **Config-driven**: Each event page defines an `RSVPConfig` with fields, theme, labels, and adapter
- **Google Sheets adapter** (free tier): Sends data via `fetch` to a Google Apps Script web app. One Sheet handles all events — each `eventId` creates a separate tab automatically
- **Supabase adapter** (premium tier, Phase 2): REST API submission to a Supabase `rsvps` table
- **Demo mode**: If no `googleScriptUrl` is configured, the form succeeds locally without sending data
- **Apps Script setup**: Client pastes `lib/rsvp/google-apps-script.js` into their Google Sheet's Apps Script editor, deploys as web app, and provides the URL

### Adding RSVP to a new event page

```typescript
import { RSVPForm } from '@/components/rsvp/rsvp-form'
import type { RSVPConfig } from '@/lib/rsvp/types'

const config: RSVPConfig = {
  eventId: 'my-event',
  eventName: 'My Event',
  fields: [
    { name: 'name', type: 'text', label: 'Tu nombre', required: true },
    { name: 'attendance', type: 'radio', label: '¿Asistirás?', required: true,
      options: [{ value: 'yes', label: '¡Sí!' }, { value: 'no', label: 'No' }] },
  ],
  adapter: { type: 'google-sheets', googleScriptUrl: 'https://script.google.com/.../exec' },
  theme: { primaryColor: 'primary', accentColor: 'mint' },
}

// Then use: <RSVPForm config={config} />
```

## Dashboard

Client-side RSVP dashboard at `/dashboard/` powered by Supabase.

- **Auth**: Email/password login via Supabase Auth
- **Multi-tenant**: Admin sees all events; clients see only their assigned events
- **Features**: Stats cards, bar/donut charts, searchable RSVP table, CSV export, real-time updates
- **Supabase tables**: `rsvps`, `user_roles` (admin/client), `event_owners` (event assignments)
- **Static export compatible**: Fully client-rendered, no server-side code

## Deployment

Deployed on **Vercel** with static export. Production: [momento-wow-main.vercel.app](https://momento-wow-main.vercel.app/)

## License

Private project. All rights reserved.
