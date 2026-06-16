# The Agency Industrial Complex, 2035

An interactive edition of Ed Tsue's essay on the structural collapse and re-split of the advertising industry.

Static site — vanilla HTML / CSS / JS, no build step, no dependencies.

## Features

- **Readable** — Inter sans-serif, light/dark mode (remembers your choice), reading-progress bar, estimated read time, sticky table of contents with scroll-spy.
- **Highlight & note-taking** — select any passage to highlight it (4 colors) or attach a margin note. Everything persists in `localStorage` on your device. Open the notes drawer (top-right) to browse, jump to, export (Markdown), or clear them.
- **Sources out** — every key claim has an inline `¹` marker linking to a curated "Sources & Further Reading" rail of real, current articles (Omnicom–IPG merger, CMO tenure data, self-serve media platforms, AI displacing entry-level work, procurement/transparency).
- **The Marketer's Portfolio** — an interactive comparison of the central metaphor: creative agencies as hedge funds vs. media agencies as endowments. Tap a row to spotlight the contrast.
- **The Twenty-Year Arc** — a 2025 → 2035 → 2045 timeline of the whale-oil thesis; nodes jump to the relevant act.

## Run locally

```bash
python3 -m http.server 5173
# open http://localhost:5173
```

## Deploy

Static — point Vercel at the repo (no build command, output = root). `vercel.json` only sets clean URLs and a couple of security headers.

## Editing the essay

- Prose lives in `index.html`. Each annotatable block carries a stable `data-pid` — **don't renumber existing pids**, or saved highlights will reattach to the wrong text. Add new pids with fresh ids.
- The portfolio table and source list are data arrays at the top of `app.js` (`PORT_ROWS`, `SOURCES`).
