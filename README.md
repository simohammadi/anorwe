# anorwe

Marketing and lead-generation site for **anorwe**, a software engineering studio of senior engineers
with mission-critical experience, at [anorwe.com](https://anorwe.com). Anor is Sindarin for sun. A live
three.js sun sits in the hero, travels up as you scroll and docks into the header as the Horizon logo.

## Stack

- [Bun](https://bun.sh) for package management and scripts
- [Vite](https://vite.dev) + [React 19](https://react.dev) + TypeScript
- [Chakra UI v3](https://chakra-ui.com) with a night palette, Newsreader, Inter and JetBrains Mono
- [three.js](https://threejs.org) for the sun, loaded only when the live sun runs
- [Web3Forms](https://web3forms.com) for serverless lead delivery with spam filtering and rate limiting
- [Cloudflare Pages](https://pages.cloudflare.com) building from GitHub

## Local development

```bash
bun install
bun dev
```

Then open the printed local URL.

## Contact form / email

The contact form posts to Web3Forms. You need a (free) public access key:

1. Go to [web3forms.com](https://web3forms.com) and enter the email address where you
   want to receive leads — they email you an **access key** (a UUID).
2. For local dev, copy `.env.example` to `.env` and set:

   ```
   VITE_WEB3FORMS_KEY=your-access-key
   ```

3. For production, set `VITE_WEB3FORMS_KEY` as a build variable on the Cloudflare Pages
   project. The key is a public client-side key and is safe to expose.

Web3Forms handles spam filtering and rate limiting on their side, and a hidden
honeypot field is included client-side as a first line of defense.

## Build

```bash
bun run build      # outputs to dist/
bun run preview    # preview the production build
```

## Deployment

The site is hosted on Cloudflare Pages, connected to this GitHub repo. Every push to `main`
builds and deploys to `https://anorwe.com/`; other branches get preview URLs.

Pages project build settings:

- **Build command:** `bun run build`
- **Build output directory:** `dist`
- **Environment variable:** `VITE_WEB3FORMS_KEY` = your Web3Forms access key

`public/_headers` sets long-lived caching for the hashed files in `/assets/`.

### Domain

anorwe.com is registered with Amazon Registrar, with its nameservers pointed at Cloudflare so the
root domain can be served by Pages. `anorwe.com` and `www.anorwe.com` are both custom domains on the
Pages project, and `www` redirects to the root domain.

## Editing content

All copy (hero, services, about, the name, process, FAQs, contact) lives in
[`src/content/site.ts`](src/content/site.ts). Edit that one file to update the site.

## The sun

- [`src/sun/sun.ts`](src/sun/sun.ts) is the three.js sun: shader surface, corona, flares and the Horizon bands.
- [`src/components/Sky.tsx`](src/components/Sky.tsx) drives the scroll choreography from the hero's
  `#sun-anchor` to the header's `#dock` mark. Any element with `data-intent` makes the sun reach toward it.
- Reduced motion, low-power devices, data saver and browsers without WebGL get the Horizon logo in the hero
  and header, and three.js is never downloaded. Add `?static` to the URL to preview it.
- The brand board in [`brand/`](brand/) is an internal reference. It is served by `bun dev` at `/brand/`
  and is not part of the production build.
