import { useEffect, useRef } from 'react'

export default function useScrollReveal({ threshold = 0.1, stagger = 90 } = {}) {
  const ref = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const container = ref.current
    if (!container) return
    const items = container.querySelectorAll('[data-reveal]')
    if (!items.length) return
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold }
    )
    items.forEach((item, i) => {
      item.style.setProperty('--reveal-delay', `${stagger * i}ms`)
      observer.observe(item)
    })
    return () => observer.disconnect()
  }, [])

  return ref
}
