import { useEffect, useRef } from "react"
import { reducedMotion, setSun, staticMode } from "@/lib/sky"
import type { SunHandle } from "@/sun/sun"

const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const smooth = (e0: number, e1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)))
  return t * t * (3 - 2 * t)
}

/**
 * The live sun. It starts on the hero's #sun-anchor, travels up with the page
 * and docks into the header's #dock mark, becoming the Horizon logo.
 */
export function Sky() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = ref.current
    if (staticMode || !container) return

    let sun: SunHandle | null = null
    let raf = 0
    let cancelled = false
    const cleanups: (() => void)[] = []

    import("@/sun/sun").then(({ mountSun }) => {
      if (cancelled) return
      sun = mountSun(container)
      setSun(sun)
      start(sun)
    })

    function start(sun: SunHandle) {
      const dock = document.getElementById("dock")
      const anchor = document.getElementById("sun-anchor")
      const heroEl = document.getElementById("top")
      const copy = heroEl?.querySelector<HTMLElement>(".hero-copy")
      if (!dock || !anchor || !heroEl || !copy) return
      const root = document.documentElement
      const nextSection = heroEl.nextElementSibling instanceof HTMLElement ? heroEl.nextElementSibling : null

      const marginOf = (el: Element | null) => (el ? parseFloat(getComputedStyle(el).scrollMarginTop) || 0 : 0)
      let nextMargin = marginOf(nextSection)
      const onResize = () => (nextMargin = marginOf(nextSection))
      addEventListener("resize", onResize)
      cleanups.push(() => removeEventListener("resize", onResize))

      // The hero gives up the space below its copy as the sun travels to the dock,
      // and the sun settles into the logo just as the next section reaches the header.
      const copyBottom = () => heroEl.offsetTop + copy.offsetTop + copy.offsetHeight
      const progress = (y: number) => Math.min(1, y / Math.max(1, copyBottom() - nextMargin))
      const travelAt = (p: number) => smooth(0, 0.68, p)
      const spare = () => Math.max(0, heroEl.offsetHeight - copy.offsetTop - copy.offsetHeight)
      let collapse = 0
      cleanups.push(() => {
        root.style.removeProperty("--collapse")
        root.style.removeProperty("--docking")
      })

      // In-page links land where the section ends up once the space has collapsed.
      const scrollToSection = (el: HTMLElement, behavior?: ScrollBehavior) => {
        const margin = parseFloat(getComputedStyle(el).scrollMarginTop) || 0
        const top = el.getBoundingClientRect().top + scrollY - margin
        if (heroEl.contains(el)) return scrollTo({ top, behavior })
        const s = spare()
        const target = top + collapse
        let lo = 0
        let hi = Math.max(0, target)
        for (let i = 0; i < 24; i++) {
          const mid = (lo + hi) / 2
          if (mid + s * travelAt(progress(mid)) < target) lo = mid
          else hi = mid
        }
        scrollTo({ top: hi, behavior })
      }
      const onClick = (e: MouseEvent) => {
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
        const link = e.target instanceof Element ? e.target.closest<HTMLAnchorElement>('a[href^="#"]') : null
        const el = link?.hash ? document.getElementById(decodeURIComponent(link.hash.slice(1))) : null
        if (!link || !el) return
        e.preventDefault()
        history.pushState(null, "", link.hash)
        scrollToSection(el)
      }
      document.addEventListener("click", onClick)
      cleanups.push(() => document.removeEventListener("click", onClick))
      const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined
      const initial = location.hash ? document.getElementById(decodeURIComponent(location.hash.slice(1))) : null
      if (initial && nav?.type !== "reload" && nav?.type !== "back_forward") scrollToSection(initial, "instant")

      let smoothY = scrollY
      let last = performance.now()
      // The browser restores scroll position shortly after a reload; snap to it instead of animating.
      const settleUntil = last + 1000

      const update = (now: number) => {
        const dt = Math.min(0.05, (now - last) / 1000)
        last = now
        const snap = reducedMotion || now < settleUntil
        smoothY = snap ? scrollY : smoothY + (scrollY - smoothY) * (1 - Math.pow(0.002, dt))
        if (Math.abs(scrollY - smoothY) < 0.1) smoothY = scrollY

        const a = anchor.getBoundingClientRect()
        const hero = {
          x: a.left + a.width / 2,
          y: a.top + scrollY + a.height / 2 - smoothY,
          r: a.width / 2,
        }

        // Horizon mark viewBox is 10 30 100 56 with the sun centred at (60, 76), r = 44.
        const b = dock.getBoundingClientRect()
        const r = b.width * 0.44
        const docked = { x: b.left + b.width * 0.5, y: b.top + b.height * (46 / 56) }
        const horizon = b.top + b.height * (48.6 / 56)
        const perched = { x: docked.x, y: horizon - r }

        // Travel and shrink onto the horizon, go quiet and flat, then sink in as the bands cut through.
        const p = progress(smoothY)
        const travel = travelAt(p)
        const sink = smooth(0.8, 1, p)
        sun.target.x = lerp(hero.x, perched.x, travel)
        sun.target.y = lerp(lerp(hero.y, perched.y, travel), docked.y, sink)
        sun.target.r = lerp(hero.r, r, smooth(0, 0.6, p))
        sun.target.calm = smooth(0.6, 0.8, p)
        sun.target.stripes = smooth(0.84, 1, p)
        sun.view.horizon = p > 0.78 ? horizon : null

        const next = Math.round(spare() * travel)
        if (next !== collapse) {
          collapse = next
          root.style.setProperty("--collapse", `${collapse}px`)
          root.style.setProperty("--docking", travel.toFixed(3))
        }

        raf = requestAnimationFrame(update)
      }
      raf = requestAnimationFrame(update)

      // Flare on intent: the sun reaches toward whatever you're about to click.
      let hovered: HTMLElement | null = null
      const aimAt = (el: HTMLElement) => {
        const r = el.getBoundingClientRect()
        sun.intentOn(r.left + r.width / 2, r.top + r.height / 2)
      }
      const intentOf = (t: EventTarget | null) =>
        t instanceof Element ? t.closest<HTMLElement>("[data-intent]") : null
      const enter = (e: Event) => {
        const el = intentOf(e.target)
        if (el && el !== hovered) {
          hovered = el
          aimAt(el)
        }
      }
      const leave = (e: Event) => {
        const el = intentOf(e.target)
        const next = (e as PointerEvent | FocusEvent).relatedTarget
        if (el && el === hovered && !(next instanceof Node && el.contains(next))) {
          hovered = null
          sun.intentOff()
        }
      }
      const onScroll = () => hovered && aimAt(hovered)
      document.addEventListener("pointerover", enter)
      document.addEventListener("focusin", enter)
      document.addEventListener("pointerout", leave)
      document.addEventListener("focusout", leave)
      addEventListener("scroll", onScroll, { passive: true })
      cleanups.push(() => {
        document.removeEventListener("pointerover", enter)
        document.removeEventListener("focusin", enter)
        document.removeEventListener("pointerout", leave)
        document.removeEventListener("focusout", leave)
        removeEventListener("scroll", onScroll)
      })
    }

    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
      cleanups.forEach((fn) => fn())
      sun?.dispose()
      setSun(null)
    }
  }, [])

  if (staticMode) return null
  return <div ref={ref} className="sky" aria-hidden="true" />
}
