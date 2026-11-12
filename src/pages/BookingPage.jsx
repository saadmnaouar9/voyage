import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Btn, Icon, SplitWords, ease } from '../components/ui'
import { BookingFields, prettyDate } from '../components/Booking'
import { useBooking } from '../context/BookingContext'
import { extras, fmt, hotels, img, tiers } from '../data/data'

const steps = ['Trip', 'Style', 'Details', 'Review']

function Summary() {
  const { b, quote } = useBooking()
  const d = quote.dest
  return (
    <aside className="h-fit overflow-hidden rounded-[2rem] bg-navy-900 text-white shadow-card lg:sticky lg:top-28">
      <div className="relative h-44">
        {d ? (
          <img src={img(d.image, 800)} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="grid h-full place-items-center bg-navy-800 text-white/30"><Icon name="globe" className="h-14 w-14" /></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900 to-transparent" />
        <div className="absolute bottom-4 left-6">
          <p className="eyebrow !text-ocean-300">Your journey</p>
          <h3 className="display text-4xl">{d ? d.name : 'Choose a destination'}</h3>
        </div>
      </div>
      <div className="space-y-5 p-6">
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div><dt className="text-white/45">Dates</dt><dd className="font-medium">{b.start && b.end ? `${prettyDate(b.start)} → ${prettyDate(b.end)}` : '—'}</dd></div>
          <div><dt className="text-white/45">Travelers</dt><dd className="font-medium">{b.adults} adult{b.adults > 1 ? 's' : ''}{b.children ? `, ${b.children} child` : ''}</dd></div>
          <div><dt className="text-white/45">Nights</dt><dd className="font-medium">{quote.nights || '—'}</dd></div>
          <div><dt className="text-white/45">Style</dt><dd className="font-medium">{quote.tier.label}</dd></div>
        </dl>
        {quote.lines.length > 0 && (
          <div className="space-y-2 border-t border-white/10 pt-5 text-sm">
            {quote.lines.map((l) => (
              <div key={l.label} className="flex justify-between gap-4"><span className="text-white/65">{l.label}</span><span>{fmt(l.amount)}</span></div>
            ))}
            <div className="flex justify-between text-white/65"><span>Taxes & fees (5%)</span><span>{fmt(quote.taxes)}</span></div>
            <div className="flex items-end justify-between border-t border-white/10 pt-4">
              <span className="text-white/65">Total</span>
              <motion.span key={quote.total} initial={{ opacity: 0.4, y: 6 }} animate={{ opacity: 1, y: 0 }} className="display text-5xl text-ocean-300">{fmt(quote.total)}</motion.span>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}

function Confirmation() {
  const { b, quote, reset } = useBooking()
  const ics = () => {
    const f = (s) => s.split('-').join('')
    const body = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:Azura Voyages - ${quote.dest.name}\nDTSTART;VALUE=DATE:${f(b.start)}\nDTEND;VALUE=DATE:${f(b.end)}\nDESCRIPTION:Booking ${b.ref}\nEND:VEVENT\nEND:VCALENDAR`
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([body], { type: 'text/calendar' }))
    a.download = `${b.ref}.ics`
    a.click()
  }
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease }} className="mx-auto max-w-3xl rounded-[2.5rem] bg-white p-8 text-center shadow-card sm:p-14">
      <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.3, stiffness: 200 }} className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-ocean-500 text-white shadow-glow">
        <svg viewBox="0 0 24 24" className="h-11 w-11" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <motion.path d="M5 12.5 10 17.5 19 7" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.6, duration: 0.7 }} />
        </svg>
      </motion.span>
      <h2 className="display mt-8 text-5xl sm:text-6xl">Bon voyage, {b.guest.name.split(' ')[0]}.</h2>
      <p className="mx-auto mt-4 max-w-md text-navy-900/65">Your {quote.dest.name} journey is reserved. A confirmation has been sent to <b>{b.guest.email}</b>, and your specialist will call within 24 hours.</p>
      <div className="mx-auto mt-8 inline-block rounded-2xl border border-dashed border-navy-900/25 px-8 py-4">
        <p className="text-[11px] uppercase tracking-[0.25em] text-navy-900/45">Booking reference</p>
        <p className="font-mono text-2xl font-semibold tracking-widest">{b.ref}</p>
      </div>
      <p className="mt-6 text-navy-900/70">{prettyDate(b.start, true)} → {prettyDate(b.end, true)} · {quote.pax} travelers · <b>{fmt(quote.total)}</b></p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Btn variant="primary" onClick={ics}>Add to calendar</Btn>
        <Btn variant="outline" onClick={() => window.print()}>Print summary</Btn>
        <Btn to="/" variant="outline" onClick={reset}>Plan another trip</Btn>
      </div>
    </motion.div>
  )
}

const Label = ({ id, children }) => (
  <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-navy-900/50" htmlFor={id}>{children}</label>
)
const Err = ({ m }) => (m ? <p className="mt-1.5 text-sm text-red-500" role="alert">{m}</p> : null)

export default function BookingPage() {
  const { b, update, toggleExtra, quote } = useBooking()
  const [step, setStep] = useState(0)
  const [errs, setErrs] = useState({})
  const [agree, setAgree] = useState(false)
  const [busy, setBusy] = useState(false)
  const g = b.guest
  const setGuest = (k) => (e) => update({ guest: { ...g, [k]: e.target.value } })
  const hotelOpts = useMemo(() => hotels.filter((h) => h.dest === b.dest), [b.dest])

  const validate = () => {
    const er = {}
    if (step === 0) {
      if (!b.dest) er.dest = 'Please choose a destination.'
      if (!b.start || !b.end) er.dates = 'Select your check-in and check-out dates.'
    }
    if (step === 2) {
      if (g.name.trim().length < 2) er.name = 'Full name is required.'
      if (!/^\S+@\S+\.\S+$/.test(g.email)) er.email = 'Enter a valid email.'
      if (g.phone && !/^[+\d][\d\s().-]{6,}$/.test(g.phone)) er.phone = 'Enter a valid phone number.'
    }
    if (step === 3 && !agree) er.agree = 'Please accept the booking terms to continue.'
    setErrs(er)
    return !Object.keys(er).length
  }
  const go = (n) => { setStep(n); setErrs({}); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const next = () => {
    if (!validate()) return
    if (step < 3) return go(step + 1)
    setBusy(true)
    setTimeout(() => {
      update({ ref: 'AZ-' + Math.random().toString(36).slice(2, 8).toUpperCase() })
      setBusy(false)
      window.scrollTo({ top: 0 })
    }, 1400)
  }

  return (
    <>
      <header className="bg-navy-950 pb-16 pt-36 text-white">
        <div className="container-x">
          <p className="eyebrow !text-ocean-300">Reservation</p>
          <SplitWords as="h1" ready text={b.ref ? 'You’re all set.' : 'Design your journey.'} italicFrom={1} className="display mt-4 text-[clamp(3rem,7vw,6.5rem)]" />
          {!b.ref && (
            <ol className="mt-10 flex flex-wrap gap-2 sm:gap-4">
              {steps.map((s, i) => (
                <li key={s}>
                  <button disabled={i > step} onClick={() => go(i)} className={`flex items-center gap-3 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] transition ${i === step ? 'border-ocean-300 bg-ocean-500 text-white' : i < step ? 'border-white/30 text-white' : 'border-white/10 text-white/40'}`}>
                    <span className={`grid h-6 w-6 place-items-center rounded-full text-[11px] ${i < step ? 'bg-white text-navy-900' : 'bg-white/10'}`}>
                      {i < step ? <Icon name="check" className="h-3 w-3" stroke={2.5} /> : i + 1}
                    </span>
                    {s}
                  </button>
                </li>
              ))}
            </ol>
          )}
        </div>
      </header>

      <section className="bg-sand-50 py-14 sm:py-20">
        <div className="container-x">
          {b.ref ? (
            <Confirmation />
          ) : (
            <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
              <div className="rounded-[2rem] bg-white p-6 shadow-card ring-1 ring-navy-900/5 sm:p-10">
                <AnimatePresence mode="wait">
                  <motion.div key={step} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.45, ease }}>
                    {step === 0 && (
                      <div>
                        <h2 className="display text-4xl sm:text-5xl">Where & when?</h2>
                        <p className="mt-2 text-navy-900/60">Pick a destination, your dates and who’s coming.</p>
                        <div className="mt-8"><BookingFields light cols="grid-cols-1" /></div>
                        <Err m={errs.dest} />
                        <Err m={errs.dates} />
                        {quote.nights > 0 && b.start && b.end && (
                          <p className="mt-6 rounded-2xl bg-sand-100 px-5 py-4 text-sm text-navy-900/70">✦ {quote.nights} nights in {quote.dest?.name || 'paradise'} for {quote.pax} traveler{quote.pax > 1 ? 's' : ''}.</p>
                        )}
                      </div>
                    )}

                    {step === 1 && (
                      <div>
                        <h2 className="display text-4xl sm:text-5xl">Choose your style</h2>
                        <div className="mt-8 grid gap-4 sm:grid-cols-3">
                          {tiers.map((t) => (
                            <button key={t.id} onClick={() => update({ tier: t.id })} aria-pressed={b.tier === t.id} className={`rounded-3xl border p-6 text-left transition-all duration-500 ${b.tier === t.id ? 'border-ocean-500 bg-ocean-500/5 shadow-glow' : 'border-navy-900/10 hover:border-navy-900/30'}`}>
                              <p className="display text-3xl">{t.label}</p>
                              <p className="mt-2 text-sm text-navy-900/60">{t.text}</p>
                              <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-ocean-600">×{t.mult.toFixed(2)}</p>
                            </button>
                          ))}
                        </div>
                        <h3 className="display mt-12 text-3xl">Hotel</h3>
                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                          <button onClick={() => update({ hotel: '' })} className={`rounded-2xl border p-4 text-left text-sm transition ${!b.hotel ? 'border-ocean-500 bg-ocean-500/5' : 'border-navy-900/10 hover:border-navy-900/30'}`}>
                            Let Azura choose the best fit<br /><span className="text-navy-900/50">Included in journey price</span>
                          </button>
                          {hotelOpts.map((h) => (
                            <button key={h.id} onClick={() => update({ hotel: h.id })} className={`flex items-center gap-4 rounded-2xl border p-3 text-left text-sm transition ${b.hotel === h.id ? 'border-ocean-500 bg-ocean-500/5' : 'border-navy-900/10 hover:border-navy-900/30'}`}>
                              <img src={img(h.image, 200)} alt="" className="h-16 w-16 rounded-xl object-cover" />
                              <span><b className="block">{h.name}</b><span className="text-navy-900/50">+ {fmt(h.night)} / night</span></span>
                            </button>
                          ))}
                        </div>
                        <h3 className="display mt-12 text-3xl">Enhancements</h3>
                        <div className="mt-4 space-y-3">
                          {extras.map((x) => {
                            const on = b.extras.includes(x.id)
                            return (
                              <button key={x.id} onClick={() => toggleExtra(x.id)} aria-pressed={on} className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left transition ${on ? 'border-ocean-500 bg-ocean-500/5' : 'border-navy-900/10 hover:border-navy-900/30'}`}>
                                <span className="flex items-center gap-4">
                                  <span className={`grid h-6 w-6 place-items-center rounded-md border transition ${on ? 'border-ocean-500 bg-ocean-500 text-white' : 'border-navy-900/20'}`}>{on && <Icon name="check" className="h-3.5 w-3.5" stroke={3} />}</span>
                                  {x.label}
                                </span>
                                <span className="text-sm text-navy-900/60">{fmt(x.price)} / {x.per}</span>
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {step === 2 && (
                      <div>
                        <h2 className="display text-4xl sm:text-5xl">Lead traveler</h2>
                        <div className="mt-8 grid gap-5 sm:grid-cols-2">
                          <div className="sm:col-span-2">
                            <Label id="g-name">Full name *</Label>
                            <input id="g-name" className={`field ${errs.name ? 'field-error' : ''}`} value={g.name} onChange={setGuest('name')} placeholder="As on passport" autoComplete="name" />
                            <Err m={errs.name} />
                          </div>
                          <div>
                            <Label id="g-email">Email *</Label>
                            <input id="g-email" type="email" className={`field ${errs.email ? 'field-error' : ''}`} value={g.email} onChange={setGuest('email')} placeholder="you@example.com" autoComplete="email" />
                            <Err m={errs.email} />
                          </div>
                          <div>
                            <Label id="g-phone">Phone</Label>
                            <input id="g-phone" className={`field ${errs.phone ? 'field-error' : ''}`} value={g.phone} onChange={setGuest('phone')} placeholder="+33 6 12 34 56 78" autoComplete="tel" />
                            <Err m={errs.phone} />
                          </div>
                          <div className="sm:col-span-2">
                            <Label id="g-notes">Special requests</Label>
                            <textarea id="g-notes" rows={4} className="field" value={g.notes} onChange={setGuest('notes')} placeholder="Anniversaries, allergies, accessibility needs…" />
                          </div>
                        </div>
                      </div>
                    )}

                    {step === 3 && (
                      <div>
                        <h2 className="display text-4xl sm:text-5xl">Review & confirm</h2>
                        <div className="mt-8 divide-y divide-navy-900/10 rounded-3xl border border-navy-900/10">
                          {[
                            ['Destination', quote.dest?.name],
                            ['Dates', `${prettyDate(b.start, true)} → ${prettyDate(b.end, true)}`],
                            ['Travelers', `${b.adults} adults${b.children ? `, ${b.children} children` : ''}`],
                            ['Style', quote.tier.label],
                            ['Hotel', quote.hotel?.name || 'Selected by Azura'],
                            ['Lead traveler', `${g.name} · ${g.email}`],
                            ['Enhancements', b.extras.length ? b.extras.map((id) => extras.find((e) => e.id === id)?.label).join(', ') : 'None'],
                          ].map(([l, v]) => (
                            <div key={l} className="flex flex-col justify-between gap-1 px-6 py-4 sm:flex-row"><span className="text-sm text-navy-900/50">{l}</span><span className="font-medium sm:text-right">{v}</span></div>
                          ))}
                        </div>
                        <label className="mt-8 flex cursor-pointer items-start gap-4 text-sm text-navy-900/70">
                          <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-1 h-5 w-5 accent-ocean-500" />
                          <span>I agree to the booking terms and the free-cancellation policy (up to 45 days before departure). No payment is taken today.</span>
                        </label>
                        <Err m={errs.agree} />
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                <div className="mt-10 flex items-center justify-between border-t border-navy-900/10 pt-8">
                  {step > 0 ? (
                    <button onClick={() => go(step - 1)} className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-navy-900/60 hover:text-navy-900"><Icon name="left" className="h-4 w-4" />Back</button>
                  ) : (
                    <Link to="/destinations" className="text-sm font-semibold uppercase tracking-widest text-navy-900/60 hover:text-navy-900">Browse destinations</Link>
                  )}
                  <Btn variant="primary" arrow onClick={next} disabled={busy}>{busy ? 'Confirming…' : step === 3 ? `Confirm · ${fmt(quote.total)}` : 'Continue'}</Btn>
                </div>
              </div>
              <Summary />
            </div>
          )}
        </div>
      </section>
    </>
  )
}
