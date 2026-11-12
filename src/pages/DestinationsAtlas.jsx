import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Btn, Icon, Reveal, SectionHeading, SplitWords, ease, useMedia } from '../components/ui'
import { CTABand, useBookNow } from '../components/sections'
import { atlas, atlasBySlug, continents, travelCategories } from '../data/atlas'
import { fmt, img } from '../data/data'

const Earth3D = lazy(() => import('../components/Earth3D'))

const load = (k) => { try { return new Set(JSON.parse(localStorage.getItem(k)) || []) } catch { return new Set() } }
const save = (k, s) => { try { localStorage.setItem(k, JSON.stringify([...s])) } catch {} }

function useSet(key) {
  const [set, setSet] = useState(() => load(key))
  const toggle = (slug) => setSet((p) => { const n = new Set(p); n.has(slug) ? n.delete(slug) : n.add(slug); save(key, n); return n })
  const clear = () => { const n = new Set(); save(key, n); setSet(n) }
  return [set, toggle, clear]
}

const Level = ({ n }) => (
  <span className="font-semibold tracking-wider">{[1, 2, 3, 4].map((i) => <span key={i} className={i <= n ? 'text-ocean-300' : 'text-white/25'}>$</span>)}</span>
)

/* ---------------- loading animation ---------------- */
function Loader({ pct, done }) {
  const C = 2 * Math.PI * 44
  return (
    <AnimatePresence>
      {!done && (
        <motion.div exit={{ opacity: 0 }} transition={{ duration: 0.9 }} className="absolute inset-0 z-30 grid place-items-center bg-navy-950">
          <div className="text-center">
            <div className="relative mx-auto h-28 w-28">
              <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,.12)" strokeWidth="2" />
                <circle cx="50" cy="50" r="44" fill="none" stroke="#67e8f9" strokeWidth="2.5" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - pct)} style={{ transition: 'stroke-dashoffset .4s ease' }} />
              </svg>
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 6, ease: 'linear' }} className="absolute inset-0 grid place-items-center text-ocean-300">
                <Icon name="globe" className="h-9 w-9" stroke={1.3} />
              </motion.div>
            </div>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">Loading Earth</p>
            <p className="mt-1 font-mono text-sm text-ocean-300">{Math.round(pct * 100)}%</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ---------------- info panel ---------------- */
