/** Small uppercase eyebrow over a 36px title (every home section). */
export default function SectionHeading({ eyebrow, title, as: Tag = 'h2', className = '' }) {
  return (
    <div className={className}>
      <p className="font-display text-[14px] tracking-[0.14em] text-white uppercase sm:text-[16px]">{eyebrow}</p>
      <Tag className="mt-2.5 font-display text-[26px] leading-[1.1] font-semibold tracking-[0.06em] text-white sm:text-[36px]">{title}</Tag>
    </div>
  )
}
