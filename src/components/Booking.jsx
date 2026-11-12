import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Btn, Icon, ease } from './ui'
import { useBooking } from '../context/BookingContext'
import { allDestinations, img } from '../data/data'

const destinations = allDestinations()

const pad = (n) => String(n).padStart(2, '0')
export const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
export const parse = (s) => new Date(`${s}T00:00:00`)
export const prettyDate = (s, long = false) =>
  s ? parse(s).toLocaleDateString('en-GB', long ? { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' } : { day: 'numeric', month: 'short' }) : ''

function useOutside(ref, cb) {
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) cb() }
    document.addEventListener('pointerdown', h)
    return () => document.removeEventListener('pointerdown', h)
  }, [ref, cb])
}

/* ---------- Calendar ---------- */
function Month({ date, start, end, hover, setHover, onPick }) {
  const today = iso(new Date())
  const first = new Date(date.getFullYear(), date.getMonth(), 1)
  const offset = (first.getDay() + 6) % 7
  const count = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  const cells = [...Array(offset).fill(null), ...Array.from({ length: count }, (_, i) => new Date(date.getFullYear(), date.getMonth(), i + 1))]
  const rangeEnd = end || (start && hover && hover > start ? hover : null)
  return (
    <div className="w-[17.5rem]">
      <p className="mb-3 text-center font-display text-xl">{first.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</p>
      <div className="grid grid-cols-7 text-center text-[10px] font-semibold uppercase tracking-wider text-navy-900/40">
        {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((d) => <span key={d} className="py-1">{d}</span>)}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((d, i) => {
          if (!d) return <span key={i} />
          const s = iso(d)
          const disabled = s < today
          const isS = s === start, isE = s === end
          const inR = start && rangeEnd && s > start && s < rangeEnd
          return (
            <button
              key={i} type="button" disabled={disabled} onClick={() => onPick(s)} onMouseEnter={() => setHover(s)}
              className={`relative h-10 text-sm transition ${disabled ? 'text-navy-900/20' : 'hover:text-ocean-600'} ${inR ? 'bg-ocean-500/10' : ''} ${isS && rangeEnd ? 'rounded-l-full bg-ocean-500/10' : ''} ${isE ? 'rounded-r-full bg-ocean-500/10' : ''}`}
            >
              <span className={`mx-auto grid h-9 w-9 place-items-center rounded-full ${isS || isE ? 'bg-navy-900 font-semibold text-white' : ''} ${s === today && !isS && !isE ? 'ring-1 ring-ocean-500' : ''}`}>{d.getDate()}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function Calendar({ start, end, onChange, onDone }) {
  const [cursor, setCursor] = useState(() => { const d = start ? parse(start) : new Date(); return new Date(d.getFullYear(), d.getMonth(), 1) })
  const [hover, setHover] = useState(null)
  const next = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1)
  const thisMonth = new Date(); const canPrev = cursor > new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 1)
  const pick = (s) => {
    if (!start || (start && end) || s <= start) onChange(s, null)
    else { onChange(start, s); setTimeout(onDone, 250) }
  }
  return (
    <div onMouseLeave={() => setHover(null)}>
      <div className="mb-2 flex items-center justify-between">
        <button type="button" disabled={!canPrev} onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))} className="grid h-9 w-9 place-items-center rounded-full hover:bg-sand-100 disabled:opacity-20" aria-label="Previous month"><Icon name="left" className="h-4 w-4" /></button>
        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-navy-900/50">{!start ? 'Select check-in' : !end ? 'Select check-out' : 'Dates selected'}</span>
        <button type="button" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))} className="grid h-9 w-9 place-items-center rounded-full hover:bg-sand-100" aria-label="Next month"><Icon name="right" className="h-4 w-4" /></button>
      </div>
      <div className="flex gap-8">
        <Month date={cursor} start={start} end={end} hover={hover} setHover={setHover} onPick={pick} />
        <div className="hidden md:block"><Month date={next} start={start} end={end} hover={hover} setHover={setHover} onPick={pick} /></div>
      </div>
    </div>
  )
}

