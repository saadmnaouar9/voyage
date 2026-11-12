import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Btn, Chip, Icon, PageHeader, ParallaxImg, Reveal, SectionHeading, SplitWords, Stars, ease } from '../components/ui'
import {
  CTABand, ContactSection, DestCard, ExperiencesSection, FAQ, HotelsSection, Marquee, NewsletterSection, OffersSection,
  PackagesSection, TestimonialsSection, WhyUs, useBookNow,
} from '../components/sections'
import { dest as findDest, destinations, fmt, img, IMG, hotels } from '../data/data'

export function Destinations() {
  const [region, setRegion] = useState('All')
  const filters = { All: () => true, Beaches: (d) => ['maldives', 'bali', 'thailand'].includes(d.slug), Culture: (d) => ['turkey', 'morocco', 'bali'].includes(d.slug), 'City & Alps': (d) => ['dubai', 'switzerland'].includes(d.slug) }
  const list = destinations.filter(filters[region])
  return (
    <>
      <PageHeader eyebrow="Destinations" title="Seven worlds to fall for." italicFrom={3} image={img(IMG.maldives, 2000)} text="From overwater villas to Saharan dunes — each destination mastered, each journey tailored." />
      <section className="py-24">
        <div className="container-x">
          <div className="mb-12 flex flex-wrap gap-2">{Object.keys(filters).map((f) => <Chip key={f} active={region === f} onClick={() => setRegion(f)}>{f}</Chip>)}</div>
          <motion.div layout className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {list.map((d, i) => (
                <motion.div key={d.slug} layout initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.7, ease }}>
                  <DestCard d={d} i={destinations.indexOf(d)} className="h-[34rem]" />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
      <CTABand />
    </>
  )
}

export function DestinationDetail() {
  const { slug } = useParams()
  const d = findDest(slug)
  const book = useBookNow()
  const [openDay, setOpenDay] = useState(0)
  if (!d) return <NotFound />
  const idx = destinations.indexOf(d)
  const next = destinations[(idx + 1) % destinations.length]
  return (
    <>
      <PageHeader eyebrow={`${d.country} · ${d.tag}`} title={d.name} image={img(d.image, 2200)} text={d.desc} />
      <section className="py-20">
        <div className="container-x">
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-navy-900/10 bg-navy-900/10 lg:grid-cols-5">
            {[['Best time', d.best], ['Climate', d.temp], ['Flight from Paris', d.flight], ['Suggested stay', d.duration], ['From', fmt(d.from)]].map(([l, v]) => (
              <div key={l} className="bg-white p-6"><p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-navy-900/45">{l}</p><p className="display mt-2 text-3xl">{v}</p></div>
            ))}
          </div>
          <div className="mt-24 grid gap-16 lg:grid-cols-[1fr_1.1fr]">
            <div>
              <SectionHeading eyebrow="Highlights" title={`The best of ${d.name}`} />
              <ul className="mt-10 space-y-3">
                {d.highlights.map((h, i) => (
                  <Reveal key={h} delay={i * 0.07} x={-20} y={0}>
                    <li className="flex items-center gap-4 rounded-2xl border border-navy-900/10 bg-white p-4"><span className="grid h-10 w-10 place-items-center rounded-full bg-ocean-500/10 text-ocean-600"><Icon name="check" className="h-4 w-4" /></span>{h}</li>
                  </Reveal>
                ))}
              </ul>
              <div className="mt-10 flex flex-wrap gap-3"><Btn variant="primary" arrow onClick={() => book({ dest: d.slug })}>Book {d.name}</Btn><Btn to="/contact" variant="outline">Ask a specialist</Btn></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <ParallaxImg src={img(d.image, 900)} alt={d.name} className="row-span-2 min-h-[26rem] rounded-[2rem]" speed={0.08} />
              <ParallaxImg src={img(d.alt, 900)} alt={`${d.name} scenery`} className="h-56 rounded-[2rem]" speed={0.08} />
              <ParallaxImg src={img(IMG.hero, 900)} alt="Beach" className="h-56 rounded-[2rem]" speed={0.08} />
            </div>
          </div>
        </div>
      </section>
      <section className="bg-navy-950 py-24 text-white">
        <div className="container-x max-w-5xl">
          <SectionHeading light eyebrow="Sample itinerary" title="A journey, day by day." italicFrom={2} />
          <div className="mt-14 divide-y divide-white/10 border-y border-white/10">
            {d.itinerary.map(([t, x], i) => (
              <div key={t}>
                <button onClick={() => setOpenDay(openDay === i ? -1 : i)} className="flex w-full items-center gap-6 py-7 text-left" aria-expanded={openDay === i}>
                  <span className="font-mono text-sm text-ocean-300">Day {String(i * 2 + 1).padStart(2, '0')}</span>
                  <span className="display flex-1 text-3xl sm:text-4xl">{t}</span>
                  <Icon name="plus" className={`h-5 w-5 transition-transform duration-500 ${openDay === i ? 'rotate-45' : ''}`} />
                </button>
                <AnimatePresence initial={false}>
                  {openDay === i && <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.5, ease }} className="overflow-hidden pl-0 text-white/65 sm:pl-24">{x}<span className="block pb-7" /></motion.p>}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>
      <PackagesSection destFilter={d.slug} />
      {hotels.some((h) => h.dest === d.slug) && <HotelsSection destFilter={d.slug} />}
      <Link to={`/destinations/${next.slug}`} data-cursor="Next" className="group relative block overflow-hidden bg-navy-950 py-32 text-center text-white">
        <img src={img(next.image, 1600)} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40 transition-all duration-[1500ms] group-hover:scale-110 group-hover:opacity-60" />
        <div className="relative"><p className="eyebrow !text-ocean-300">Next destination</p><h3 className="display mt-4 text-[clamp(4rem,12vw,10rem)]">{next.name}</h3></div>
      </Link>
    </>
  )
}

export const OffersPage = () => (
  <>
    <PageHeader eyebrow="Exclusive offers" title="Privileges, for a few days only." italicFrom={2} image={img(IMG.maldives2, 2000)} text="Seasonal savings and complimentary upgrades. Every offer can be tailored to your dates." />
    <OffersSection />
    <section className="bg-navy-950 py-24 text-white"><div className="container-x grid gap-10 md:grid-cols-3">
      {[['tag', 'Best-price promise', 'Find it cheaper elsewhere and we’ll match it, plus a complimentary upgrade.'], ['shield', 'Flexible booking', 'Free changes up to 45 days before departure on every offer.'], ['heart', 'Loyalty rewards', 'Earn Azura Miles on every trip and redeem them for private experiences.']].map(([ic, t, x]) => (
        <Reveal key={t}><div><span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/10 text-ocean-300"><Icon name={ic} /></span><h3 className="display mt-5 text-3xl">{t}</h3><p className="mt-2 text-white/60">{x}</p></div></Reveal>
      ))}
    </div></section>
    <NewsletterSection />
  </>
)

export const PackagesPage = () => (
  <>
    <PageHeader eyebrow="Travel packages" title="Ready to go. Made to measure." italicFrom={3} image={img(IMG.bali, 2000)} text="Flights, stays and signature experiences, composed into complete journeys — then personalised to you." />
    <PackagesSection filterable />
    <CTABand title="Don’t see your dream trip?" text="Our specialists build fully bespoke itineraries from scratch." />
  </>
)

export const HotelsPage = () => (
  <>
    <PageHeader eyebrow="Luxury hotels" title="Addresses worth the journey." italicFrom={2} image={img(IMG.hotel2, 2000)} text="Villas above the lagoon, riads behind carved doors, chalets beneath the peaks." />
    <HotelsSection filterable />
    <CTABand />
  </>
)

export const ExperiencesPage = () => (
  <>
    <PageHeader eyebrow="Experiences" title="Moments, not itineraries." italicFrom={2} image={img(IMG.turkey, 2000)} text="Rare, private encounters that turn a trip into a story you will tell for life." />
    <ExperiencesSection />
    <section className="py-24"><Marquee items={['Balloons at dawn', 'Private islands', 'Desert camps', 'Glacier trains', 'Temple sunrises']} /></section>
    <TestimonialsSection />
    <CTABand />
  </>
)

export const AboutPage = () => (
  <>
    <PageHeader eyebrow="Why Azura" title="Travel is personal. So are we." italicFrom={3} image={img(IMG.swiss, 2000)} text="A small, obsessive team of destination specialists with one rule: send guests only where we would send family." />
    <WhyUs />
    <section className="bg-sand-100 py-28"><div className="container-x grid gap-16 lg:grid-cols-3">
      {[['01', 'Listen', 'A long conversation about how you want to feel, not just where you want to go.'], ['02', 'Compose', 'Your specialist drafts a private itinerary within 48 hours, refined together.'], ['03', 'Travel', 'We’re on call 24/7 while you’re away. Your only job is to enjoy it.']].map(([n, t, x], i) => (
        <Reveal key={n} delay={i * 0.12}><div className="border-t border-navy-900/20 pt-8"><span className="font-mono text-sm text-ocean-600">{n}</span><h3 className="display mt-4 text-5xl">{t}</h3><p className="mt-4 text-navy-900/65">{x}</p></div></Reveal>
      ))}
    </div></section>
    <TestimonialsSection />
    <CTABand />
  </>
)

export const ContactPage = () => (
  <>
    <PageHeader eyebrow="Contact" title="Say hello. We’re listening." italicFrom={2} image={img(IMG.thai2, 2000)} text="A real person answers every message — usually within two hours." />
    <ContactSection />
    <FAQ />
  </>
)

export function NotFound() {
  return (
    <section className="grid min-h-screen place-items-center bg-navy-950 px-6 text-center text-white">
      <div>
        <p className="eyebrow !text-ocean-300">Error 404</p>
        <SplitWords as="h1" ready text="Lost in paradise." className="display mt-4 text-[clamp(4rem,12vw,10rem)]" />
        <p className="mx-auto mt-6 max-w-md text-white/60">The page you’re looking for has drifted off the map. Let’s get you back on course.</p>
        <div className="mt-10 flex justify-center gap-3"><Btn to="/" variant="primary" arrow>Return home</Btn><Btn to="/destinations" variant="ghost">Destinations</Btn></div>
      </div>
    </section>
  )
}
