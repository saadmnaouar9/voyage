import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import { Btn, Icon, ParallaxImg, Reveal, SplitWords, ease, useReady } from '../components/ui'
import { BookingBar } from '../components/Booking'
import { SectionHeading } from '../components/ui'
import {
  ContactSection, DestCard, ExperiencesSection, NewsletterSection, OffersSection,
  PackagesSection, TestimonialsSection, WhyUs, HotelsSection,
} from '../components/sections'
import { destinations, IMG, img } from '../data/data'

const HERO_VIDEO = '' // drop an .mp4 URL here (e.g. /hero.mp4) to enable a cinematic video background
const slides = [
  { src: IMG.hero, place: 'Tropical lagoon', country: 'Indian Ocean' },
  { src: destinations[0].image, place: 'Maldives', country: 'Indian Ocean' },
  { src: destinations[1].image, place: 'Bali', country: 'Indonesia' },
  { src: destinations[4].image, place: 'Cappadocia', country: 'Türkiye' },
]

function Hero() {
  const ready = useReady()
  const ref = useRef(null)
  const [i, setI] = useState(0)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '-18%'])
  const o = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  useEffect(() => {
    if (!ready) return
    const t = setInterval(() => setI((x) => (x + 1) % slides.length), 6500)
    return () => clearInterval(t)
  }, [ready])

  return (
    <section ref={ref} className="relative min-h-[100svh] overflow-hidden bg-navy-950 text-white">
      <motion.div style={{ y }} className="absolute inset-0">
        {HERO_VIDEO ? (
          <video src={HERO_VIDEO} poster={img(IMG.hero, 1800)} autoPlay muted loop playsInline className="h-full w-full object-cover" />
        ) : (
          <AnimatePresence>
            <motion.img
              key={i} src={img(slides[i].src, 2000)} alt={slides[i].place}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.8, ease: 'easeInOut' }}
              className="kenburns absolute inset-0 h-full w-full object-cover"
              fetchPriority="high"
            />
          </AnimatePresence>
        )}
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-navy-950/70 via-navy-950/20 to-navy-950" />
      <div className="absolute inset-0 bg-gradient-to-r from-navy-950/60 via-transparent to-transparent" />

      <motion.div style={{ y: textY, opacity: o }} className="container-x relative z-10 flex min-h-[100svh] flex-col justify-center pb-44 pt-36">
        <motion.p initial={{ opacity: 0, y: 16 }} animate={ready ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.3, duration: 1, ease }} className="eyebrow flex items-center gap-4 !text-ocean-300">
          <span className="h-px w-12 bg-ocean-300" /> Luxury travel, redefined
        </motion.p>
        <SplitWords as="h1" ready={ready} delay={0.45} text="Journey beyond the horizon" italicFrom={2} className="display mt-6 max-w-5xl text-[clamp(2.8rem,7.5vw,7rem)]" />
        <motion.p initial={{ opacity: 0, y: 20 }} animate={ready ? { opacity: 1, y: 0 } : {}} transition={{ delay: 1.3, duration: 1, ease }} className="mt-8 max-w-lg text-lg leading-relaxed text-white/75">
          Seven extraordinary destinations. Handcrafted itineraries. Private access to the world’s most beautiful places.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={ready ? { opacity: 1, y: 0 } : {}} transition={{ delay: 1.5, duration: 1, ease }} className="mt-10 flex flex-wrap gap-4">
          <Btn to="/destinations" variant="primary" arrow>Explore destinations</Btn>
          <Btn to="/offers" variant="ghost">View offers</Btn>
        </motion.div>
      </motion.div>

      {/* slide indicator */}
      <div className="absolute bottom-44 right-5 z-10 hidden flex-col items-end gap-3 text-right sm:flex lg:right-14">
        <AnimatePresence mode="wait">
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <p className="eyebrow !text-white/60">{slides[i].country}</p><p className="display text-3xl">{slides[i].place}</p>
          </motion.div>
        </AnimatePresence>
        <div className="flex gap-2">
          {slides.map((_, k) => <button key={k} onClick={() => setI(k)} aria-label={`Slide ${k + 1}`} className={`h-1 rounded-full transition-all duration-700 ${k === i ? 'w-10 bg-ocean-300' : 'w-4 bg-white/30 hover:bg-white/60'}`} />)}
        </div>
      </div>

      {/* booking bar */}
      <motion.div initial={{ opacity: 0, y: 50 }} animate={ready ? { opacity: 1, y: 0 } : {}} transition={{ delay: 1.7, duration: 1.1, ease }} className="container-x absolute inset-x-0 bottom-10 z-30">
        <BookingBar />
      </motion.div>
      <div className="absolute bottom-3 left-1/2 z-10 hidden -translate-x-1/2 text-[10px] uppercase tracking-[0.4em] text-white/40 xl:block">Scroll</div>
    </section>
  )
}

function Intro() {
  return (
    <section className="relative overflow-hidden py-32">
      <div className="container-x grid items-center gap-16 lg:grid-cols-[1fr_1.1fr]">
        <div className="relative h-[34rem] sm:h-[40rem]">
          <ParallaxImg src={img(destinations[2].image, 900)} alt="Dubai skyline" className="absolute left-0 top-0 h-[75%] w-[68%] rounded-[2rem] shadow-card" speed={0.1} />
          <ParallaxImg src={img(destinations[6].image, 900)} alt="Morocco" className="absolute bottom-0 right-0 h-[62%] w-[56%] rounded-[2rem] border-8 border-sand-50 shadow-card" speed={0.16} />
          <motion.div initial={{ rotate: -90, opacity: 0 }} whileInView={{ rotate: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1.4, ease }} className="absolute bottom-10 left-6 grid h-32 w-32 place-items-center rounded-full bg-navy-900 text-center text-white shadow-glow">
            <div><div className="display text-4xl text-ocean-300">18</div><div className="text-[9px] uppercase tracking-[0.25em]">Years of craft</div></div>
          </motion.div>
        </div>
        <div>
          <Reveal y={16}><p className="eyebrow">Welcome to Azura</p></Reveal>
          <SplitWords text="We don’t sell trips. We compose memories." italicFrom={4} className="display mt-5 text-[clamp(2.6rem,5.2vw,5rem)]" />
          <Reveal delay={0.2}><p className="mt-8 max-w-xl text-lg leading-relaxed text-navy-900/70">From the first conversation to the last sunset, a dedicated specialist shapes every detail — the quiet villa, the right guide, the table that’s never on the menu. Seven destinations, mastered through nearly two decades of obsession.</p></Reveal>
          <Reveal delay={0.3}><div className="mt-10 flex flex-wrap gap-4"><Btn to="/about" variant="primary" arrow>Our philosophy</Btn><Btn to="/experiences" variant="outline">See experiences</Btn></div></Reveal>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <Hero />
      <section className="py-24">
        <div className="container-x">
          <SectionHeading eyebrow="Destinations" title="Seven places to fall for." italicFrom={3} />
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {destinations.map((d, i) => (
              <Reveal key={d.slug} delay={(i % 3) * 0.08}><DestCard d={d} i={i} className="h-[28rem]" /></Reveal>
            ))}
          </div>
        </div>
      </section>
      <OffersSection limit={3} />
      <PackagesSection limit={3} />
      <HotelsSection limit={4} />
      <WhyUs />
      <ExperiencesSection limit={5} />
      <TestimonialsSection />
      <NewsletterSection />
      <ContactSection compact />
    </>
  )
}
