import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { gsap } from '../lib/gsap'
import {
  Btn, Chip, Counter, Icon, ParallaxImg, Reveal, SectionHeading, SplitWords, Stars, TiltCard, ease, useMedia,
} from './ui'
import { Globe } from './Scene3D'
import { useBooking } from '../context/BookingContext'
import {
  categories, dest as findDest, destinations, experiences, faqs, features, fmt, hotels, img, offers, packages, stats, testimonials,
} from '../data/data'

export function useBookNow() {
  const { update } = useBooking()
  const nav = useNavigate()
  return (patch) => { update({ extras: [], ref: null, ...patch }); nav('/booking') }
}

/* ---------------- Marquee ---------------- */
export function Marquee({ items, className = '' }) {
  const row = [...items, ...items]
  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`} aria-hidden>
      <div className="marquee inline-flex">
        {row.map((t, i) => (
          <span key={i} className="display mx-8 inline-flex items-center gap-16 text-[clamp(2.5rem,6vw,5rem)]">
            {t} <Icon name="plane" className="h-7 w-7 rotate-45 text-ocean-500" />
          </span>
        ))}
      </div>
    </div>
  )
}

/* ---------------- Destination card ---------------- */
export function DestCard({ d, i = 0, className = '' }) {
  return (
    <Link to={`/destinations/${d.slug}`} data-cursor="View" className={`group relative block overflow-hidden rounded-[2rem] bg-navy-900 ${className}`}>
      <img src={img(d.image, 1100)} alt={`${d.name} — ${d.tag}`} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/20 to-transparent opacity-90 transition-opacity duration-700 group-hover:opacity-100" />
      <span className="absolute left-6 top-6 font-mono text-xs text-white/70">{String(i + 1).padStart(2, '0')} / 07</span>
      <span className="glass absolute right-6 top-6 rounded-full px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white">{d.tag}</span>
      <div className="absolute inset-x-0 bottom-0 p-7 text-white">
        <p className="eyebrow !text-ocean-300">{d.country}</p>
        <h3 className="display mt-2 text-5xl">{d.name}</h3>
        <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-700 ease-out group-hover:grid-rows-[1fr]">
          <div className="overflow-hidden">
            <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-white/75">{d.desc}</p>
          </div>
        </div>
        <div className="mt-5 flex items-center justify-between border-t border-white/20 pt-4 text-sm">
          <span className="text-white/70">From <b className="text-lg font-semibold text-white">{fmt(d.from)}</b></span>
          <span className="grid h-11 w-11 place-items-center rounded-full bg-white text-navy-900 transition-all duration-500 group-hover:rotate-45 group-hover:bg-ocean-500 group-hover:text-white"><Icon name="arrowUp" className="h-4 w-4" /></span>
        </div>
      </div>
    </Link>
  )
}

/* ---------------- Horizontal gallery (GSAP pinned) ---------------- */
export function HorizontalGallery() {
  const wrap = useRef(null)
  const track = useRef(null)
  const bar = useRef(null)
  const desktop = useMedia('(min-width: 1024px)')

  useLayoutEffect(() => {
    if (!desktop) return
    const ctx = gsap.context(() => {
      const dist = () => Math.max(0, track.current.scrollWidth - window.innerWidth)
      gsap.to(track.current, {
        x: () => -dist(), ease: 'none',
        scrollTrigger: {
          trigger: wrap.current, start: 'top top', end: () => `+=${dist()}`, pin: true, scrub: 0.7, anticipatePin: 1, invalidateOnRefresh: true,
          onUpdate: (s) => { if (bar.current) bar.current.style.transform = `scaleX(${s.progress})` },
        },
      })
    }, wrap)
    return () => ctx.revert()
  }, [desktop])

  return (
    <section ref={wrap} className="relative overflow-hidden bg-navy-950 py-24 text-white lg:flex lg:h-screen lg:items-center lg:py-0">
      <div ref={track} className={`flex gap-6 px-5 sm:px-8 lg:gap-8 lg:px-14 ${desktop ? 'w-max items-center' : 'no-scrollbar snap-x snap-mandatory overflow-x-auto pb-4'}`}>
        <div className="flex w-[85vw] shrink-0 snap-start flex-col justify-center lg:w-[34vw]">
          <p className="eyebrow !text-ocean-300">The collection</p>
          <SplitWords text="Seven worlds, one standard." italicFrom={3} className="display mt-5 text-[clamp(3rem,6vw,6rem)]" />
          <p className="mt-6 max-w-sm text-white/65">Scroll to travel. Every destination is personally inspected, privately accessed and endlessly customisable.</p>
          <div className="mt-10 hidden items-center gap-4 lg:flex">
            <div className="h-px w-48 bg-white/20"><div ref={bar} className="h-px origin-left scale-x-0 bg-ocean-300" /></div>
            <span className="text-xs uppercase tracking-[0.3em] text-white/50">Scroll</span>
          </div>
        </div>
        {destinations.map((d, i) => (
          <DestCard key={d.slug} d={d} i={i} className="h-[68vh] min-h-[460px] w-[82vw] shrink-0 snap-center sm:w-[60vw] lg:h-[72vh] lg:w-[30vw] lg:max-w-[540px]" />
        ))}
        <div className="flex w-[70vw] shrink-0 items-center lg:w-[24vw]">
          <Btn to="/destinations" variant="light" arrow>All destinations</Btn>
        </div>
      </div>
    </section>
  )
}

/* ---------------- Globe section ---------------- */
export function GlobeSection() {
  const [sel, setSel] = useState('maldives')
  const d = findDest(sel)
  const book = useBookNow()
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950 py-28 text-white">
      <div className="absolute left-1/2 top-1/2 h-[80vw] w-[80vw] max-w-[1100px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ocean-500/10 blur-[120px]" />
      <div className="container-x relative grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <SectionHeading light eyebrow="Interactive atlas" title="Your world, one touch away." italicFrom={3} text="Drag the globe, tap a glowing beacon and watch the route unfold from Paris. Every line is a journey we’ve already perfected." />
          <ul className="mt-10 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-2">
            {destinations.map((x) => (
              <li key={x.slug}>
                <button onClick={() => setSel(x.slug)}
                  className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm transition-all duration-500 ${sel === x.slug ? 'border-ocean-300 bg-ocean-500/20' : 'border-white/10 hover:border-white/30 hover:bg-white/5'}`}>
                  <span className="font-semibold">{x.name}</span><span className="text-xs text-white/50">{x.flight}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative">
          <Globe selected={sel} onSelect={setSel} className="mx-auto aspect-square w-full max-w-[680px]" />
          <AnimatePresence mode="wait">
            <motion.div key={sel} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.6, ease }}
              className="glass-dark mx-auto -mt-6 flex max-w-md items-center gap-5 rounded-3xl p-4 shadow-card lg:absolute lg:bottom-2 lg:right-0 lg:mt-0">
              <img src={img(d.image, 300)} alt="" className="h-24 w-24 rounded-2xl object-cover" />
              <div className="min-w-0 flex-1">
                <p className="eyebrow !text-ocean-300">{d.country}</p>
                <h3 className="display text-3xl">{d.name}</h3>
                <p className="mt-1 text-xs text-white/60">Paris → {d.name} · {d.flight} · {d.temp}</p>
                <div className="mt-3 flex gap-2">
                  <Link to={`/destinations/${d.slug}`} className="rounded-full border border-white/30 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider transition hover:bg-white hover:text-navy-900">Explore</Link>
                  <button onClick={() => book({ dest: d.slug })} className="rounded-full bg-ocean-500 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider transition hover:bg-ocean-400">Book</button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

