# Blue Frost Tech — Landing Page

Static landing page for Blue Frost Tech industrial refrigeration spare parts.

**Live sites:**
- GitHub Pages: https://frigoimpianti-srl.github.io/bluefrosttech-page/
- Production: https://bluefrosttech.com (Namecheap)

## Prerequisites

- Node.js 20+

## Development

```bash
npm install
npm run dev
```

Open http://localhost:5173

The dev server runs image optimization first so `public/photos/` contains WebP/AVIF variants.

## Production build

```bash
npm run build
npm run preview   # optional local check of dist/
```

Output is written to `dist/` — static HTML, minified CSS/JS, optimized images, self-hosted fonts.

## Deploy

### Namecheap (automatic FTP deploy)

1. In Namecheap cPanel → **FTP Accounts**, create or note FTP credentials
2. Copy `.env.example` to `.env` and fill in `FTP_HOST`, `FTP_USER`, `FTP_PASSWORD`
3. Run:

```bash
npm run deploy
```

This builds the site and uploads everything from `dist/` to `public_html/`.

### Namecheap (manual upload)

1. Run `npm run build`
2. Upload **all contents** of `dist/` to `public_html/` via cPanel File Manager

### GitHub Pages

Push to `main` — GitHub Actions builds and deploys automatically.

Enable in repo settings: **Pages → Source: GitHub Actions**.

## Update content

- Edit [`index.html`](index.html) for page structure and copy
- Edit [`src/main.css`](src/main.css) for styles
- Edit [`src/main.js`](src/main.js) for interactions
- Add source photos as JPG in [`photos/`](photos/) — rebuild generates optimized variants
- Replace root [`logo.png`](logo.png) for logo changes

## Project structure

```
index.html          # page markup
src/main.css        # styles + self-hosted fonts (@fontsource)
src/main.js         # scroll nav + contact form
photos/             # source images (JPG, committed)
public/photos/      # optimized WebP/AVIF/JPEG (generated, gitignored)
scripts/            # image optimization (sharp)
dist/               # production output (gitignored)
```
