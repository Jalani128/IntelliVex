import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import logo from '../assets/home/logo.png'
import Button from './Button'

export const NAV = [
  { label: 'Home', to: '/' },
  { label: 'Games', to: '/games' },
  { label: 'Our Studio', to: '/studio' },
  { label: 'Careers', to: '/careers' },
  { label: 'News', to: '/news' },
  { label: 'Contact', to: '/contact' },
]

/* Neon rule under the bar: blue → cyan centre → dark edges (Figma 526:831). */
const RULE = 'linear-gradient(90deg, rgba(1,9,26,0) 0%, #034552 12%, #0481a0 25%, #05b1fb 37%, #07f9fb 50%, #05b1fb 63%, #0481a0 75%, #034552 88%, rgba(1,9,26,0) 100%)'

export default function Header() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  useEffect(() => setOpen(false), [pathname])

  const linkClass = ({ isActive }) =>
    `relative py-1 transition-colors duration-300 ${isActive ? 'text-cyan-nav' : 'text-white hover:text-cyan-nav'}`

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-ink/80 backdrop-blur-[20px]">
      <div className="container-studio flex h-[76px] items-center justify-between gap-6">
        <Link to="/" aria-label="IntelliVex Studios home" className="shrink-0">
          <img src={logo} alt="IntelliVex Studios" className="h-[52px] w-auto lg:h-[68px]" />
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-[30px] font-display text-[15px] font-semibold">
            {NAV.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} end={item.to === '/'} className={linkClass}>
                  {({ isActive }) => (
                    <>
                      {item.label}
                      {/* Cyan glow under the current page */}
                      <span
                        aria-hidden
                        className={`absolute -bottom-2 left-1/2 h-2 w-12 -translate-x-1/2 bg-[radial-gradient(closest-side,rgba(6,212,250,1),rgba(61,164,183,0.5)_50%,transparent)] transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`}
                      />
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <span className="hidden sm:block">
            <Button to="/contact">Let’s connect</Button>
          </span>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="grid size-11 place-items-center rounded-full border border-cyan/40 lg:hidden"
          >
            <span className="relative block h-3.5 w-5">
              <span className={`absolute left-0 h-0.5 w-5 bg-white transition-all duration-300 ${open ? 'top-1.5 rotate-45' : 'top-0'}`} />
              <span className={`absolute top-1.5 left-0 h-0.5 w-5 bg-white transition-opacity duration-300 ${open ? 'opacity-0' : ''}`} />
              <span className={`absolute left-0 h-0.5 w-5 bg-white transition-all duration-300 ${open ? 'top-1.5 -rotate-45' : 'top-3'}`} />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <nav
        id="mobile-nav"
        aria-label="Main"
        className={`grid overflow-hidden transition-[grid-template-rows] duration-300 ease-[var(--ease-out-soft)] lg:hidden ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
      >
        <ul className="min-h-0 container-studio font-display text-[17px] font-semibold">
          {NAV.map((item) => (
            <li key={item.to} className="border-t border-white/10">
              <NavLink to={item.to} end={item.to === '/'} className={linkClass} tabIndex={open ? 0 : -1}>
                <span className="block py-3.5">{item.label}</span>
              </NavLink>
            </li>
          ))}
          <li className="border-t border-white/10 py-4 sm:hidden">
            <Button to="/contact" tabIndex={open ? 0 : -1}>Let’s connect</Button>
          </li>
        </ul>
      </nav>

      <div aria-hidden className="h-[3px] w-full" style={{ backgroundImage: RULE }} />
    </header>
  )
}
