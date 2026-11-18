import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Header, { NAV } from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Games from './pages/Games'
import GameDetail from './pages/GameDetail'
import Studio from './pages/Studio'
import Careers from './pages/Careers'
import CareerDetail from './pages/CareerDetail'
import News from './pages/News'
import NewsDetail from './pages/NewsDetail'
import ComingSoon from './pages/ComingSoon'

/** New page → start at the top; a hash link like /studio#team scrolls to that section. */
function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    const target = hash && document.getElementById(decodeURIComponent(hash.slice(1)))
    if (target) target.scrollIntoView()
    else window.scrollTo(0, 0)
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
          <Route path="/games" element={<Games />} />
          <Route path="/games/:slug" element={<GameDetail />} />
          <Route path="/studio" element={<Studio />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/careers/:slug" element={<CareerDetail />} />
          <Route path="/news" element={<News />} />
          <Route path="/news/:slug" element={<NewsDetail />} />
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