/* ---------- Field shell ---------- */
function Field({ id, open, setOpen, icon, label, value, placeholder, light, children, align = 'left', width = 'lg:w-[22rem]', up = false }) {
  const ref = useRef(null)
  useOutside(ref, () => open === id && setOpen(null))
  return (
    <div ref={ref} className="lg:relative">
      <button
        type="button" onClick={() => setOpen(open === id ? null : id)} aria-expanded={open === id}
        className={`flex h-full w-full items-center gap-4 rounded-2xl px-5 py-4 text-left transition ${
          light ? 'border border-navy-900/10 bg-white hover:border-ocean-500' : 'hover:bg-white/10'
        } ${open === id ? (light ? 'border-ocean-500 ring-4 ring-ocean-500/15' : 'bg-white/15') : ''}`}
      >
        <Icon name={icon} className={`h-5 w-5 shrink-0 ${light ? 'text-ocean-500' : 'text-ocean-300'}`} />
        <span className="min-w-0">
          <span className={`block text-xs font-bold uppercase tracking-[0.14em] ${light ? 'text-ocean-600' : 'text-white'}`}>{label}</span>
          <span className={`mt-0.5 block truncate text-[15px] font-medium ${light ? 'text-navy-900' : 'text-white'} ${!value ? (light ? '!text-navy-900/35' : '!text-white/50') : ''}`}>{value || placeholder}</span>
        </span>
      </button>
      <AnimatePresence>
        {open === id && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.35, ease }}
            className={`absolute inset-x-0 z-50 max-h-[70vh] overflow-y-auto rounded-3xl bg-white p-5 text-navy-900 shadow-[0_40px_90px_-20px_rgba(4,11,28,.55)] lg:inset-x-auto ${up ? 'bottom-[calc(100%+12px)] lg:bottom-[calc(100%+12px)]' : 'top-[calc(100%+12px)]'} ${width} ${align === 'right' ? 'lg:right-0' : 'lg:left-0'}`}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const Stepper = ({ label, sub, value, min, max, onChange }) => (
  <div className="flex items-center justify-between py-3">
    <div><p className="font-semibold">{label}</p><p className="text-xs text-navy-900/50">{sub}</p></div>
    <div className="flex items-center gap-4">
      <button type="button" disabled={value <= min} onClick={() => onChange(value - 1)} className="grid h-9 w-9 place-items-center rounded-full border border-navy-900/15 transition hover:bg-navy-900 hover:text-white disabled:opacity-25" aria-label={`Fewer ${label}`}><Icon name="minus" className="h-4 w-4" /></button>
      <span className="w-5 text-center font-semibold tabular-nums">{value}</span>
      <button type="button" disabled={value >= max} onClick={() => onChange(value + 1)} className="grid h-9 w-9 place-items-center rounded-full border border-navy-900/15 transition hover:bg-navy-900 hover:text-white disabled:opacity-25" aria-label={`More ${label}`}><Icon name="plus" className="h-4 w-4" /></button>
    </div>
  </div>
)

/* ---------- Shared fields (hero bar + booking page) ---------- */
export function BookingFields({ light = false, up = false, cols = 'md:grid-cols-[1.15fr_1.35fr_1fr]' }) {
  const { b, update } = useBooking()
  const [open, setOpen] = useState(null)
  const d = destinations.find((x) => x.slug === b.dest)
  const pax = b.adults + b.children
  const dateText = b.start ? `${prettyDate(b.start)}${b.end ? ' → ' + prettyDate(b.end) : ' → …'}` : ''
  return (
    <div className={`relative grid gap-2 lg:static ${cols}`}>
      <Field id="dest" {...{ open, setOpen, light, up }} icon="pin" label="Destination" value={d?.name} placeholder="Where to?" width="lg:w-[26rem]">
        <ul className="max-h-80 space-y-1 overflow-y-auto pr-1">
          {destinations.map((x) => (
            <li key={x.slug}>
              <button type="button" onClick={() => { update({ dest: x.slug }); setOpen('dates') }}
                className={`flex w-full items-center gap-4 rounded-2xl p-2.5 text-left transition hover:bg-sand-100 ${b.dest === x.slug ? 'bg-sand-100' : ''}`}>
                <img src={img(x.image, 160)} alt="" className="h-12 w-12 rounded-xl object-cover" />
                <span className="flex-1"><span className="block font-semibold">{x.name}</span><span className="text-xs text-navy-900/50">{x.tag}</span></span>
                <span className="text-xs text-navy-900/50">from ${x.from.toLocaleString()}</span>
              </button>
            </li>
          ))}
        </ul>
      </Field>
      <Field id="dates" {...{ open, setOpen, light, up }} icon="calendar" label="Check-in / out" value={dateText} placeholder="Add dates" width="lg:w-[40rem]">
        <Calendar start={b.start} end={b.end} onChange={(s, e) => update({ start: s, end: e })} onDone={() => setOpen('pax')} />
        {b.start && (
          <div className="mt-3 flex items-center justify-between border-t border-navy-900/10 pt-3 text-sm">
            <span className="text-navy-900/60">{b.end ? `${Math.round((parse(b.end) - parse(b.start)) / 864e5)} nights` : 'Choose your return date'}</span>
            <button type="button" onClick={() => update({ start: null, end: null })} className="font-semibold text-ocean-600 hover:underline">Clear</button>
          </div>
        )}
      </Field>
      <Field id="pax" {...{ open, setOpen, light, up }} icon="user" label="Travelers" value={`${b.adults} adult${b.adults > 1 ? 's' : ''}${b.children ? ` · ${b.children} child${b.children > 1 ? 'ren' : ''}` : ''}`} placeholder="Add guests" align="right" width="lg:w-[20rem]">
        <Stepper label="Adults" sub="Age 13+" value={b.adults} min={1} max={10} onChange={(v) => update({ adults: v })} />
        <div className="border-t border-navy-900/10" />
        <Stepper label="Children" sub="Age 0–12" value={b.children} min={0} max={8} onChange={(v) => update({ children: v })} />
        <p className="mt-2 rounded-xl bg-sand-100 px-4 py-3 text-xs text-navy-900/60">{pax} traveler{pax > 1 ? 's' : ''} · rooms are arranged automatically.</p>
        <Btn variant="primary" className="mt-4 w-full" onClick={() => setOpen(null)}>Done</Btn>
      </Field>
    </div>
  )
}

/* ---------- Hero search bar ---------- */
export function BookingBar() {
  const nav = useNavigate()
  const { b } = useBooking()
  const [hint, setHint] = useState(false)
  const go = () => {
    if (!b.dest) { setHint(true); setTimeout(() => setHint(false), 2200); return }
    nav('/booking')
  }
  return (
    <div className="relative">
      <div className="flex flex-col gap-2 rounded-[2rem] bg-white p-3 shadow-[0_30px_80px_-20px_rgba(0,0,0,.5)] lg:flex-row lg:items-stretch">
        <div className="flex-1"><BookingFields light up /></div>
        <Btn variant="primary" onClick={go} className="!rounded-[1.5rem] !px-9 !py-5 lg:!px-10">
          <Icon name="search" className="h-4 w-4" /> Search
        </Btn>
      </div>
      <AnimatePresence>
        {hint && (
          <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute -bottom-9 left-4 text-sm text-ocean-300">
            Choose a destination to continue ✦
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

