# Utkarsh Dixit — Portfolio

Single-page portfolio: plain HTML, CSS and GSAP (ScrollTrigger), no build step.

## Run locally

Open `index.html`, or serve the folder (for example with the VS Code Live Server extension or `python3 -m http.server`).

## Still to fill in

- `assets/profile.jpg` — your photo for the About section (a portrait, roughly 4:5). Until it exists, a "UD" monogram shows instead.
- Project links — each card's **View project** badge points to `#`. Swap in GitHub repos or demo videos.
- LinkedIn / GitHub URLs in the Contact section (`data-todo` links).

## Structure

- `index.html` — all content (hero, about, expertise, work, experience, contact)
- `css/style.css` — styles and colour tokens (`--gold`, `--paper`, `--ink` at the top)
- `js/main.js` — loader, cursor, liquid hero, elastic string, floating chips, drip heading, stacking cards
