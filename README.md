# Blue Frost Tech — Landing Page

Static landing page for Blue Frost Tech industrial refrigeration spare parts.

**Live sites:**
- GitHub Pages: https://frigoimpianti-srl.github.io/bluefrosttech-page/
- Production target: https://bluefrosttech.com (GitHub Pages + Cloudflare DNS)

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

### GitHub Pages (automatic)

GitHub Pages is the primary deploy target.

Push to `main` and GitHub Actions deploys automatically:

1. `.github/workflows/deploy.yml` installs Node.js 20
2. runs `npm ci`
3. runs `npm run build`
4. uploads `dist/`
5. publishes the artifact to GitHub Pages

In the GitHub repository settings, keep **Pages -> Build and deployment -> Source** set to **GitHub Actions**.

Local production check:

```bash
npm run build
npm run preview
```

### Cloudflare DNS for `bluefrosttech.com`

Use Cloudflare as the DNS provider, then point the domain to GitHub Pages.

1. Add `bluefrosttech.com` to Cloudflare.
2. Copy existing DNS records from Namecheap, especially any email `MX`, `TXT`, `SPF`, `DKIM`, or `DMARC` records.
3. In Namecheap, change the domain nameservers to the two nameservers assigned by Cloudflare.
4. In Cloudflare DNS, create these website records:

| Type | Name | Target/value | Proxy status |
| --- | --- | --- | --- |
| `A` | `@` | `185.199.108.153` | DNS only |
| `A` | `@` | `185.199.109.153` | DNS only |
| `A` | `@` | `185.199.110.153` | DNS only |
| `A` | `@` | `185.199.111.153` | DNS only |
| `AAAA` | `@` | `2606:50c0:8000::153` | DNS only |
| `AAAA` | `@` | `2606:50c0:8001::153` | DNS only |
| `AAAA` | `@` | `2606:50c0:8002::153` | DNS only |
| `AAAA` | `@` | `2606:50c0:8003::153` | DNS only |
| `CNAME` | `www` | `frigoimpianti-srl.github.io` | DNS only |

5. In GitHub, open **Settings -> Pages -> Custom domain**, set `bluefrosttech.com`, save, then enable **Enforce HTTPS** when GitHub makes it available.

Keep the Cloudflare records as **DNS only** at least until GitHub validates the domain and issues the HTTPS certificate. After that, only enable the Cloudflare proxy if you intentionally want Cloudflare in front of GitHub Pages and have verified redirects and certificate renewal.

### Namecheap FTP fallback

Namecheap FTP deploy is retained only as a rollback path during migration:

```bash
npm run deploy:namecheap
```

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
