import { Link } from 'react-router-dom'
import sparkle from '../assets/home/arrow-btn.svg'
import noise from '../assets/home/noise.png'

const SIZES = {
  md: 'h-[46px] px-8 text-[14px] gap-2',
  sm: 'h-8 px-6 text-[10px] gap-1.5',
}

/**
 * Glowing blue pill (Figma "button"): uppercase label + sparkle icon.
 * `to` is a site path (router link); `href` an outside or hash link.
 */
export default function Button({ to, href, children, size = 'md', className = '', ...rest }) {
  const cls = `group/btn relative isolate inline-flex shrink-0 items-center justify-center overflow-hidden rounded-[24.42px] bg-blue font-display font-semibold whitespace-nowrap text-white uppercase shadow-[0_0_149px_0_#0369fa,0_0_0.8px_3.3px_rgba(255,255,255,0.1)] transition-[transform,filter] duration-300 ease-[var(--ease-out-soft)] hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan active:translate-y-0 ${SIZES[size]} ${className}`
  const inner = (
    <>
      <span aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-size-[256px_256px] opacity-[0.07] mix-blend-overlay" style={{ backgroundImage: `url(${noise})` }} />
      {children}
      <img src={sparkle} alt="" aria-hidden className={`${size === 'sm' ? 'size-3' : 'size-3.5'} transition-transform duration-300 group-hover/btn:rotate-12`} />
      <span aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_-3.3px_1.7px_rgba(0,0,0,0.25),inset_0_1.7px_0.8px_rgba(255,255,255,0.25)]" />
    </>
  )
  if (to) return <Link to={to} className={cls} {...rest}>{inner}</Link>
  return <a href={href ?? '#'} className={cls} {...rest}>{inner}</a>
}
