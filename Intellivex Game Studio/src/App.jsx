import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Header, { NAV } from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import ComingSoon from './pages/ComingSoon'

/** New page → start at the top (hash links like /studio#team keep their target). */
function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Header />
      <main className="pt-[79px]">
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Built next, from their Figma frames. */}
          {NAV.slice(1).map((item) => (
            <Route key={item.to} path={`${item.to}/*`} element={<ComingSoon title={item.label} />} />
          ))}
          <Route path="*" element={<ComingSoon title="Page not found" />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}