function Panel({ d, fav, inTrip, onFav, onTrip, onClose, onPick, onBook }) {
  const [gi, setGi] = useState(0)
  useEffect(() => setGi(0), [d?.slug])
  useEffect(() => {
    if (!d || d.gallery.length < 2) return
    const t = setInterval(() => setGi((x) => (x + 1) % d.gallery.length), 4500)
    return () => clearInterval(t)
  }, [d])

  if (!d) {
    const picks = atlas.slice(0, 4)
    return (
      <div className="flex h-full flex-col justify-center p-7 text-white">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-ocean-500/20 text-ocean-300"><Icon name="pin" className="h-7 w-7" /></span>
        <h2 className="display mt-6 text-3xl">Discover a destination</h2>
        <p className="mt-3 text-white/65">Drag the Earth, then click a glowing marker to reveal everything about the place — or pick one below.</p>
        <ul className="mt-7 space-y-2">
          {picks.map((p) => (
            <li key={p.slug}>
              <button onClick={() => onPick(p.slug)} className="flex w-full items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-2.5 text-left transition hover:border-ocean-300/60 hover:bg-white/10">
                <img src={img(p.image, 200)} alt="" className="h-12 w-12 rounded-xl object-cover" />
                <span className="flex-1"><span className="block font-semibold">{p.name}</span><span className="text-xs text-white/55">{p.country}</span></span>
                <Icon name="arrow" className="mr-2 h-4 w-4 text-ocean-300" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  const stats = [
    ['calendar', 'Best time', d.best], ['sun', 'Avg. temperature', `${d.temp} · ${d.tempRange}`],
    ['clock', 'Flight from Paris', d.flight], ['tag', 'Estimated budget', null],
  ]
  return (
    <motion.div key={d.slug} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease }} className="text-white">
      <div className="relative h-56 overflow-hidden">
        <AnimatePresence>
          <motion.img key={gi} src={img(d.gallery[gi], 900)} alt={d.name} initial={{ opacity: 0, scale: 1.08 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.1 }} className="absolute inset-0 h-full w-full object-cover" />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/20 to-transparent" />
        <div className="absolute right-4 top-4 flex gap-2">
          <button onClick={onFav} aria-pressed={fav} aria-label={fav ? 'Remove from favorites' : 'Save to favorites'} className={`grid h-10 w-10 place-items-center rounded-full backdrop-blur-md transition ${fav ? 'bg-amber-400 text-navy-900' : 'bg-navy-900/60 text-white hover:bg-white hover:text-navy-900'}`}>
            <Icon name="heart" fill={fav} className="h-4.5 w-4.5" />
          </button>
          <button onClick={onClose} aria-label="Close" className="grid h-10 w-10 place-items-center rounded-full bg-navy-900/60 backdrop-blur-md transition hover:bg-white hover:text-navy-900"><Icon name="close" className="h-4 w-4" /></button>
        </div>
        {d.gallery.length > 1 && (
          <div className="absolute bottom-3 right-5 flex gap-1.5">{d.gallery.map((_, k) => <button key={k} onClick={() => setGi(k)} aria-label={`Photo ${k + 1}`} className={`h-1 rounded-full transition-all ${k === gi ? 'w-6 bg-white' : 'w-2 bg-white/40'}`} />)}</div>
        )}
        <div className="absolute bottom-3 left-5">
          <p className="eyebrow !text-ocean-300">{d.country} · {d.continent}</p>
          <h2 className="display text-4xl">{d.name}</h2>
        </div>
      </div>

      <div className="space-y-6 p-6">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-ocean-500/20 px-3 py-1 text-xs font-semibold text-ocean-300">{d.tag}</span>
          {d.cats.map((c) => <span key={c} className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/70">{c}</span>)}
        </div>
        <p className="leading-relaxed text-white/75">{d.desc}</p>

        <div className="grid grid-cols-2 gap-3">
          {stats.map(([ic, l, v]) => (
            <div key={l} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/50"><Icon name={ic} className="h-3.5 w-3.5 text-ocean-300" />{l}</p>
              <p className="mt-1.5 text-sm font-medium">{v ?? <><Level n={d.level} /> <span className="block text-xs font-normal text-white/60">{d.budget}</span></>}</p>
            </div>
          ))}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/50">Currency</p><p className="mt-1.5 text-sm font-medium">{d.currency}</p></div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/50">Language</p><p className="mt-1.5 text-sm font-medium">{d.language}</p></div>
        </div>

        <div>
          <h3 className="eyebrow !text-ocean-300">Travel highlights</h3>
          <ul className="mt-3 space-y-2">{d.highlights.map((h) => <li key={h} className="flex items-start gap-3 text-sm text-white/80"><Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-ocean-300" />{h}</li>)}</ul>
        </div>
        <div>
          <h3 className="eyebrow !text-ocean-300">Popular attractions</h3>
          <ol className="mt-3 grid gap-2">{d.attractions.map((a, i) => <li key={a} className="flex items-center gap-3 rounded-xl bg-white/5 px-3.5 py-2.5 text-sm"><span className="font-mono text-xs text-ocean-300">0{i + 1}</span>{a}</li>)}</ol>
        </div>
        <div>
          <h3 className="eyebrow !text-ocean-300">Popular activities</h3>
          <div className="mt-3 flex flex-wrap gap-2">{d.activities.map((a) => <span key={a} className="rounded-full border border-ocean-300/30 bg-ocean-500/10 px-3.5 py-1.5 text-xs text-white/85">{a}</span>)}</div>
        </div>

        <div className="sticky bottom-0 -mx-6 -mb-6 space-y-2.5 border-t border-white/10 bg-navy-900/90 p-5 backdrop-blur-xl">
          <Btn to={`/destinations/${d.slug}`} variant="primary" arrow className="w-full">Explore Destination</Btn>
          <div className="grid grid-cols-2 gap-2.5">
            <button onClick={onTrip} aria-pressed={inTrip} className={`flex items-center justify-center gap-2 rounded-full border px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] transition ${inTrip ? 'border-ocean-300 bg-ocean-500/25 text-white' : 'border-white/25 hover:bg-white hover:text-navy-900'}`}>
              <Icon name={inTrip ? 'check' : 'plus'} className="h-4 w-4" />{inTrip ? 'In my trip' : 'Add to trip'}
            </button>
            <button onClick={onBook} className="rounded-full border border-white/25 px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] transition hover:bg-white hover:text-navy-900">Book now</button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/* ---------------- suggestion card ---------------- */
function AtlasCard({ d, fav, onFav, onPick }) {
  return (
    <motion.article layout initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.7, ease }}
      className="group relative overflow-hidden rounded-3xl bg-navy-900">
      <button onClick={() => onPick(d.slug)} className="block w-full text-left" data-cursor="Globe">
        <div className="relative h-72 overflow-hidden">
          <img src={img(d.image, 800)} alt={d.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5 text-white">
            <p className="eyebrow !text-ocean-300">{d.country}</p>
            <h3 className="display mt-1 text-3xl">{d.name}</h3>
            <div className="mt-3 flex items-center justify-between text-sm text-white/75">
              <span>{d.cats.slice(0, 2).join(' · ')}</span><span>From <b className="text-white">{fmt(d.from)}</b></span>
            </div>
          </div>
        </div>
      </button>
      <button onClick={() => onFav(d.slug)} aria-pressed={fav} aria-label={fav ? 'Remove from favorites' : 'Save to favorites'} className={`absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full backdrop-blur-md transition ${fav ? 'bg-amber-400 text-navy-900' : 'bg-navy-900/60 text-white hover:bg-white hover:text-navy-900'}`}>
        <Icon name="heart" fill={fav} className="h-4 w-4" />
      </button>
    </motion.article>
  )
}

/* ---------------- page ---------------- */
export default function DestinationsAtlas() {
  const [selected, setSelected] = useState(null)
  const [query, setQuery] = useState('')
  const [focus, setFocus] = useState(false)
  const [continent, setContinent] = useState('All')
  const [cat, setCat] = useState('All')
  const [onlySaved, setOnlySaved] = useState(false)
  const [favs, toggleFav] = useSet('azura-favs')
  const [trip, toggleTrip, clearTrip] = useSet('azura-trip')
  const [prog, setProg] = useState({ pct: 0, done: false })
  const lg = useMedia('(min-width: 1024px)')
  const earth = useRef(null)
  const stage = useRef(null)
  const panelRef = useRef(null)
  const book = useBookNow()

  // safety net: never leave the loader up forever (e.g. no WebGL)
  useEffect(() => { const t = setTimeout(() => setProg((p) => ({ ...p, done: true })), 15000); return () => clearTimeout(t) }, [])

  const q = query.trim().toLowerCase()
  const textMatch = (d) => !q || [d.name, d.country, d.continent, d.tag, ...d.cats].join(' ').toLowerCase().includes(q)
  const dimmed = useMemo(() => {
    const s = new Set()
    atlas.forEach((d) => {
      const ok = (continent === 'All' || d.continent === continent) && (cat === 'All' || d.cats.includes(cat)) && (!onlySaved || favs.has(d.slug)) && textMatch(d)
      if (!ok) s.add(d.slug)
    })
    return s
  }, [continent, cat, onlySaved, favs, q]) // eslint-disable-line
  const matching = atlas.filter((d) => !dimmed.has(d.slug))
  const results = q ? atlas.filter(textMatch).slice(0, 6) : []

  const d = selected ? atlasBySlug(selected) : null
  const choose = (slug) => {
    setSelected(slug); setFocus(false)
    if (!lg) setTimeout(() => panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120)
  }
  const fromCards = (slug) => {
    choose(slug)
    if (lg) stage.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
  const clearFilters = () => { setContinent('All'); setCat('All'); setOnlySaved(false); setQuery('') }
  const filtersActive = continent !== 'All' || cat !== 'All' || onlySaved || q

  const suggestions = useMemo(() => {
    const saved = atlas.filter((x) => favs.has(x.slug))
    const base = atlas.filter((x) => !favs.has(x.slug))
    if (!saved.length) return base.slice(0, 4)
    const w = {}; saved.forEach((s) => s.cats.forEach((c) => { w[c] = (w[c] || 0) + 1 }))
    return base.map((x) => ({ x, s: x.cats.reduce((a, c) => a + (w[c] || 0), 0) })).sort((a, b) => b.s - a.s).slice(0, 4).map((o) => o.x)
  }, [favs])
  const tripList = [...trip].map(atlasBySlug).filter(Boolean)

  return (
    <>
      <section className="bg-navy-950 pb-16 pt-32 text-white">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div>
              <p className="eyebrow !text-ocean-300">Interactive atlas</p>
              <SplitWords as="h1" ready text="Explore the world, one marker at a time." italicFrom={4} className="display mt-4 max-w-3xl text-[clamp(2.2rem,5vw,4.4rem)]" />
            </div>
            <div className="flex gap-3 text-sm">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3"><div className="display text-3xl text-ocean-300">{atlas.length}</div><div className="text-xs text-white/55">destinations</div></div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3"><div className="display text-3xl text-amber-300">{favs.size}</div><div className="text-xs text-white/55">saved</div></div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3"><div className="display text-3xl text-ocean-300">{trip.size}</div><div className="text-xs text-white/55">in my trip</div></div>
            </div>
          </div>

          {/* search + filters */}
          <div className="mt-10 space-y-4">
            <div className="relative max-w-2xl">
              <Icon name="search" className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-ocean-300" />
              <input
                value={query} onChange={(e) => setQuery(e.target.value)} onFocus={() => setFocus(true)} onBlur={() => setTimeout(() => setFocus(false), 150)}
                onKeyDown={(e) => { if (e.key === 'Enter' && results[0]) { choose(results[0].slug); setQuery(''); e.currentTarget.blur() } if (e.key === 'Escape') { setQuery(''); e.currentTarget.blur() } }}
                placeholder="Search a destination, country, continent or style…" aria-label="Search destinations"
                className="w-full rounded-full border border-white/15 bg-white/5 py-4 pl-14 pr-12 text-white outline-none backdrop-blur-md transition placeholder:text-white/40 focus:border-ocean-300 focus:bg-white/10"
              />
              {query && <button onClick={() => setQuery('')} aria-label="Clear search" className="absolute right-4 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full hover:bg-white/10"><Icon name="close" className="h-4 w-4" /></button>}
              <AnimatePresence>
                {focus && q && (
                  <motion.ul initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute inset-x-0 top-[calc(100%+8px)] z-40 overflow-hidden rounded-3xl border border-white/15 bg-navy-900/95 p-2 backdrop-blur-2xl">
                    {results.length ? results.map((r) => (
                      <li key={r.slug}>
                        <button onMouseDown={(e) => e.preventDefault()} onClick={() => { choose(r.slug); setQuery('') }} className="flex w-full items-center gap-4 rounded-2xl p-2.5 text-left hover:bg-white/10">
                          <img src={img(r.image, 120)} alt="" className="h-11 w-11 rounded-xl object-cover" />
                          <span className="flex-1"><span className="block font-semibold">{r.name}</span><span className="text-xs text-white/55">{r.country} · {r.continent}</span></span>
                          <span className="text-xs text-ocean-300">View on globe</span>
                        </button>
                      </li>
                    )) : <li className="px-4 py-5 text-sm text-white/60">No destination found. Try “beach”, “Europe” or “Japan”.</li>}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
            <div className="flex flex-col gap-3">
              <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
                {['All', ...continents].map((c) => <FilterChip key={c} active={continent === c} onClick={() => setContinent(c)}>{c}</FilterChip>)}
              </div>
              <div className="no-scrollbar flex items-center gap-2 overflow-x-auto pb-1">
                {['All', ...travelCategories].map((c) => <FilterChip key={c} active={cat === c} onClick={() => setCat(c)} alt>{c}</FilterChip>)}
                <span className="mx-1 h-5 w-px shrink-0 bg-white/15" />
                <FilterChip active={onlySaved} onClick={() => setOnlySaved((v) => !v)} gold><Icon name="heart" fill={onlySaved} className="mr-1.5 inline h-3.5 w-3.5" />Saved ({favs.size})</FilterChip>
                {filtersActive && <button onClick={clearFilters} className="shrink-0 px-3 text-xs font-semibold uppercase tracking-widest text-ocean-300 hover:underline">Reset</button>}
              </div>
            </div>
          </div>

          {/* the globe */}
          <div className="relative mt-8">
            <div ref={stage} className="relative h-[62vh] min-h-[460px] overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(ellipse_at_50%_40%,#0e2a5c_0%,#07142f_55%,#030a1a_100%)] lg:h-[82vh] lg:max-h-[860px]">
              <Suspense fallback={null}>
                <Earth3D
                  ref={earth} places={atlas} selected={selected} favorites={favs} dimmed={dimmed} shift={lg ? 210 : 0} className="absolute inset-0"
                  onSelect={choose} onProgress={(pct, done) => setProg((p) => ({ pct: Math.max(p.pct, pct), done: p.done || done }))}
                />
              </Suspense>
              <Loader pct={prog.pct} done={prog.done} />

              <div className="pointer-events-none absolute left-4 top-4 z-10 hidden rounded-full border border-white/15 bg-navy-900/60 px-4 py-2 text-xs text-white/75 backdrop-blur-md sm:block">
                Drag to rotate · Scroll or pinch to zoom · Click a marker
              </div>
              <div className="absolute bottom-4 left-4 z-10 flex flex-col gap-1.5 rounded-2xl border border-white/10 bg-navy-900/60 p-3 text-[11px] text-white/70 backdrop-blur-md">
                <span className="flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full bg-teal-400" />Destination</span>
                <span className="flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full bg-amber-400" />Saved</span>
                {filtersActive && <span className="flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full bg-slate-500" />Filtered out · {matching.length} shown</span>}
              </div>
              <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-2 lg:right-[452px]">
                {[['plus', 'Zoom in', () => earth.current?.zoom(0.72)], ['minus', 'Zoom out', () => earth.current?.zoom(1.4)], ['globe', 'Reset view', () => { setSelected(null); earth.current?.reset() }]].map(([ic, l, fn]) => (
                  <button key={l} onClick={fn} aria-label={l} title={l} className="grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-navy-900/70 text-white backdrop-blur-md transition hover:bg-white hover:text-navy-900"><Icon name={ic} className="h-5 w-5" /></button>
                ))}
              </div>
              {!matching.length && prog.done && (
                <div className="absolute inset-x-0 top-1/2 z-10 mx-auto w-fit -translate-y-1/2 rounded-2xl border border-white/15 bg-navy-900/80 px-6 py-4 text-sm text-white backdrop-blur-md">No destinations match your filters.</div>
              )}
            </div>

            <div ref={panelRef} className="mt-4 max-h-none scroll-mt-24 overflow-y-auto rounded-3xl border border-white/15 bg-navy-900/80 backdrop-blur-2xl lg:absolute lg:inset-y-4 lg:right-4 lg:mt-0 lg:w-[420px] lg:bg-navy-900/70 lg:max-h-[calc(100%-2rem)]">
              <Panel
                d={d} fav={d && favs.has(d.slug)} inTrip={d && trip.has(d.slug)}
                onFav={() => toggleFav(d.slug)} onTrip={() => toggleTrip(d.slug)} onClose={() => setSelected(null)} onPick={choose}
                onBook={() => book({ dest: d.slug })}
              />
            </div>
          </div>

          {/* trip tray */}
          <AnimatePresence>
            {tripList.length > 0 && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <div className="mt-5 flex flex-col gap-4 rounded-3xl border border-ocean-300/30 bg-ocean-500/10 p-5 backdrop-blur-xl md:flex-row md:items-center">
                  <div className="flex-1">
                    <p className="eyebrow !text-ocean-300">My multi-destination trip · {tripList.length} stop{tripList.length > 1 ? 's' : ''}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {tripList.map((t, i) => (
                        <span key={t.slug} className="flex items-center gap-2 rounded-full bg-white/10 py-1.5 pl-3 pr-1.5 text-sm">
                          <span className="font-mono text-xs text-ocean-300">{i + 1}</span>
                          <button onClick={() => choose(t.slug)} className="hover:underline">{t.name}</button>
                          <button onClick={() => toggleTrip(t.slug)} aria-label={`Remove ${t.name}`} className="grid h-6 w-6 place-items-center rounded-full hover:bg-white/20"><Icon name="close" className="h-3 w-3" /></button>
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right text-sm text-white/70">Packages from<div className="display text-3xl text-white">{fmt(tripList.reduce((s, t) => s + t.from, 0))}</div></div>
                  <div className="flex gap-2">
                    <Btn variant="primary" arrow onClick={() => book({ dest: tripList[0].slug })}>Plan this trip</Btn>
                    <Btn variant="ghost" onClick={clearTrip}>Clear</Btn>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <section className="py-24">
        <div className="container-x">
          <SectionHeading eyebrow={favs.size ? 'Picked for you' : 'Suggested destinations'} title={favs.size ? 'Because you saved a few favorites.' : 'Where to next?'} italicFrom={2} text="Tap any card to fly the globe straight to it." />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {suggestions.map((s) => <AtlasCard key={s.slug} d={s} fav={favs.has(s.slug)} onFav={toggleFav} onPick={fromCards} />)}
          </div>

          <div className="mt-24 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <h2 className="display text-4xl sm:text-5xl">{filtersActive ? `${matching.length} matching destination${matching.length === 1 ? '' : 's'}` : 'All destinations'}</h2>
            {filtersActive && <button onClick={clearFilters} className="text-sm font-semibold uppercase tracking-widest text-ocean-600 hover:underline">Clear filters</button>}
          </div>
          <motion.div layout className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <AnimatePresence mode="popLayout">
              {matching.map((m) => <AtlasCard key={m.slug} d={m} fav={favs.has(m.slug)} onFav={toggleFav} onPick={fromCards} />)}
            </AnimatePresence>
          </motion.div>
          {!matching.length && <p className="mt-10 text-navy-900/60">Nothing matches those filters — try resetting them.</p>}
        </div>
      </section>
      <CTABand title="Can’t decide? Let us design it." text="Tell us what you love and a specialist will compose your route across the map." />
    </>
  )
}

function FilterChip({ active, onClick, children, alt, gold }) {
  return (
    <button onClick={onClick} aria-pressed={active}
      className={`shrink-0 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition-all duration-300 ${
        active ? (gold ? 'border-amber-400 bg-amber-400 text-navy-900' : alt ? 'border-teal-300 bg-teal-400/90 text-navy-950' : 'border-white bg-white text-navy-900') : 'border-white/20 text-white/70 hover:border-white/50 hover:text-white'
      }`}>
      {children}
    </button>
  )
}
