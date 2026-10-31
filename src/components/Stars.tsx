import { useEffect, useRef } from "react"
import { staticMode } from "@/lib/sky"

interface Star {
  x: number
  y: number
  r: number
  a: number
  tw: number
  ph: number
}

/** Faint star field behind the content, a few slowly twinkling, drifting slightly with scroll. */
export function Stars() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    let field: Star[] = []
    let raf = 0
    let seededW = 0
    let lastScroll = -1

    const size = () => {
      const dpr = Math.min(devicePixelRatio, 2)
      canvas.width = innerWidth * dpr
      canvas.height = innerHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const seed = () => {
      seededW = innerWidth
      const area = innerWidth * innerHeight
      field = Array.from({ length: Math.round(area / 8000) }, () => ({
        x: Math.random() * innerWidth,
        y: Math.random() * innerHeight * 2,
        r: 0.35 + Math.random() ** 3 * 0.9,
        a: 0.08 + Math.random() ** 2 * 0.34,
        tw: Math.random() < 0.3 ? 0.4 + Math.random() * 1.2 : 0,
        ph: Math.random() * Math.PI * 2,
      }))
    }

    const draw = (now: number) => {
      const t = now / 1000
      const H2 = innerHeight * 2
      ctx.clearRect(0, 0, innerWidth, innerHeight)
      ctx.fillStyle = "#f6ecdd"
      for (const s of field) {
        const y = (((s.y - scrollY * 0.05) % H2) + H2) % H2
        if (y > innerHeight) continue
        const twinkle = s.tw && !staticMode ? 0.6 + 0.4 * Math.sin(t * s.tw + s.ph) : 1
        ctx.globalAlpha = s.a * twinkle
        ctx.beginPath()
        ctx.arc(s.x, y, s.r, 0, Math.PI * 2)
        ctx.fill()
      }
      lastScroll = scrollY
    }

    const loop = (now: number) => {
      draw(now)
      raf = requestAnimationFrame(loop)
    }

    const onResize = () => {
      size()
      // Only reshuffle on real width changes, not when a mobile toolbar collapses.
      if (innerWidth !== seededW) seed()
      draw(performance.now())
    }

    const onScroll = () => {
      if (staticMode && scrollY !== lastScroll) draw(0)
    }

    size()
    seed()
    if (staticMode) draw(0)
    else raf = requestAnimationFrame(loop)
    addEventListener("resize", onResize)
    addEventListener("scroll", onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      removeEventListener("resize", onResize)
      removeEventListener("scroll", onScroll)
    }
  }, [])

  return <canvas ref={ref} className="stars" aria-hidden="true" />
}
