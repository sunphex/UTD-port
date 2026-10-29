# Utkarsh Dixit — Portfolio

Single-page portfolio: plain HTML, CSS and GSAP (ScrollTrigger), no build step.

## Run locally

Open `index.html`, or serve the folder (for example with the VS Code Live Server extension or `python3 -m http.server`).

## Still to fill in

- GitHub URL in the Contact section (`data-todo` link).

Project screenshots live in `assets/work/<slug>.jpg` (16:10); replace a file to update its card.

## Structure

- `index.html` — all content (hero, about, expertise, work, experience, contact)
- `css/style.css` — styles and colour tokens (`--gold`, `--paper`, `--ink` at the top)
- `js/main.js` — loader, cursor, liquid hero, elastic string, floating chips, drip heading, stacking cards
