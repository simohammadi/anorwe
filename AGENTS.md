## Learned User Preferences

- Use Bun and Vite for tooling; site is a Chakra UI React SPA
- No parentheses in site copy; avoid parenthetical asides like "(messy data, unclear ROI, ...)"
- Copy tone: confident, concrete, outcome-driven, no fluff, no emojis
- Section content should be centered on the page and look the same across screen sizes; headings need enough line height that lines don't overlap
- Prefer targeted spacing fixes, e.g. horizontal padding only when that's what's needed, rather than blanket padding
- Animations should feel organic with some entropy, e.g. brownian motion and particle separation, never collapsing or clumping into a point
- Visual effects should be subtle and not overdone, e.g. faint background stars; the sun should not dominate focus
- Mobile must work well; verify layouts at phone sizes
- Keep sun storytelling restrained: the logo, the sun animation and the "From dawn to daylight" process carry it; avoid light metaphors in headings and body copy
- Start with branding guidelines and options to choose from before building

## Learned Workspace Facts

- Stack: Vite + React 19 + TypeScript strict + Chakra UI v3 + Bun, with three.js for 3D
- Repo is github.com/simohammadi/anorwe, hosted on a Cloudflare Pages project named anorwe built from main; build `bun run build` with Bun, output `dist`
- Contact/lead form posts to Web3Forms for email delivery and rate limiting, see src/lib/web3forms.ts; access key is the VITE_WEB3FORMS_KEY build variable on the Pages project
- Site copy and structured content live in src/content/site.ts; the site has no stats or case studies until real ones exist
- Project was rebranded from "swat dev" to "anorwe" at anorwe.com; anorwe means sun in a Tolkien language
- Positioning: a software agency of senior engineers with mission-critical experience, not an AI/ML consultancy; AI is one service among several
- A three.js brand board lives in brand/ with sun.js and index.html; it is an internal reference served by dev only, not deployed
- The live site ports the board: src/sun/sun.ts is the sun, src/components/Sky.tsx docks it from the hero #sun-anchor into the header #dock mark, and src/lib/sky.ts decides static mode, previewable with ?static
- As the sun docks, Sky.tsx collapses the hero's empty sun space through the --collapse and --docking CSS vars, timed so docking completes as the next section reaches the header, and handles in-page hash links so they land on their sections after the collapse
- anorwe.com is registered at Amazon Registrar with nameservers on Cloudflare so the apex can serve Pages; www 301-redirects to the apex via a zone redirect rule plus a proxied placeholder www DNS record; Vite base is '/'; contact email is hello@anorwe.com
- Chosen brand decisions: Horizon logo mark, night-based palette, tagline "Clarity first. Then momentum.", Newsreader display font replacing Fraunces
- Sun interaction concept: the sun follows the page on scroll and merges into the Horizon logo in the header, plus a "Flare on intent" effect where the sun reaches toward hovered buttons
