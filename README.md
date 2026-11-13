# edwardmartimbor.com

Static author site for Edward J. Martimbor. Plain HTML, CSS and JavaScript — no build step, no server, no dependencies.

## Structure

| Route | File |
| --- | --- |
| `/` | `index.html` — author homepage + featured Steady Under Pressure collection |
| `/books/` | `books/index.html` — catalog, published + in development |
| `/books/steady-under-pressure/` | book details + Chapter 1 sample |
| `/books/steady-under-pressure-workbook/` | workbook details + exercise sample |
| `/courses/steady-under-pressure/` | course status + free lesson |
| `/about/` | author bio |
| `404.html` | not-found page (most static hosts pick this up automatically) |

Shared files: `assets/css/site.css`, `assets/js/site.js`, covers in `assets/img/` (WebP + JPEG, 300 and 600 px).

## The one file you edit: `assets/js/config.js`

- **Amazon links** — paste the verified product URL into `retailers.amazon` for each book. The "Buy on Amazon" button appears automatically; while the value is `null` the button stays hidden.
- **Sample PDFs** — put the PDFs in `samples/` and set `samplePdf`, e.g. `"samples/steady-under-pressure-chapter-1.pdf"`. The download button appears and the "coming soon" note disappears.
  - Main book: title page + Chapter 1.
  - Workbook: the three-exercise companion sample.
- **Course** — leave `status: "in-development"` and `enrollUrl: null` until checkout and server-side access checks are live on the course platform. Only then set `status: "open"` and the enrollment URL.

## Deploy

Any static host works. Upload the whole folder as the site root.

- **Netlify / Cloudflare Pages**: drag and drop the folder, or connect a Git repo with no build command and publish directory `/`.
- **GitHub Pages**: push to a repo, enable Pages on the main branch root.
- Then point `edwardmartimbor.com` DNS at the host and enable HTTPS.

Canonical URLs, Open Graph tags, `sitemap.xml` and `robots.txt` already use `https://edwardmartimbor.com`. If the final domain differs, search-and-replace it.

## Pre-launch checklist

- [ ] Amazon URLs verified by Edward and added to `config.js`
- [ ] Both sample PDFs added; open each one and check the first page
- [ ] Click every buy and sample button on the live site
- [ ] Test on a phone (menu button, layouts)
- [ ] Tab through each page with the keyboard (focus ring visible, skip link works)
- [ ] Share a page URL in a messaging app to check the preview card
- [ ] Review with Edward before switching DNS

## Privacy

- `/privacy/` holds the privacy policy and a **privacy-request** Netlify form (confirmation page: `/privacy/received/`). In Netlify, add an email notification for that form and answer requests within 30 days.
- The site loads no outside fonts, scripts, analytics or embeds. Keep it that way, or update the privacy policy first.
- Before course enrollment opens, name the course platform and payment provider in the policy's "What I collect" section.