/* ---------------- Offers ---------------- */
function endOfWeek() {
  const d = new Date(); d.setDate(d.getDate() + ((7 - d.getDay()) % 7)); d.setHours(23, 59, 59, 0); return d
}
export function Countdown() {
  const end = useMemo(endOfWeek, [])
  const [left, setLeft] = useState(() => end - Date.now())
  useEffect(() => { const t = setInterval(() => setLeft(Math.max(0, end - Date.now())), 1000); return () => clearInterval(t) }, [end])
  const s = Math.floor(left / 1000)
  const parts = [['Days', Math.floor(s / 86400)], ['Hours', Math.floor(s / 3600) % 24], ['Min', Math.floor(s / 60) % 60], ['Sec', s % 60]]
  return (
    <div className="flex gap-3" role="timer" aria-label="Offer ends in">
      {parts.map(([l, v]) => (
        <div key={l} className="glass-dark grid h-20 w-[4.5rem] place-items-center rounded-2xl text-center text-white">
          <div><div className="display text-3xl tabular-nums">{String(v).padStart(2, '0')}</div><div className="text-[9px] uppercase tracking-[0.25em] text-white/50">{l}</div></div>
        </div>
      ))}
    </div>
  )
}

export function OffersSection({ limit, dark = false }) {
  const book = useBookNow()
  const [copied, setCopied] = useState(null)
  const list = limit ? offers.slice(0, limit) : offers
  const copy = (c) => { navigator.clipboard?.writeText(c).catch(() => {}); setCopied(c); setTimeout(() => setCopied(null), 1800) }
  return (
    <section className={`relative py-28 ${dark ? 'bg-navy-950 text-white' : 'bg-sand-100'}`}>
      <div className="container-x">
        <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
          <SectionHeading light={dark} eyebrow="Exclusive offers" title="Limited-time privileges." italicFrom={2} text="Handpicked savings and complimentary upgrades, released quietly and never for long." />
          <div className={`${dark ? '' : 'rounded-3xl bg-navy-900 p-5'}`}>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-ocean-300">Offers end in</p>
            <Countdown />
          </div>
        </div>
        <div className="mt-16 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
          {list.map((o, i) => {
            const d = findDest(o.dest)
            return (
              <Reveal key={o.id} delay={(i % 3) * 0.1}>
                <TiltCard innerClass="overflow-hidden rounded-[2rem] bg-white shadow-card ring-1 ring-navy-900/5">
                  <div className="relative h-72 overflow-hidden">
                    <img src={img(o.image, 900)} alt={o.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 to-transparent" />
                    <span className="absolute left-5 top-5 rounded-full bg-ocean-500 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-glow">−{o.discount}%</span>
                    <span className="absolute bottom-5 left-5 text-white"><span className="eyebrow !text-ocean-300">{d.name}</span></span>
                  </div>
                  <div className="p-7 text-navy-900" style={{ transform: 'translateZ(30px)' }}>
                    <h3 className="display text-3xl leading-none">{o.title}</h3>
                    <p className="mt-3 flex items-center gap-2 text-sm text-navy-900/60"><Icon name="check" className="h-4 w-4 text-ocean-500" /> {o.perk} · {o.nights} nights</p>
                    <div className="mt-6 flex items-end justify-between">
                      <div><span className="text-sm text-navy-900/40 line-through">{fmt(o.old)}</span><div className="display text-4xl">{fmt(o.price)}<span className="ml-1 font-sans text-xs text-navy-900/50">/ person</span></div></div>
                      <button onClick={() => copy(o.code)} className="rounded-xl border border-dashed border-navy-900/30 px-3 py-2 font-mono text-xs transition hover:border-ocean-500 hover:text-ocean-600" title="Copy code">
                        {copied === o.code ? 'Copied ✓' : o.code}
                      </button>
                    </div>
                    <Btn variant="primary" className="mt-6 w-full" arrow onClick={() => book({ dest: o.dest })}>Claim this offer</Btn>
                  </div>
                </TiltCard>
              </Reveal>
            )
          })}
        </div>
        {limit && <div className="mt-14 text-center"><Btn to="/offers" variant="outline" arrow>All offers</Btn></div>}
      </div>
    </section>
  )
}

/* ---------------- Packages ---------------- */
export function PackagesSection({ limit, filterable = false, destFilter }) {
  const [cat, setCat] = useState('All')
  const book = useBookNow()
  let list = packages
  if (destFilter) list = list.filter((p) => p.dest === destFilter)
  if (filterable) list = list.filter((p) => cat === 'All' || p.cat === cat)
  if (limit) list = list.slice(0, limit)
  return (
    <section className="py-28">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading eyebrow="Travel packages" title="Journeys, composed for you." italicFrom={2} text="Complete itineraries with flights, stays and signature experiences — each one is a beginning we tailor with you." />
          {filterable && (
            <div className="flex flex-wrap gap-2">{categories.map((c) => <Chip key={c} active={cat === c} onClick={() => setCat(c)}>{c}</Chip>)}</div>
          )}
        </div>
        <motion.div layout className="mt-16 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {list.map((p) => {
              const d = findDest(p.dest)
              return (
                <motion.article key={p.id} layout initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.94 }} transition={{ duration: 0.6, ease }}
                  className="group overflow-hidden rounded-[2rem] bg-white shadow-card ring-1 ring-navy-900/5">
                  <div className="relative h-80 overflow-hidden">
                    <img src={img(p.image, 900)} alt={p.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1400ms] group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-navy-950/20" />
                    <span className="glass absolute left-5 top-5 rounded-full px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white">{p.tag}</span>
                    <span className="absolute right-5 top-5 flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-bold"><Icon name="star" className="h-3.5 w-3.5 text-amber-400" />{p.rating}</span>
                    <div className="absolute bottom-5 left-6 right-6 text-white">
                      <p className="eyebrow !text-ocean-300">{d.name} · {p.days} days · {p.cat}</p>
                      <h3 className="display mt-1 text-3xl">{p.title}</h3>
                    </div>
                  </div>
                  <div className="p-7">
                    <ul className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm text-navy-900/70">
                      {p.includes.map((x) => <li key={x} className="flex items-center gap-2"><Icon name="check" className="h-3.5 w-3.5 shrink-0 text-ocean-500" />{x}</li>)}
                    </ul>
                    <div className="mt-7 flex items-center justify-between border-t border-navy-900/10 pt-6">
                      <div><span className="text-xs text-navy-900/50">From</span><div className="display text-4xl leading-none">{fmt(p.price)}</div></div>
                      <div className="flex gap-2">
                        <Link to={`/destinations/${p.dest}`} className="btn btn-outline !px-5 !py-3">Details</Link>
                        <Btn variant="primary" className="!px-5 !py-3" onClick={() => book({ dest: p.dest, tier: p.cat === 'Luxury' ? 'royal' : 'signature' })}>Book</Btn>
                      </div>
                    </div>
                  </div>
                </motion.article>
              )
            })}
          </AnimatePresence>
        </motion.div>
        {!list.length && <p className="mt-16 text-center text-navy-900/50">No packages here yet — ask our concierge for a bespoke itinerary.</p>}
        {limit && <div className="mt-14 text-center"><Btn to="/packages" variant="outline" arrow>Browse all packages</Btn></div>}
      </div>
    </section>
  )
}

