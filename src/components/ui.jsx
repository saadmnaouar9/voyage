import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  animate, motion, useInView, useMotionTemplate, useMotionValue, useScroll, useSpring, useTransform,
} from 'framer-motion'

export const ease = [0.22, 1, 0.36, 1]

/* ---------- Ready (set once the loading screen has left) ---------- */
export const ReadyContext = createContext(true)
export const useReady = () => useContext(ReadyContext)

/* ---------- media query hook ---------- */
export function useMedia(query) {
  const [m, setM] = useState(() => (typeof window !== 'undefined' ? window.matchMedia(query).matches : false))
  useEffect(() => {
    const mq = window.matchMedia(query)
    const h = () => setM(mq.matches)
    h()
    mq.addEventListener('change', h)
    return () => mq.removeEventListener('change', h)
  }, [query])
  return m
}

/* ---------- Icons ---------- */
const paths = {
  arrow: 'M5 12h14M13 6l6 6-6 6',
  arrowUp: 'M7 17 17 7M8 7h9v9',
  search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14ZM21 21l-4.3-4.3',
  calendar: 'M7 3v3M17 3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21c0-4 3.6-6 8-6s8 2 8 6',
  pin: 'M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21ZM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z',
  plane: 'M21 15.5 13 11V4.5a1.5 1.5 0 0 0-3 0V11l-8 4.5V18l8-2v3l-2 1.5V24l3.5-1 3.5 1v-1.5L13 19v-3l8 2Z',
  check: 'M5 12.5 10 17.5 19 7',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  menu: 'M4 8h16M4 16h16',
  close: 'M6 6l12 12M18 6 6 18',
  compass: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM15.5 8.5 13.5 13.5 8.5 15.5 10.5 10.5Z',
  key: 'M14.5 9.5a4 4 0 1 1-1.2-2.8L21 14.5V18h-3v-2h-2v-2h-2l-1.7-1.7',
  chat: 'M4 5h16v11H9l-5 4Z',
  shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3ZM8.5 12l2.5 2.5L16 9.5',
  mail: 'M4 6h16v12H4zM4 7l8 6 8-6',
  phone: 'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2Z',
  chevron: 'M6 9l6 6 6-6',
  left: 'M15 6l-6 6 6 6',
  right: 'M9 6l6 6-6 6',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 7v5l3 2',
  globe: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18',
  heart: 'M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10Z',
  sun: 'M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.4 1.4M17.6 17.6 19 19M5 19l1.4-1.4M17.6 6.4 19 5',
  tag: 'M3 12V4h8l10 10-8 8L3 12ZM7.5 8.5h.01',
  bed: 'M3 18V6M3 14h18v4M21 14v-2a3 3 0 0 0-3-3h-7v5M7 11.5a1.5 1.5 0 1 0 0-.01',
  instagram: 'M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4ZM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM17.5 6.5h.01',
  facebook: 'M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8.5a.5.5 0 0 1 .5-.5Z',
  x: 'M4 4l16 16M20 4 4 20',
  youtube: 'M3 8a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V8ZM10 9l5 3-5 3V9Z',
}

