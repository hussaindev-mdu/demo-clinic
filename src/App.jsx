import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import About from './components/About.jsx'
import Specialities from './components/Specialities.jsx'
import Doctors from './components/Doctors.jsx'
import Facilities from './components/Facilities.jsx'
import WhyChooseUs from './components/WhyChooseUs.jsx'
import Testimonials from './components/Testimonials.jsx'
import Appointment from './components/Appointment.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'
import Loader from './components/Loader.jsx'

// 3D code (three, R3F, drei) is split out and only fetched when WebGL is available
const Experience3D = lazy(() => import('./components/Experience3D.jsx'))

function detectWebGL() {
  try {
    const c = document.createElement('canvas')
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')))
  } catch { return false }
}

export default function App() {
  const [webgl] = useState(detectWebGL)
  const [sceneReady, setSceneReady] = useState(!webgl)
  const [loaderDone, setLoaderDone] = useState(false)
  const onReady = useCallback(() => setSceneReady(true), [])
  const onDone = useCallback(() => setLoaderDone(true), [])

  // Never trap users behind the loader if the 3D scene is slow or fails
  useEffect(() => { const t = setTimeout(() => setSceneReady(true), 6000); return () => clearTimeout(t) }, [])
  // Hold the loader for a minimum moment so it doesn't flash
  const [minTime, setMinTime] = useState(false)
  useEffect(() => { const t = setTimeout(() => setMinTime(true), 1400); return () => clearTimeout(t) }, [])

  return (
    <>
      <a href="#main" className="sr-only z-[200] rounded-full bg-navy-900 px-4 py-2 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4">Skip to main content</a>
      {!loaderDone && <Loader ready={sceneReady && minTime} onDone={onDone} />}
      <Navbar />
      {webgl && (
        <Suspense fallback={null}>
          <Experience3D onReady={onReady} />
        </Suspense>
      )}
      <main id="main" className="relative z-10">
        <div id="stage" className="relative">
          <Hero webgl={webgl} ready={loaderDone} />
          <About />
          <Specialities />
        </div>
        <Doctors />
        <Facilities />
        <WhyChooseUs />
        <Testimonials />
        <Appointment />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
