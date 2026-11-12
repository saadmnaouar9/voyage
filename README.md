# voyage — Azura Voyages

Premium travel agency website. React 19 · Vite · Tailwind CSS 3 · Framer Motion · GSAP · Three.js · React Router

## Run it

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build in dist/
npm run preview   # serve the production build
```

On Windows you can also double-click `start.bat` (installs dependencies if needed, starts the server, opens the browser).
Open the site through the dev server — opening `index.html` directly from disk shows a blank page.

## Pages
`/` Home · `/destinations` (interactive 3D Earth) · `/destinations/:slug` · `/offers` · `/packages` · `/hotels`
· `/experiences` · `/about` · `/contact` · `/booking`

## Highlights
- **Interactive 3D Earth** (`src/components/Earth3D.jsx`): day/night lighting with city lights, procedural clouds and cloud shadows,
  atmosphere glow, drag-to-rotate, wheel/pinch zoom, idle auto-rotate, clickable markers with fly-to and highlight animation.
- Destinations page: search, continent and category filters, glass info panel (photos, highlights, best time, temperature,
  currency, language, budget, attractions, activities), favorites and a multi-destination trip tray (saved in `localStorage`).
- 14 destinations with full detail pages (Maldives, Bali, Dubai, Switzerland, Turkey, Thailand, Morocco + Santorini, Rome, Tokyo,
  New York, Sydney, Cape Town, Rio de Janeiro).
- Booking: hero search bar (destination, date-range calendar, travelers) → 4-step booking with live price quote, validation and
  confirmation with reference + `.ics` download.
- Responsive layout, `prefers-reduced-motion` respected, Three.js lazy-loaded in its own chunk.

## Customising
- Content: `src/data/data.js` (destinations, offers, packages, hotels, pricing) and `src/data/atlas.js` (globe panel facts).
- Hero video: set `HERO_VIDEO` in `src/pages/Home.jsx` to an `.mp4` path placed in `public/`.
- Photography is loaded from Unsplash via `img()` in `data.js`; replace with your own files for production.
- Earth textures live in `public/textures/`.
- Brand colours and fonts: `tailwind.config.js` and `index.html`.
- Logo files: `public/logo-white.png` (used), favicon: `public/favicon.png`.

> Placeholder content: prices, testimonials, address, phone number and registration numbers are sample data.
