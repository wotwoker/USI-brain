# USI-Brain Project Page

Static project page for **USI-Brain: Enhancing Underwater Spatial Intelligence via Spatial Data-Driven Vision-Language Modeling**.

## Preview locally

No build step or third-party dependencies are required. From the repository root, run:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Deploy with GitHub Pages

1. Push this repository to GitHub.
2. Open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select the publishing branch (usually `main`) and `/(root)`, then save.

The site is fully static and uses relative asset paths, so it works both on a user site and under a project subpath such as `https://username.github.io/repository/`.

## Main files

- `index.html` — page structure and research content
- `css/style.css` — responsive visual design
- `js/app.js` — navigation, reveal effects, progress, and citation copy
- `assets/` — paper PDF and figures
