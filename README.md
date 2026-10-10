# Kanish Mahato portfolio

A static site: plain HTML, CSS and JavaScript. There is nothing to compile, so the build step only checks the files are in place.

## Files

- `index.html`: page structure
- `styles.css`: colours, fonts and layout
- `content.js`: **all the text on the site** (projects, experience, skills, education, contact). Edit this file to update the portfolio.
- `main.js`: the parallax scenery and the animated sections
- `enso.webm`, `enso.mp4`, `enso-poster.webp`: the brush-circle clip (two formats for browser support) and its still frame
- `tree.js`: the 3D cherry tree in the contact section (loads three.js from jsDelivr)
- `common.js`: parallax engine, contact form and copy-email button
- `render.yaml`: Render deploy settings

## Run locally

```
npm install
npm run dev
```

This serves the site at http://localhost:5173. Use a server rather than opening `index.html` directly, because the scroll-driven video needs one.

## Before you publish

1. **Project links:** replace each `link` in `content.js` with the project's own repo or demo.
2. **Contact form:** the EmailJS service ID, template ID and public key live in the `emailjs` section of `content.js`. These are public by design. In the EmailJS dashboard, restrict the key to your domain. Until keys are set, the form tells visitors to email you directly.
3. **Video licence:** the brush-circle clip is a preview file. Make sure you have the rights to use it on a public site.

## Deploy on Render

1. Push this branch to GitHub.
2. In Render, choose **New → Blueprint**, select the repo and branch, then click **Apply**. Render reads `render.yaml`, so you don't need to set the build command by hand.
3. Render gives you a `*.onrender.com` address once the first build finishes.
4. To use your own domain, open the service's **Settings → Custom Domains**, add it, and create the DNS record Render shows at your registrar. HTTPS is issued automatically.

Every push to the deploy branch redeploys the site.

Build command: `npm run build`. Publish directory: `.`

## Deploy elsewhere

The site is plain files, so any static host works: Cloudflare Pages (no build command, output directory `/`), Netlify, Vercel or GitHub Pages.
