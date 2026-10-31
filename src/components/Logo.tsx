import { chakra, type HTMLChakraProps } from "@chakra-ui/react"
import { brand } from "@/content/site"

/** Shared SVG symbols for the Horizon mark. Render once near the root. */
export function LogoDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <defs>
        <mask id="horizon-cut" maskUnits="userSpaceOnUse" x="0" y="0" width="120" height="120">
          <rect width="120" height="120" fill="#fff" />
          <rect x="0" y="49.5" width="120" height="3" fill="#000" />
          <rect x="0" y="57.7" width="120" height="4.4" fill="#000" />
          <rect x="0" y="65.7" width="120" height="5.7" fill="#000" />
          <rect x="0" y="78.6" width="120" height="42" fill="#000" />
        </mask>
        <symbol id="horizon" viewBox="10 30 100 56">
          <circle cx="60" cy="76" r="44" fill="currentColor" mask="url(#horizon-cut)" />
          <rect x="12" y="80" width="96" height="4" rx="2" fill="var(--hline)" />
        </symbol>
        <symbol id="horizon-line" viewBox="10 30 100 56">
          <rect x="12" y="80" width="96" height="4" rx="2" fill="var(--hline)" />
        </symbol>
      </defs>
    </svg>
  )
}

interface MarkProps extends HTMLChakraProps<"svg"> {
  /** Draw only the horizon line; the live sun supplies the disc. */
  lineOnly?: boolean
}

/** The Horizon mark. Size it with width; height follows the 100:56 viewBox. */
export function Mark({ lineOnly, ...props }: MarkProps) {
  return (
    <chakra.svg
      display="inline-block"
      color="ember"
      css={{ "--hline": "var(--chakra-colors-sand)" }}
      viewBox="0 0 100 56"
      height="auto"
      flexShrink="0"
      aria-hidden="true"
      {...props}
    >
      <use href={lineOnly ? "#horizon-line" : "#horizon"} width="100" height="56" />
    </chakra.svg>
  )
}

interface LockupProps extends HTMLChakraProps<"span"> {
  markId?: string
  lineOnly?: boolean
}

export function Lockup({ markId, lineOnly, ...props }: LockupProps) {
  return (
    <chakra.span
      display="inline-flex"
      alignItems="center"
      gap="0.32em"
      fontFamily="heading"
      fontWeight="500"
      lineHeight="1"
      letterSpacing="-0.02em"
      color="bone"
      {...props}
    >
      <Mark id={markId} lineOnly={lineOnly} width="1.5em" />
      {brand.name}
    </chakra.span>
  )
}
