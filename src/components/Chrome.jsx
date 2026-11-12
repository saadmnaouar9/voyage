import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import gsap from 'gsap'
import { Btn, Icon, Magnetic, ease } from './ui'
import { nav } from '../data/data'

/* ---------- Logo ---------- */
// The supplied logo (public/logo.png) is cropped to its artwork with CSS and shown on a white chip.
export const Logo = ({ size = 'h-14 sm:h-20' }) => (
  <Link to="/" aria-label="Azura Voyages — home" className="block transition-transform duration-500 hover:scale-105">
    <span className={`relative block ${size} aspect-[1380/800] overflow-hidden`}>
      <img
        src="/logo-white.png" alt="Azura Voyages"
        className="absolute max-w-none"
        style={{ width: '104.35%', left: '-2.17%', top: '-16.25%' }}
      />
    </span>
  </Link>
)

/* ---------- Loader ---------- */
export function Loader({ onDone }) {
  const root = useRef(null)
  const count = useRef(null)
  const bar = useRef(null)

  useEffect(() => {
    document.documentElement.style.overflow = 'hidden'
    const ctx = gsap.context(() => {
      const o = { v: 0 }
      const tl = gsap.timeline({
        onComplete: () => { document.documentElement.style.overflow = ''; onDone() },
      })
      tl.from('.ld-word', { yPercent: 120, duration: 1, stagger: 0.12, ease: 'expo.out' })
        .from('.ld-plane', { x: -80, opacity: 0, duration: 1, ease: 'expo.out' }, 0.2)
        .to(o, { v: 100, duration: 1.7, ease: 'power2.inOut', onUpdate: () => {
          if (count.current) count.current.textContent = String(Math.round(o.v)).padStart(3, '0')
        } }, 0.2)
        .to(bar.current, { scaleX: 1, duration: 1.7, ease: 'power2.inOut' }, 0.2)
        .to('.ld-plane', { x: '38vw', duration: 1.7, ease: 'power2.inOut' }, 0.2)
        .to('.ld-inner', { opacity: 0, y: -30, duration: 0.5, ease: 'power2.in' }, '+=0.15')
        .to(root.current, { yPercent: -100, duration: 1, ease: 'expo.inOut' }, '-=0.1')
    }, root)
    return () => { ctx.revert(); document.documentElement.style.overflow = '' }
  }, [onDone])

  return (
    <div ref={root} className="fixed inset-0 z-[200] grid place-items-center bg-navy-950 text-white" role="status" aria-label="Loading">
      <div className="ld-inner flex w-[min(520px,82vw)] flex-col items-center">
        <div className="relative mb-10 h-10 w-full">
          <Icon name="plane" className="ld-plane absolute left-0 top-0 h-8 w-8 rotate-90 text-ocean-300" />
        </div>
        <div className="overflow-hidden"><div className="ld-word display text-[clamp(3.5rem,11vw,7rem)] !leading-[1.05]">Azura</div></div>
        <div className="overflow-hidden"><div className="ld-word -mt-1 text-[12px] font-semibold uppercase tracking-[0.55em] text-ocean-300">Voyages</div></div>
        <div className="mt-14 flex w-full items-center gap-5">
          <div className="h-px flex-1 bg-white/15"><div ref={bar} className="h-px origin-left scale-x-0 bg-ocean-300" /></div>
          <span ref={count} className="w-9 text-right font-mono text-xs tabular-nums text-white/60">000</span>
        </div>
      </div>
    </div>
  )
}

