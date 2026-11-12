import { lazy, Suspense, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Footer, Navbar } from './components/Chrome'
import Home from './pages/Home'

const named = (n) => lazy(() => import('./pages/Pages').then((m) => ({ default: m[n] })))
const Destinations = lazy(() => import('./pages/DestinationsAtlas'))
const DestinationDetail = named('DestinationDetail')
const OffersPage = named('OffersPage')
const PackagesPage = named('PackagesPage')
const HotelsPage = named('HotelsPage')
const ExperiencesPage = named('ExperiencesPage')
const AboutPage = named('AboutPage')
const ContactPage = named('ContactPage')
const NotFound = named('NotFound')
const BookingPage = lazy(() => import('./pages/BookingPage'))

export default function App() {
  const location = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [location.pathname])

  return (
    <>
      <Navbar />
      <main>
        <AnimatePresence mode="wait">
          <motion.div key={location.pathname} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            <Suspense fallback={<div className="min-h-screen" />}>
              <Routes location={location}>
                <Route path="/" element={<Home />} />
                <Route path="/destinations" element={<Destinations />} />
                <Route path="/destinations/:slug" element={<DestinationDetail />} />
                <Route path="/offers" element={<OffersPage />} />
                <Route path="/packages" element={<PackagesPage />} />
                <Route path="/hotels" element={<HotelsPage />} />
                <Route path="/experiences" element={<ExperiencesPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/booking" element={<BookingPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
            <Footer />
          </motion.div>
        </AnimatePresence>
      </main>
    </>
  )
}
