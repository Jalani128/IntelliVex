import { useEffect, useRef } from 'react'

// Keep content visible by default; only prepare off-screen cards when motion is available.
export default function RevealItem({ children, index = 0 }) {
  const ref = useRef(null)

  useEffect(() => {
    const node = ref.current
    if (!node || !('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (node.getBoundingClientRect().top < window.innerHeight) return

    node.classList.add('card-reveal-pending')
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        node.classList.remove('card-reveal-pending')
        observer.disconnect()
      }
    }, { threshold: 0.08 })
    observer.observe(node)
    return () => { observer.disconnect(); node.classList.remove('card-reveal-pending') }
  }, [])

  return <li ref={ref} className="card-reveal" style={{ '--reveal-delay': `${(index % 3) * 90}ms` }}>{children}</li>
}