/* ---------- Cursor ---------- */
export function Cursor() {
  const dot = useRef(null)
  const ring = useRef(null)
  const [label, setLabel] = useState('')
  const [hover, setHover] = useState(false)

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    document.body.classList.add('has-cursor')
    const pos = { x: -100, y: -100 }
    const rp = { x: -100, y: -100 }
    const mv = (e) => {
      pos.x = e.clientX; pos.y = e.clientY
      const t = e.target.closest?.('a,button,[data-cursor],input,select,textarea,label')
      setHover(!!t)
      setLabel(e.target.closest?.('[data-cursor]')?.getAttribute('data-cursor') || '')
    }
    const tick = () => {
      rp.x += (pos.x - rp.x) * 0.16; rp.y += (pos.y - rp.y) * 0.16
      if (dot.current) dot.current.style.transform = `translate3d(${pos.x}px,${pos.y}px,0)`
      if (ring.current) ring.current.style.transform = `translate3d(${rp.x}px,${rp.y}px,0)`
    }
    window.addEventListener('pointermove', mv)
    gsap.ticker.add(tick)
    return () => { window.removeEventListener('pointermove', mv); gsap.ticker.remove(tick); document.body.classList.remove('has-cursor') }
  }, [])

  return (
    <div className="pointer-events-none fixed left-0 top-0 z-[300] hidden [@media(hover:hover)_and_(pointer:fine)]:block" aria-hidden>
      <div ref={dot} className="fixed left-0 top-0"><div className="-ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full bg-white mix-blend-difference" /></div>
      <div ref={ring} className="fixed left-0 top-0">
        <div className={`-ml-5 -mt-5 grid h-10 w-10 place-items-center rounded-full border text-[10px] font-semibold uppercase tracking-widest transition-all duration-300 ${
          label ? 'scale-[2] border-transparent bg-white text-navy-900' : hover ? 'scale-[1.7] border-white/80 bg-white/10 mix-blend-difference' : 'border-white/60 mix-blend-difference'
        }`}>{label}</div>
      </div>
    </div>
  )
}

