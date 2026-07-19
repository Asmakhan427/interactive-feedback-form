# Intern Feedback Form — Web Dev Track Entry Level Task

A client-side feedback form that validates user input, submits it to a mock REST API, and shows loading/success/error states — plus bonus features (recent posts feed, live character counter, responsive layout).

## How to run it

1. Download/clone the three files: `index.html`, `style.css`, `script.js`.
2. Open `index.html` directly in any modern browser (no build step, no server required).

## API used

[JSONPlaceholder](https://jsonplaceholder.typicode.com) — chosen because it requires zero setup/auth, fakes a real POST by returning `201 Created` with a generated `id`, and also supports GET requests, which made it easy to implement both the submission flow and the "Recent Feedback" bonus feature.

## Bonus features implemented

- ✅ **GET + render** — fetches and displays the latest 5 posts from `/posts?_limit=5` below the form, with its own loading and error states.
- ✅ **Character counter** — live count under the message field (`x / 500 characters`), turns orange at 400+ and red at the 500 limit.
- ✅ **Responsive design** — tested at 375px (stacked, full-width, touch-friendly targets) and 1280px (centered card, max-width layout).

## Screenshots

_Add your screenshots here before submitting:_

1. `screenshot-validation-errors.png` — form showing inline validation errors
2. `screenshot-success.png` — success message with returned ID
3. `screenshot-mobile.png` — form at 375px width

## What I learned / what was hard

Add your own 3–6 sentences here about the experience — e.g. handling `response.ok` instead of relying on `fetch` to throw, structuring validation so it runs both live (blur/input) and on submit without duplicating logic, and managing the loading/disabled button state cleanly with try/catch/finally.

## Deployment (optional)

To deploy: push this repo to GitHub, then enable **GitHub Pages** in the repo settings (Settings → Pages → deploy from `main` branch), or drag the folder into [Netlify Drop](https://app.netlify.com/drop). Add the live link here once deployed.
