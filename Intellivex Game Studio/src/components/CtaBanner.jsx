import Button from './Button'
import ctaBanner from '../assets/home/cta-banner.jpg'
import { useStudioHome } from '../hooks/useStudioHome'

/** "Turn your game idea into reality" banner above the footer, shared by most pages; text comes from the Home page CMS. */
export default function CtaBanner() {
  const page = useStudioHome()
  return (
    <section className="relative isolate flex min-h-[405px] items-center justify-center overflow-hidden px-4 py-16">
      <img src={page.image('cta', ctaBanner)} alt="" aria-hidden loading="lazy" className="absolute inset-0 -z-10 size-full object-cover" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-ink/40 lg:hidden" />
      <div className="max-w-[330px] text-center lg:-translate-x-[57px]">
        <p className="font-display text-[11.65px] tracking-[0.14em] uppercase">{page.text('cta_eyebrow', 'Game development studio')}</p>
        <h2 className="text-neon mt-1.5 font-display text-[26px] leading-[1.02] font-extrabold tracking-[0.14em] uppercase sm:text-[30px]">
          {page.text('cta_title', 'Turn Your Game Idea Into Reality')}
        </h2>
        <p className="mx-auto mt-3 max-w-[314px] font-lato text-[16px] leading-[1.18]">
          {page.text('cta_text', 'From first prototype to global launch, our team can design, develop and run your game.')}
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Button to="/contact" size="sm">{page.text('cta_contact_button', 'Get in touch')}</Button>
          <Button to="/careers" size="sm">{page.text('cta_careers_button', 'Explore careers')}</Button>
        </div>
      </div>
    </section>
  )
}