/* ---------------- Hotels ---------------- */
export function HotelsSection({ limit, filterable = false, destFilter, dark = true }) {
  const [f, setF] = useState('all')
  const [sort, setSort] = useState('rating')
  const book = useBookNow()
  let list = hotels.filter((h) => (destFilter ? h.dest === destFilter : f === 'all' || h.dest === f))
  list = [...list].sort((a, b) => (sort === 'rating' ? b.rating - a.rating : sort === 'low' ? a.night - b.night : b.night - a.night))
  if (limit) list = list.slice(0, limit)
  return (
    <section className={`relative py-28 ${dark ? 'bg-navy-900 text-white' : ''}`}>
      <div className="container-x">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading light={dark} eyebrow="Luxury hotels" title="Where you’ll wake up." italicFrom={2} text="Exceptional addresses, personally inspected — villas, riads, chalets and palaces with soul." />
          {filterable && (
            <div className="flex flex-wrap items-center gap-2">
              {['all', ...destinations.map((d) => d.slug)].map((s) => (
                <button key={s} onClick={() => setF(s)} className={`rounded-full border px-4 py-2 text-[11px] font-semibold uppercase capitalize tracking-[0.16em] transition ${f === s ? 'border-white bg-white text-navy-900' : 'border-white/20 text-white/70 hover:border-white/50'}`}>{s}</button>
              ))}
              <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort hotels" className="ml-2 rounded-full border border-white/20 bg-navy-800 px-4 py-2 text-xs text-white outline-none">
                <option value="rating">Top rated</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option>
              </select>
            </div>
          )}
        </div>
        <motion.div layout className="mt-16 grid gap-7 md:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {list.map((h, i) => {
              const d = findDest(h.dest)
              return (
                <motion.div key={h.id} layout initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.7, ease }}>
                  <TiltCard max={5} innerClass="overflow-hidden rounded-[2rem] bg-navy-800 ring-1 ring-white/10">
                    <ParallaxImg src={img(h.image, 1100)} alt={h.name} className="h-[26rem]" speed={0.07}>
                      <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/10 to-transparent" />
                      <div className="absolute right-5 top-5 rounded-2xl bg-white px-3 py-2 text-center text-navy-900"><div className="text-lg font-bold leading-none">{h.rating}</div><div className="text-[9px] uppercase tracking-wider text-navy-900/50">Superb</div></div>
                      <div className="absolute bottom-6 left-7 right-7 text-white">
                        <div className="flex items-center gap-2"><Stars n={h.stars} /><span className="eyebrow !text-ocean-300">{d.name}</span></div>
                        <h3 className="display mt-2 text-4xl">{h.name}</h3>
                      </div>
                    </ParallaxImg>
                    <div className="flex flex-col gap-5 p-7 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="max-w-sm text-sm text-white/65">{h.blurb}</p>
                        <div className="mt-4 flex flex-wrap gap-2">{h.amenities.map((a) => <span key={a} className="rounded-full border border-white/15 px-3 py-1 text-[11px] text-white/70">{a}</span>)}</div>
                      </div>
                      <div className="shrink-0 sm:text-right">
                        <div className="display text-4xl">{fmt(h.night)}<span className="ml-1 font-sans text-xs text-white/50">/ night</span></div>
                        <Btn variant="light" className="mt-3 !px-6 !py-3" onClick={() => book({ dest: h.dest, hotel: h.id, tier: 'royal' })}>Reserve</Btn>
                      </div>
                    </div>
                  </TiltCard>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </motion.div>
        {limit && <div className="mt-14 text-center"><Btn to="/hotels" variant="ghost" arrow>Explore all hotels</Btn></div>}
      </div>
    </section>
  )
}

