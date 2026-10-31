import type { SunHandle } from "@/sun/sun"

interface LowPowerNavigator extends Navigator {
  deviceMemory?: number
  connection?: { saveData?: boolean }
}

const nav = navigator as LowPowerNavigator

export const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

const lowPower =
  (nav.hardwareConcurrency || 8) <= 2 ||
  (nav.deviceMemory || 8) <= 2 ||
  nav.connection?.saveData === true

const hasWebGL = (() => {
  try {
    const c = document.createElement("canvas")
    return !!(c.getContext("webgl2") || c.getContext("webgl"))
  } catch {
    return false
  }
})()

/** Still CSS sun and finished logo; the three.js bundle is never loaded. Preview with ?static. */
export const staticMode =
  new URLSearchParams(location.search).has("static") || reducedMotion || lowPower || !hasWebGL

let sun: SunHandle | null = null

export function setSun(handle: SunHandle | null) {
  sun = handle
}

export function getSun() {
  return sun
}

/** Sends a shockwave out of the sun, e.g. after the contact form is sent. */
export function burst() {
  sun?.burst()
}
