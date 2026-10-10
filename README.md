# Kanish Mahato portfolio: Sumi and washi (ink on paper)

A static website: plain HTML, CSS and JavaScript, no build step.

## Parallax

On load, the brush-circle video grows from a single point, turning, until the circle settles at full size, and a red seal is stamped beside it. As you scroll, the clip scrubs backwards, so the circle turns and shrinks into the distance while three layers of ink-wash mountains drift at different speeds. Your name rises in letter by letter, sections settle in like ink as they arrive, a thin ink line at the top shows how far you've read, and on desktop the cursor is a small ink drop. The vertical chapter titles stay pinned beside each section, and the contact section has a 3D cherry tree that turns as you scroll past.

Visitors who turn on "reduce motion" in their system settings get a still version.

## Files

- `index.html`: page structure
- `styles.css`: colours, fonts and layout
- `content.js`: **all the text on the site** (projects, experience, skills, education, contact). Edit this file to update the portfolio.
- `main.js`: draws the scenery and fills in the content
- `enso.webm`, `enso.mp4`, `enso-poster.webp`: the trimmed brush-circle clip (two formats for browser support) and its still frame
- `tree.js`: the 3D cherry tree in the contact section (loads three.js from jsDelivr)
- `common.js`: parallax, contact form and copy-email button, shared by all four designs

## Things to fill in

1. **Project links:** each project in `content.js` links to your GitHub profile. Replace each `link` with the project's own repo or demo.
2. **Contact form:** create a free EmailJS account (https://www.emailjs.com), then put your service ID, template ID and public key in the `emailjs` section of `content.js`. Until then, the form tells visitors to email you directly.

## Video licence

The brush-circle clip is a preview file you supplied. Make sure you have the rights to use it on a public site (license the full version from its source) before publishing.

## Run locally

Open `index.html` in a browser, or serve the folder:

```
python -m http.server 8000
```

then open http://localhost:8000.

## Deploy

Upload the folder as it is to any static host: GitHub Pages, Netlify, Vercel or Cloudflare Pages.
For GitHub Pages: push these files to a repo, then go to Settings, Pages, and choose "Deploy from a branch".