/* ---------------- Why us ---------------- */
export function WhyUs() {
  return (
    <section className="relative overflow-hidden py-28">
      <div className="container-x">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Why Azura" title="Travel, without compromise." italicFrom={2} text="We are a small team of obsessive travellers. Eighteen years on, the same promise: you’ll never feel like a booking number." />
            <div className="mt-12 grid gap-5 sm:grid-cols-2">
              {features.map((f, i) => (
                <Reveal key={f.title} delay={i * 0.1}>
                  <div className="group h-full rounded-3xl border border-navy-900/10 bg-white p-7 transition-all duration-500 hover:-translate-y-2 hover:border-ocean-500/40 hover:shadow-glow">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-navy-900 text-white transition-colors duration-500 group-hover:bg-ocean-500"><Icon name={f.icon} /></span>
                    <h3 className="display mt-5 text-3xl">{f.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-navy-900/65">{f.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
          <div className="relative">
            <ParallaxImg src={img('1507525428034-b723cf961d3e', 1200)} alt="Tropical beach" className="aspect-[4/5] rounded-[2.5rem] shadow-card" speed={0.1} />
            <div className="glass-dark absolute -bottom-8 -left-4 hidden rounded-3xl p-6 text-white sm:block lg:-left-10">
              <div className="display text-6xl text-ocean-300"><Counter to={98} suffix="%" /></div>
              <p className="mt-1 max-w-[12rem] text-sm text-white/70">of guests call their journey “better than imagined”.</p>
            </div>
          </div>
        </div>
        <div className="mt-28 grid grid-cols-2 gap-y-12 border-y border-navy-900/10 py-14 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="display text-[clamp(3rem,6vw,5.5rem)] text-navy-900"><Counter to={s.n} suffix={s.suffix} /></div>
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.25em] text-navy-900/50">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------------- Experiences ---------------- */
export function ExperiencesSection({ limit }) {
  const [active, setActive] = useState(0)
  const list = limit ? experiences.slice(0, limit) : experiences
  const desktop = useMedia('(min-width: 1024px)')
  const book = useBookNow()
  return (
    <section className="bg-sand-100 py-28">
      <div className="container-x">
        <SectionHeading eyebrow="Signature experiences" title="Moments you’ll retell for decades." italicFrom={3} text="Rare, private and unforgettable — the things that happen only when the right people open the right doors." />
        <div className="mt-16 flex flex-col gap-4 lg:h-[34rem] lg:flex-row">
          {list.map((e, i) => (
            <motion.article
              key={e.id} onMouseEnter={() => setActive(i)} onClick={() => setActive(i)} data-cursor="Explore"
              animate={desktop ? { flexGrow: active === i ? 4.5 : 1 } : {}} transition={{ duration: 0.9, ease }}
              className="group relative min-h-[22rem] flex-1 cursor-pointer overflow-hidden rounded-[2rem] bg-navy-900 lg:min-h-0 lg:basis-0"
            >
              <img src={img(e.image, 1000)} alt={e.title} loading="lazy" className={`absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ${active === i ? 'scale-105' : 'scale-125'}`} />
              <div className={`absolute inset-0 transition-all duration-700 ${active === i ? 'bg-gradient-to-t from-navy-950/90 via-navy-950/10 to-transparent' : 'bg-navy-950/45'}`} />
              <span className="absolute left-6 top-6 font-mono text-xs text-white/80">0{i + 1}</span>
              <div className="absolute inset-x-0 bottom-0 p-7 text-white">
                <p className="eyebrow !text-ocean-300">{e.place}</p>
                <h3 className={`display mt-2 whitespace-normal transition-all duration-700 ${active === i || !desktop ? 'text-4xl' : 'text-2xl lg:[writing-mode:vertical-rl] lg:rotate-180'}`}>{e.title}</h3>
                <AnimatePresence>
                  {(active === i || !desktop) && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.6, delay: 0.15 }}>
                      <p className="mt-3 max-w-md text-sm text-white/75">{e.text}</p>
                      <button onClick={() => book({ dest: destinations.find((d) => d.name === e.place)?.slug || '' })} className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-white hover:text-ocean-300">Enquire <Icon name="arrow" className="h-4 w-4" /></button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.article>
          ))}
        </div>
        {limit && <div className="mt-14 text-center"><Btn to="/experiences" variant="outline" arrow>All experiences</Btn></div>}
      </div>
    </section>
  )
}

/* ---------------- Testimonials ---------------- */
export function TestimonialsSection() {
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  useEffect(() => { if (paused) return; const t = setInterval(() => setI((x) => (x + 1) % testimonials.length), 7000); return () => clearInterval(t) }, [paused])
  const t = testimonials[i]
  const initials = t.name.split(' ').map((w) => w[0]).slice(0, 2).join('')
  return (
    <section className="relative overflow-hidden bg-navy-950 py-32 text-white" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="pointer-events-none absolute -right-40 -top-40 h-[40rem] w-[40rem] rounded-full bg-ocean-500/15 blur-[120px]" />
      <div className="container-x relative">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading light eyebrow="Testimonials" title="Kind words from far away." italicFrom={2} />
          <div className="flex items-center gap-4"><div className="display text-6xl">4.9</div><div><Stars n={5} className="h-4 w-4 text-amber-400" /><p className="mt-1 text-xs text-white/50">from 12,480 verified reviews</p></div></div>
        </div>
        <div className="mt-16 grid items-center gap-12 lg:grid-cols-[1.6fr_1fr]">
          <div className="min-h-[18rem]">
            <span className="display block text-[8rem] leading-[0.5] text-ocean-500/60">“</span>
            <AnimatePresence mode="wait">
              <motion.blockquote key={i} initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, y: -16, filter: 'blur(6px)' }} transition={{ duration: 0.7, ease }}>
                <p className="display text-[clamp(1.8rem,3.4vw,3.2rem)] !leading-[1.15]">{t.text}</p>
                <footer className="mt-8 flex items-center gap-4">
                  <span className="grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-ocean-400 to-navy-700 font-display text-xl">{initials}</span>
                  <div><p className="font-semibold">{t.name}</p><p className="text-sm text-white/55">{t.place}</p></div>
                </footer>
              </motion.blockquote>
            </AnimatePresence>
          </div>
          <div>
            <div className="space-y-3">
              {testimonials.map((x, idx) => (
                <button key={x.name} onClick={() => setI(idx)} className={`relative block w-full overflow-hidden rounded-2xl border px-5 py-4 text-left transition-all duration-500 ${idx === i ? 'border-ocean-300 bg-white/10' : 'border-white/10 hover:bg-white/5'}`}>
                  <span className="block text-sm font-semibold">{x.name}</span><span className="text-xs text-white/50">{x.place}</span>
                  {idx === i && !paused && <motion.span key={`p${i}`} className="absolute bottom-0 left-0 h-0.5 bg-ocean-300" initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 7, ease: 'linear' }} />}
                </button>
              ))}
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={() => setI((i - 1 + testimonials.length) % testimonials.length)} className="grid h-12 w-12 place-items-center rounded-full border border-white/25 transition hover:bg-white hover:text-navy-900" aria-label="Previous"><Icon name="left" /></button>
              <button onClick={() => setI((i + 1) % testimonials.length)} className="grid h-12 w-12 place-items-center rounded-full border border-white/25 transition hover:bg-white hover:text-navy-900" aria-label="Next"><Icon name="right" /></button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------------- Newsletter ---------------- */
export function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [err, setErr] = useState('')
  const [done, setDone] = useState(false)
  const submit = (e) => {
    e.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(email)) { setErr('Please enter a valid email address.'); return }
    setErr(''); setDone(true)
  }
  return (
    <section className="relative overflow-hidden py-32">
      <ParallaxImg src={img('1551918120-9739cb430c6d', 1800)} className="!absolute inset-0 opacity-100" speed={0.1}>
        <div className="absolute inset-0 bg-navy-950/75" />
      </ParallaxImg>
      <div className="container-x relative text-center text-white">
        <p className="eyebrow !text-ocean-300">The Azura letter</p>
        <SplitWords text="Get inspired before you pack." italicFrom={3} className="display mx-auto mt-5 max-w-4xl text-[clamp(2.8rem,6vw,5.8rem)]" />
        <p className="mx-auto mt-6 max-w-lg text-white/70">One beautifully written letter a month — hidden gems, private offers and first access to new journeys.</p>
        <AnimatePresence mode="wait">
          {done ? (
            <motion.div key="ok" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mx-auto mt-10 inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-navy-900">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-ocean-500 text-white"><Icon name="check" className="h-4 w-4" /></span> Welcome aboard — your first letter is on its way.
            </motion.div>
          ) : (
            <motion.form key="form" onSubmit={submit} exit={{ opacity: 0 }} noValidate className="mx-auto mt-10 max-w-xl">
              <div className="glass flex rounded-full p-1.5">
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Your email address" aria-label="Email address" className="min-w-0 flex-1 bg-transparent px-6 text-white outline-none placeholder:text-white/50" />
                <Btn type="submit" variant="primary" arrow>Subscribe</Btn>
              </div>
              {err && <p className="mt-3 text-sm text-red-300" role="alert">{err}</p>}
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

/* ---------------- Contact ---------------- */
export function ContactSection({ compact = false }) {
  const [v, setV] = useState({ name: '', email: '', topic: 'Plan a journey', msg: '' })
  const [errs, setErrs] = useState({})
  const [sent, setSent] = useState(false)
  const set = (k) => (e) => setV({ ...v, [k]: e.target.value })
  const submit = (e) => {
    e.preventDefault()
    const er = {}
    if (v.name.trim().length < 2) er.name = 'Please tell us your name.'
    if (!/^\S+@\S+\.\S+$/.test(v.email)) er.email = 'A valid email is required.'
    if (v.msg.trim().length < 10) er.msg = 'Tell us a little more (10+ characters).'
    setErrs(er)
    if (!Object.keys(er).length) setSent(true)
  }
  const info = [
    ['phone', 'Call our concierge', '+33 1 84 88 00 24', 'tel:+33184880024'],
    ['mail', 'Write to us', 'concierge@azura-voyages.com', 'mailto:concierge@azura-voyages.com'],
    ['pin', 'Visit the studio', '12 Rue de la Paix, 75002 Paris', 'https://maps.google.com/?q=12+Rue+de+la+Paix+Paris'],
    ['clock', 'Hours', 'Mon–Sat · 9:00–20:00 CET', null],
  ]
  return (
    <section id="contact" className={`py-28 ${compact ? 'bg-sand-100' : ''}`}>
      <div className="container-x grid gap-14 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <SectionHeading eyebrow="Contact" title="Let’s begin your story." italicFrom={2} text="Tell us where your imagination wanders. A destination specialist will reply within two working hours." />
          <ul className="mt-12 space-y-4">
            {info.map(([ic, l, t, href]) => (
              <li key={l}>
                <a href={href || undefined} target={href?.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className={`group flex items-center gap-5 rounded-3xl border border-navy-900/10 bg-white p-5 transition-all duration-500 ${href ? 'hover:-translate-y-1 hover:border-ocean-500/40 hover:shadow-glow' : ''}`}>
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-navy-900 text-white transition group-hover:bg-ocean-500"><Icon name={ic} /></span>
                  <span><span className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-navy-900/45">{l}</span><span className="font-medium">{t}</span></span>
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative rounded-[2.5rem] bg-navy-900 p-8 text-white shadow-card sm:p-12">
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div key="s" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex min-h-[28rem] flex-col items-center justify-center text-center">
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }} className="grid h-20 w-20 place-items-center rounded-full bg-ocean-500"><Icon name="check" className="h-9 w-9" /></motion.span>
                <h3 className="display mt-8 text-5xl">Thank you, {v.name.split(' ')[0]}.</h3>
                <p className="mt-4 max-w-sm text-white/65">Your message is with our concierge team. Expect a personal reply at {v.email} shortly.</p>
                <button onClick={() => { setSent(false); setV({ name: '', email: '', topic: 'Plan a journey', msg: '' }) }} className="mt-8 text-sm font-semibold uppercase tracking-widest text-ocean-300 hover:underline">Send another</button>
              </motion.div>
            ) : (
              <motion.form key="f" onSubmit={submit} noValidate exit={{ opacity: 0 }} className="space-y-5">
                <h3 className="display text-4xl">Send a message</h3>
                {[['name', 'Full name', 'text'], ['email', 'Email address', 'email']].map(([k, ph, type]) => (
                  <div key={k}>
                    <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-white/50" htmlFor={`c-${k}`}>{ph}</label>
                    <input id={`c-${k}`} type={type} value={v[k]} onChange={set(k)} className={`field !bg-white/5 !text-white !border-white/15 placeholder:!text-white/30 ${errs[k] ? 'field-error' : ''}`} placeholder={ph} />
                    {errs[k] && <p className="mt-1.5 text-sm text-red-300" role="alert">{errs[k]}</p>}
                  </div>
                ))}
                <div>
                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-white/50" htmlFor="c-topic">I’d like to</label>
                  <select id="c-topic" value={v.topic} onChange={set('topic')} className="field !bg-navy-800 !text-white !border-white/15">
                    {['Plan a journey', 'Customise a package', 'Group or corporate travel', 'Existing booking', 'Press & partnerships'].map((o) => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-white/50" htmlFor="c-msg">Your message</label>
                  <textarea id="c-msg" rows={5} value={v.msg} onChange={set('msg')} className={`field !bg-white/5 !text-white !border-white/15 placeholder:!text-white/30 ${errs.msg ? 'field-error' : ''}`} placeholder="Dates, dreams, celebrations…" />
                  {errs.msg && <p className="mt-1.5 text-sm text-red-300" role="alert">{errs.msg}</p>}
                </div>
                <Btn type="submit" variant="primary" arrow className="w-full">Send message</Btn>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

export function FAQ() {
  const [open, setOpen] = useState(0)
  return (
    <section className="pb-28">
      <div className="container-x max-w-4xl">
        <SectionHeading eyebrow="Good to know" title="Frequently asked." />
        <div className="mt-12 divide-y divide-navy-900/10 border-y border-navy-900/10">
          {faqs.map(([q, a], i) => (
            <div key={q}>
              <button onClick={() => setOpen(open === i ? -1 : i)} className="flex w-full items-center justify-between gap-6 py-6 text-left" aria-expanded={open === i}>
                <span className="display text-2xl sm:text-3xl">{q}</span>
                <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border border-navy-900/20 transition-transform duration-500 ${open === i ? 'rotate-45 bg-navy-900 text-white' : ''}`}><Icon name="plus" className="h-4 w-4" /></span>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.5, ease }} className="overflow-hidden">
                    <p className="max-w-2xl pb-7 text-navy-900/65">{a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function CTABand({ title = 'Ready when you are.', text = 'Tell us your dates and dreams — we’ll handle everything else.' }) {
  return (
    <section className="bg-ocean-500 py-20 text-white">
      <div className="container-x flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
        <div><h2 className="display text-[clamp(2.4rem,5vw,4.4rem)]">{title}</h2><p className="mt-3 max-w-lg text-white/80">{text}</p></div>
        <div className="flex gap-3"><Btn to="/booking" variant="light" arrow>Start booking</Btn><Btn to="/contact" variant="ghost">Talk to us</Btn></div>
      </div>
    </section>
  )
}