/* ---------- Navbar ---------- */
export function Navbar() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const [solid, setSolid] = useState(false)
  const [hidden, setHidden] = useState(false)
  const { scrollY } = useScroll()
  const last = useRef(0)

  useMotionValueEvent(scrollY, 'change', (y) => {
    setSolid(y > 60)
    setHidden(y > 500 && y > last.current + 4 && !open ? true : y < last.current - 4 ? false : hidden)
    last.current = y
  })
  useEffect(() => setOpen(false), [pathname])
  useEffect(() => { document.documentElement.classList.toggle('lenis-stopped', open) }, [open])

  return (
    <>
      <motion.header
        animate={{ y: hidden ? '-110%' : 0 }}
        transition={{ duration: 0.6, ease }}
        className={`fixed inset-x-0 top-0 z-[70] transition-[background,padding] duration-500 ${solid ? 'glass-dark py-3.5' : 'py-6'}`}
      >
        <div className="container-x flex items-center justify-between">
          <Logo />
          <nav className="hidden items-center gap-1 xl:flex" aria-label="Primary">
            {nav.slice(1, 7).map((n) => (
              <NavLink key={n.to} to={n.to} className="relative px-4 py-2 text-[12.5px] font-semibold uppercase tracking-[0.16em] text-white/80 transition-colors hover:text-white">
                {({ isActive }) => (
                  <>
                    {n.label}
                    {isActive && <motion.span layoutId="nav-underline" className="absolute inset-x-4 -bottom-0.5 h-px bg-ocean-300" transition={{ duration: 0.5, ease }} />}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <Magnetic><Btn to="/booking" variant="light" className="!px-6 !py-3">Book now</Btn></Magnetic>
            </div>
            <button
              onClick={() => setOpen((o) => !o)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}
              className="grid h-11 w-11 place-items-center rounded-full border border-white/30 text-white transition hover:bg-white hover:text-navy-900"
            >
              <Icon name={open ? 'close' : 'menu'} />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: 'circle(0% at calc(100% - 3rem) 2.5rem)' }}
            animate={{ clipPath: 'circle(150% at calc(100% - 3rem) 2.5rem)' }}
            exit={{ clipPath: 'circle(0% at calc(100% - 3rem) 2.5rem)' }}
            transition={{ duration: 0.9, ease }}
            className="fixed inset-0 z-[65] overflow-y-auto bg-navy-950 text-white"
          >
            <div className="container-x grid min-h-full gap-12 pb-12 pt-32 lg:grid-cols-[1.4fr_1fr]">
              <ul className="flex flex-col">
                {nav.map((n, i) => (
                  <li key={n.to} className="overflow-hidden border-b border-white/10">
                    <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} transition={{ delay: 0.25 + i * 0.05, duration: 0.9, ease }}>
                      <Link to={n.to} className="group flex items-baseline gap-5 py-3.5">
                        <span className="w-8 font-mono text-xs text-ocean-300">0{i + 1}</span>
                        <span className="display text-[clamp(2.2rem,5.5vw,4.4rem)] transition-all duration-500 group-hover:translate-x-4 group-hover:italic group-hover:text-ocean-300">{n.label}</span>
                      </Link>
                    </motion.div>
                  </li>
                ))}
              </ul>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="flex flex-col justify-end gap-8 text-white/70">
                <div>
                  <p className="eyebrow !text-ocean-300">Concierge</p>
                  <p className="display mt-3 text-4xl text-white">+33 1 84 88 00 24</p>
                  <p className="mt-1">concierge@azura-voyages.com</p>
                </div>
                <div>
                  <p className="eyebrow !text-ocean-300">Studio</p>
                  <p className="mt-3">12 Rue de la Paix<br />75002 Paris, France</p>
                </div>
                <Btn to="/booking" variant="primary" arrow className="self-start">Plan my journey</Btn>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

/* ---------- Footer ---------- */
export function Footer() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)
  return (
    <footer className="relative overflow-hidden bg-navy-950 pt-24 text-white">
      <div className="container-x">
        <div className="grid gap-16 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
          <div>
            <Logo size="h-28" />
            <p className="mt-6 max-w-sm leading-relaxed text-white/60">
              Bespoke journeys to the world’s most extraordinary places — crafted with obsession, delivered with grace.
            </p>
            <div className="mt-8 flex gap-3">
              {['instagram', 'facebook', 'x', 'youtube'].map((s) => (
                <a key={s} href="#" onClick={(e) => e.preventDefault()} aria-label={s}
                  className="grid h-11 w-11 place-items-center rounded-full border border-white/20 transition hover:border-ocean-300 hover:bg-ocean-500">
                  <Icon name={s} className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="eyebrow !text-ocean-300">Explore</h4>
            <ul className="mt-6 space-y-3 text-white/70">
              {nav.slice(1).map((n) => <li key={n.to}><Link className="transition hover:text-white hover:underline" to={n.to}>{n.label}</Link></li>)}
            </ul>
          </div>
          <div>
            <h4 className="eyebrow !text-ocean-300">Destinations</h4>
            <ul className="mt-6 space-y-3 text-white/70">
              {['maldives', 'bali', 'dubai', 'switzerland', 'turkey', 'thailand', 'morocco'].map((s) => (
                <li key={s}><Link className="capitalize transition hover:text-white hover:underline" to={`/destinations/${s}`}>{s}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="eyebrow !text-ocean-300">Travel notes</h4>
            <p className="mt-6 text-white/60">One thoughtful letter a month. No noise.</p>
            {done ? (
              <p className="mt-5 flex items-center gap-2 text-ocean-300"><Icon name="check" /> Welcome aboard — check your inbox.</p>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); if (/\S+@\S+\.\S+/.test(email)) setDone(true) }} className="mt-5 flex overflow-hidden rounded-full border border-white/20 focus-within:border-ocean-300">
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="Your email" aria-label="Email"
                  className="min-w-0 flex-1 bg-transparent px-5 py-3.5 text-sm outline-none placeholder:text-white/40" />
                <button className="grid w-14 place-items-center bg-ocean-500 transition hover:bg-ocean-400" aria-label="Subscribe"><Icon name="arrow" className="h-4 w-4" /></button>
              </form>
            )}
          </div>
        </div>
        <div className="select-none pt-20 text-center font-display text-[clamp(5rem,23vw,20rem)] font-light leading-[0.78] tracking-tight text-white/[0.06]">AZURA</div>
        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/10 py-8 text-xs text-white/45 sm:flex-row">
          <p>© {new Date().getFullYear()} Azura Voyages. All rights reserved. IATA-accredited · Atout France IM075230014</p>
          <p>Privacy · Terms · Cookies</p>
        </div>
      </div>
    </footer>
  )
}
