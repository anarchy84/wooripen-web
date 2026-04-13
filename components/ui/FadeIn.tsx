'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

interface FadeInProps {
  children: ReactNode
  className?: string
  delay?: number          // ms
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  distance?: number       // px
  duration?: number       // ms
  once?: boolean          // 한번만 실행
  threshold?: number      // 0-1
}

export default function FadeIn({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  distance = 32,
  duration = 700,
  once = true,
  threshold = 0.15,
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (once) observer.unobserve(el)
        } else if (!once) {
          setIsVisible(false)
        }
      },
      { threshold }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [once, threshold])

  const directionMap = {
    up: `translateY(${distance}px)`,
    down: `translateY(-${distance}px)`,
    left: `translateX(${distance}px)`,
    right: `translateX(-${distance}px)`,
    none: 'none',
  }

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'none' : directionMap[direction],
        transition: `opacity ${duration}ms cubic-bezier(0.33, 1, 0.68, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.33, 1, 0.68, 1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}
