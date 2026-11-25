import { Link } from 'react-router-dom'
import footerLogo from '../assets/home/footer-logo.png'
import instagram from '../assets/home/social-instagram.svg'
import behance from '../assets/home/social-behance.svg'
import dribbble from '../assets/home/social-dribbble.svg'
import iconCall from '../assets/home/icon-call.svg'
import iconEmail from '../assets/home/icon-email.svg'
import iconLocation from '../assets/home/icon-location.svg'
import { useStudioGames } from '../hooks/useStudioGames'
import { useStudioContact } from '../hooks/useStudioContact'

// Social links are the design's placeholders until the studio's real ones arrive.

const STUDIO_LINKS = [
  { label: 'About Us', to: '/studio' },
  { label: 'News', to: '/news' },
  { label: 'Our Team', to: '/studio#team' },
  { label: 'Careers', to: '/careers' },
  { label: 'Contact Us', to: '/contact' },
]

const SOCIAL = [
  { label: 'Dribbble', icon: dribbble, href: '#' },
  { label: 'Behance', icon: behance, href: '#' },
  { label: 'Instagram', icon: instagram, href: '#' },
]

const heading = 'font-display text-[16px] leading-[22px] font-bold text-blue-soft'
const link = 'text-mute transition-colors duration-300 hover:text-cyan'

export default function Footer() {
  const { games } = useStudioGames()
  // Same address, email and phone as the Contact page (edited there in the admin).
  const contact = useStudioContact()
  const items = [
    { icon: iconLocation, text: contact.address },
    { icon: iconEmail, text: [contact.email], href: `mailto:${contact.email}` },
    { icon: iconCall, text: [contact.phones[0]], href: `tel:${contact.phones[0]?.replace(/[^\d+]/g, '')}` },
  ].filter((item) => item.text.length && item.text[0])
  return (
    <footer className="bg-ink pt-16 pb-8 lg:pt-[78px]">
      <div className="container-studio grid gap-10 sm:grid-cols-2 lg:grid-cols-[252px_1fr_auto_auto_auto] lg:gap-x-[clamp(32px,5vw,78px)]">
        <Link to="/" aria-label="IntelliVex Studios home" className="w-40 lg:w-[252px]">
          <img src={footerLogo} alt="IntelliVex Studios" className="h-auto w-full" />
        </Link>

        <div>
          <h2 className={heading}>Get in Touch</h2>
          <ul className="mt-6 space-y-4 font-display text-[16px] leading-[1.5]">
            {items.map((item) => (
              <li key={item.text[0]} className="flex gap-4">
                <img src={item.icon} alt="" aria-hidden className="size-6 shrink-0" />
                {item.href ? (
                  <a href={item.href} className={link}>{item.text.join(' ')}</a>
                ) : (
                  <span className="text-mute">{item.text.map((line) => <span key={line} className="block">{line}</span>)}</span>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className={heading}>Our Games</h2>
          <ul className="mt-6 space-y-4 font-display text-[16px] leading-[1.5] font-medium">
            {games.map((game) => (
              <li key={game.slug}><Link to={`/games/${game.slug}`} className={link}>{game.title}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className={heading}>Our Studio</h2>
          <ul className="mt-6 space-y-4 font-display text-[16px] leading-[1.5] font-medium">
            {STUDIO_LINKS.map((item) => (
              <li key={item.label}><Link to={item.to} className={link}>{item.label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <ul className="flex gap-4">
            {SOCIAL.map((s) => (
              <li key={s.label}>
                <a href={s.href} aria-label={s.label} className="block transition-transform duration-300 hover:-translate-y-1">
                  <img src={s.icon} alt="" className="size-10" />
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-6 max-w-[230px] font-display text-[16px] leading-[1.5] text-mute">
            Original games for mobile, PC and console, made in Baku for players everywhere.
          </p>
        </div>
      </div>

      <p className="container-studio mt-14 text-center font-display text-[14px] leading-[1.5] text-white sm:text-[16px]">
        © {new Date().getFullYear()} — Copyright All Rights reserved
      </p>
    </footer>
  )
}