export function Icon({ name, className = 'h-5 w-5', fill = false, stroke = 1.6 }) {
  if (name === 'star')
    return (
      <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
        <path d="m12 2.5 2.9 6.2 6.6.8-4.9 4.6 1.3 6.6L12 17.4l-5.9 3.3 1.3-6.6L2.5 9.5l6.6-.8L12 2.5Z" />
      </svg>
    )
  return (
    <svg viewBox="0 0 24 24" className={className} fill={fill ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={paths[name] || ''} />
    </svg>
  )
}

export const Stars = ({ n = 5, className = 'h-3.5 w-3.5 text-amber-400' }) => (
  <span className="inline-flex gap-0.5">
    {Array.from({ length: n }).map((_, i) => <Icon key={i} name="star" className={className} />)}
  </span>
)

/* ---------- Animated text ---------- */
export function SplitWords({ text, className = '', delay = 0, stagger = 0.07, as: Tag = 'h2', ready, italicFrom }) {
  const words = text.split(' ')
  const MotionTag = motion[Tag]
  // The trigger lives on the (unclipped) parent; words animate through variants.
  const trigger =
    ready === undefined
      ? { initial: 'hidden', whileInView: 'show', viewport: { once: true, amount: 0.4 } }
      : { initial: 'hidden', animate: ready ? 'show' : 'hidden' }
  return (
    <MotionTag className={className} aria-label={text} {...trigger}>
      {words.map((w, i) => {
        const it = italicFrom !== undefined && i >= italicFrom
        return (
          <span key={i} aria-hidden className="inline-block overflow-hidden align-bottom pb-[0.14em] -mb-[0.14em]">
            <motion.span
              variants={{ hidden: { y: '115%' }, show: { y: 0, transition: { duration: 1.1, delay: delay + i * stagger, ease } } }}
              className={`inline-block ${it ? 'italic text-ocean-300' : ''}`}
            >
              {w}
              {i < words.length - 1 ? ' ' : ''}
            </motion.span>
          </span>
        )
      })}
    </MotionTag>
  )
}

export function Reveal({ children, delay = 0, y = 40, className = '', once = true, x = 0 }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once, margin: '-70px' }}
      transition={{ duration: 1, delay, ease }}
    >
      {children}
    </motion.div>
  )
}

export function SectionHeading({ eyebrow, title, text, light = false, center = false, italicFrom }) {
  return (
    <div className={`${center ? 'mx-auto text-center' : ''} max-w-3xl`}>
      <Reveal y={16}>
        <p className={`eyebrow ${light ? '!text-ocean-300' : ''}`}>{eyebrow}</p>
      </Reveal>
      <SplitWords
        text={title}
        italicFrom={italicFrom}
        className={`display mt-5 text-[clamp(2.6rem,6vw,5.4rem)] ${light ? 'text-white' : 'text-navy-900'} ${center ? '[&>span]:' : ''}`}
      />
      {text && (
        <Reveal delay={0.2} y={20}>
          <p className={`mt-6 max-w-xl text-[17px] leading-relaxed ${light ? 'text-white/70' : 'text-navy-900/65'} ${center ? 'mx-auto' : ''}`}>{text}</p>
        </Reveal>
      )}
    </div>
  )
}

/* ---------- Parallax image ---------- */
export function ParallaxImg({ src, alt = '', className = '', speed = 0.12, children }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [`${-speed * 100}%`, `${speed * 100}%`])
  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.img
        src={src} alt={alt} loading="lazy" decoding="async"
        style={{ y, scale: 1 + speed * 2.4 }}
        className="absolute inset-0 h-full w-full object-cover will-change-transform"
      />
      {children}
    </div>
  )
}

/* ---------- 3D tilt ---------- */
export function TiltCard({ children, className = '', innerClass = '' }) {
  // simplified: gentle hover lift instead of 3D tilt
  return (
    <div className={className}>
      <div className={`group relative h-full transition-all duration-500 hover:-translate-y-2 hover:shadow-glow ${innerClass}`}>{children}</div>
    </div>
  )
}

function TiltCard3D({ children, className = '', innerClass = '', max = 9 }) {
  const ref = useRef(null)
  const rx = useMotionValue(0), ry = useMotionValue(0)
  const gx = useMotionValue(50), gy = useMotionValue(50)
  const srx = useSpring(rx, { stiffness: 180, damping: 18 })
  const sry = useSpring(ry, { stiffness: 180, damping: 18 })
  const glare = useMotionTemplate`radial-gradient(420px circle at ${gx}% ${gy}%, rgba(255,255,255,.28), transparent 55%)`
  const move = (e) => {
    const r = ref.current.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height
    ry.set((px - 0.5) * max * 2); rx.set(-(py - 0.5) * max * 2); gx.set(px * 100); gy.set(py * 100)
  }
  const leave = () => { rx.set(0); ry.set(0) }
  return (
    <div className={className} style={{ perspective: 1100 }}>
      <motion.div
        ref={ref} onMouseMove={move} onMouseLeave={leave}
        style={{ rotateX: srx, rotateY: sry, transformStyle: 'preserve-3d' }}
        className={`group relative h-full ${innerClass}`}
      >
        {children}
        <motion.div
          style={{ background: glare }}
          className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />
      </motion.div>
    </div>
  )
}

