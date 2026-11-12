import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { dest as findDest, hotels, extras as allExtras, tiers } from '../data/data'

const KEY = 'azura-booking-v1'
const initial = {
  dest: '', start: null, end: null, adults: 2, children: 0,
  tier: 'signature', hotel: '', extras: [], guest: { name: '', email: '', phone: '', notes: '' }, ref: null,
}

const Ctx = createContext(null)
export const useBooking = () => useContext(Ctx)

export const nightsBetween = (s, e) => {
  if (!s || !e) return 0
  return Math.max(0, Math.round((new Date(e) - new Date(s)) / 86400000))
}

export function BookingProvider({ children }) {
  const [b, setB] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY))
      if (saved) {
        // drop dates that are in the past
        const today = new Date().toISOString().slice(0, 10)
        if (saved.start && saved.start < today) { saved.start = null; saved.end = null }
        return { ...initial, ...saved }
      }
    } catch {}
    return initial
  })

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(b)) } catch {}
  }, [b])

  const update = useCallback((patch) => setB((p) => ({ ...p, ...patch })), [])
  const reset = useCallback(() => setB({ ...initial }), [])
  const toggleExtra = useCallback((id) =>
    setB((p) => ({ ...p, extras: p.extras.includes(id) ? p.extras.filter((x) => x !== id) : [...p.extras, id] })), [])

  const quote = useMemo(() => {
    const d = findDest(b.dest)
    const nights = nightsBetween(b.start, b.end) || (d ? 7 : 0)
    const pax = b.adults + b.children
    const tier = tiers.find((t) => t.id === b.tier) || tiers[1]
    const lines = []
    if (d) {
      const journey = d.perNight * nights * (b.adults + b.children * 0.5) * tier.mult
      lines.push({ label: `${d.name} journey · ${tier.label} · ${nights} nights`, amount: Math.round(journey) })
    }
    const h = hotels.find((x) => x.id === b.hotel)
    if (h) {
      const rooms = Math.max(1, Math.ceil(pax / 2))
      lines.push({ label: `${h.name} · ${rooms} room${rooms > 1 ? 's' : ''}`, amount: h.night * nights * rooms })
    }
    b.extras.forEach((id) => {
      const x = allExtras.find((e) => e.id === id)
      if (!x) return
      const amt = x.per === 'person' ? x.price * pax : x.price
      lines.push({ label: x.label, amount: amt })
    })
    const subtotal = lines.reduce((s, l) => s + l.amount, 0)
    const taxes = Math.round(subtotal * 0.05)
    return { lines, nights, pax, subtotal, taxes, total: subtotal + taxes, dest: d, hotel: h, tier }
  }, [b])

  return <Ctx.Provider value={{ b, update, reset, toggleExtra, quote }}>{children}</Ctx.Provider>
}
