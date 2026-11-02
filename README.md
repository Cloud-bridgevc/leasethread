# LeaseThread (prototype)
React + TypeScript + Vite + Tailwind. `npm install && npm run dev`. Public site at `/`, workspace at `#/app`.
All data is fictional sample data. See `docs/BACKEND_STATUS.md` for what is simulated, `docs/ARCHITECTURE.md` for the AWS design.

## Launch readiness (glow-up)

- Home page: problem section with three sourced statistics, what-we-solve, comparison table, AI section, founder cards and roadmap, with scroll-reveal motion that respects reduced motion. Sections live in `src/components/Glow.tsx` (generated markup); styles and motion in `public/glow.css` and `public/glow.js`.
- The hash router now supports `#/page?s=section` to scroll to a section (used by the new "Problem" nav link and the team links).
- Footer credits the founders. Existing privacy, security and terms pages kept.
- Ship assets in `public/`: OG image, icons, manifest, sitemap, robots, `_headers`; `vercel.json` security headers; founders JSON-LD in `index.html`.
- Dashboard: fixed horizontal overflow on phones.

### Content to confirm before launch
- Contact email `hello@leasethread.site` is a placeholder — create the forward or replace it.
- Statistics (Harvard JCHS, America’s Rental Housing 2024) — re-check figures and links.
- Founder bios describe roles only; replace with confirmed biographies.