/* ---------- Magnetic wrapper ---------- */
export function Magnetic({ children, strength = 0.3, className = '' }) {
  const ref = useRef(null)
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 16 })
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 16 })
  return (
    <motion.div
      ref={ref} style={{ x, y }} className={`inline-block ${className}`}
      onMouseMove={(e) => {
        const r = ref.current.getBoundingClientRect()
        x.set((e.clientX - (r.left + r.width / 2)) * strength)
        y.set((e.clientY - (r.top + r.height / 2)) * strength)
      }}
      onMouseLeave={() => { x.set(0); y.set(0) }}
    >
      {children}
    </motion.div>
  )
}

/* ---------- Button ---------- */
export function Btn({ to, href, onClick, variant = 'primary', children, className = '', type = 'button', disabled, arrow = false }) {
  const cls = `btn btn-${variant} group ${disabled ? 'pointer-events-none opacity-50' : ''} ${className}`
  const inner = (
    <>
      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-[900ms] group-hover:translate-x-full" />
      <span className="relative z-10 flex items-center gap-2.5">
        {children}
        {arrow && <Icon name="arrow" className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />}
      </span>
    </>
  )
  if (to) return <Link to={to} className={cls} onClick={onClick}>{inner}</Link>
  if (href) return <a href={href} className={cls} onClick={onClick}>{inner}</a>
  return <button type={type} onClick={onClick} disabled={disabled} className={cls}>{inner}</button>
}

/* ---------- Counter ---------- */
export function Counter({ to, suffix = '', className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!inView) return
    const c = animate(0, to, { duration: 2.2, ease: [0.16, 1, 0.3, 1], onUpdate: (n) => setV(Math.round(n)) })
    return () => c.stop()
  }, [inView, to])
  return <span ref={ref} className={className}>{v.toLocaleString('en-US')}{suffix}</span>
}

/* ---------- Page header (inner pages) ---------- */
export function PageHeader({ eyebrow, title, text, image, italicFrom }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '28%'])
  const o = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  return (
    <header ref={ref} className="relative flex min-h-[78vh] items-end overflow-hidden bg-navy-950 pb-20 pt-40 text-white">
      <motion.img src={image} alt="" style={{ y }} initial={{ scale: 1.2 }} animate={{ scale: 1.05 }} transition={{ duration: 2.4, ease }}
        className="absolute inset-0 h-full w-full object-cover opacity-70" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/30 to-navy-950/60" />
      <motion.div style={{ opacity: o }} className="container-x relative z-10">
        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.9, ease }} className="eyebrow !text-ocean-300">{eyebrow}</motion.p>
        <SplitWords as="h1" ready delay={0.55} italicFrom={italicFrom} text={title} className="display mt-5 max-w-5xl text-[clamp(3rem,8vw,7.5rem)]" />
        {text && (
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1, duration: 1, ease }} className="mt-8 max-w-xl text-lg leading-relaxed text-white/75">
            {text}
          </motion.p>
        )}
      </motion.div>
    </header>
  )
}

export function Chip({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.16em] transition-all duration-500 ${
        active ? 'border-navy-900 bg-navy-900 text-white' : 'border-navy-900/15 bg-white text-navy-900/70 hover:border-navy-900/40'
      }`}
    >
      {children}
    </button>
  )
}
