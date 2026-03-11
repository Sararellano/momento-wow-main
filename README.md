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
  politica-privacidad/        # Privacy policy
  terminos-uso/               # Terms of use
components/
  ui/                         # shadcn/ui primitives
  header.tsx                  # Navigation
  hero-section.tsx            # Hero with emotional hook
  problem-section.tsx         # Traditional vs digital contrast
  portfolio-section.tsx       # Demo showcase
  pricing-section.tsx         # Pricing tiers
  tech-section.tsx            # Performance metrics
  contact-section.tsx         # Contact form
  footer.tsx                  # Footer
hooks/                        # Custom React hooks
lib/utils.ts                  # cn() helper (clsx + tailwind-merge)
```

## Deployment

Deployed on **Vercel** with static export. Production: [momento-wow-main.vercel.app](https://momento-wow-main.vercel.app/)

## License

Private project. All rights reserved.
