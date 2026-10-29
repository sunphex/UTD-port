# Utkarsh Dixit — Portfolio

Single-page portfolio: plain HTML, CSS and GSAP (ScrollTrigger), no build step.

## Run locally

Open `index.html`, or serve the folder (for example with the VS Code Live Server extension or `python3 -m http.server`).

## Still to fill in

- Project screenshots — save each as `assets/work/<slug>.jpg` (16:10 works best) and it replaces the title card in that browser frame.
  Slugs: `juris-atlas`, `lawyer-console`, `legal-cv`, `google-ads`, `seo-blog`, `legal-chat`, `linkedin-harvest`,
  `linkedin-viral`, `instagram-viral`, `reddit-quora`, `flix-agent`, `clarity-hub`.
- GitHub URL in the Contact section (`data-todo` link).

## Structure

- `index.html` — all content (hero, about, expertise, work, experience, contact)
- `css/style.css` — styles and colour tokens (`--gold`, `--paper`, `--ink` at the top)
- `js/main.js` — loader, cursor, liquid hero, elastic string, floating chips, drip heading, stacking cards
