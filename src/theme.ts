import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react"

const config = defineConfig({
  globalCss: {
    "html, body": {
      bg: "night",
      color: "bone",
      fontFamily: "body",
    },
    "::selection": {
      bg: "rgba(246,167,48,0.35)",
    },
    html: {
      scrollBehavior: "smooth",
    },
  },
  theme: {
    tokens: {
      fonts: {
        heading: { value: '"Newsreader", Georgia, serif' },
        body: {
          value: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        },
        mono: { value: '"JetBrains Mono", ui-monospace, monospace' },
      },
      colors: {
        night: { value: "#0d1420" },
        dusk: { value: "#4a7593" },
        gold: { value: "#f6a730" },
        flare: { value: "#ffd27a" },
        ember: { value: "#e2662a" },
        rust: { value: "#b5481f" },
        canyon: { value: "#6e2a14" },
        sand: { value: "#e9b98a" },
        bone: { value: "#f6ecdd" },
        char: { value: "#1b1410" },
      },
    },
    semanticTokens: {
      colors: {
        bg: {
          DEFAULT: { value: "#0d1420" },
          panel: { value: "rgba(255,255,255,0.04)" },
        },
        fg: {
          DEFAULT: { value: "#f6ecdd" },
          muted: { value: "rgba(246,236,221,0.66)" },
          subtle: { value: "rgba(246,236,221,0.45)" },
        },
        border: {
          DEFAULT: { value: "rgba(246,236,221,0.12)" },
        },
        glass: { value: "rgba(13,20,32,0.72)" },
      },
    },
  },
})

export const system = createSystem(defaultConfig, config)
