# Threaded Poets Society

A living poetry portfolio, built with [Eleventy](https://www.11ty.dev/) and published automatically to GitHub Pages. The thread continues.

---

## Running locally

```bash
npm install
npm start
```

The site runs at `http://localhost:8080`. Eleventy watches for changes and reloads automatically.

---

## Adding a new poem

1. Create a new `.md` file in the `poems/` folder
2. Add frontmatter (see reference below)
3. Write the poem in the body
4. Commit and push to `main`
5. GitHub Actions builds and publishes automatically — nothing else needed

### Frontmatter reference

```yaml
---
title: To Lie
date: 2026-03-31
tags: [love, death, family]
commit_note: "a wish that death might feel like falling asleep beside the one you love; that all who came before, grew alongside, and will carry you forward might gather in that same stillness"
---
```

| Field         | Required | Description |
|---------------|----------|-------------|
| `title`       | Yes      | The poem's title, displayed on the page and in the listing |
| `date`        | Yes      | Date in `YYYY-MM-DD` format — used to sort poems newest first |
| `tags`        | No       | Thematic tags, e.g. `[love, grief, sea]` |
| `commit_note` | No       | The reflection behind the poem — not a description but a quiet note displayed beneath the poem and in the listing |

### Formatting the poem body

Use a blank line between stanzas. Within a stanza, line breaks in the rendered output require either two trailing spaces or a markdown hard break.

For poems with section headings (e.g. roman numerals), use `*i.*` in italic — Eleventy will render these naturally.

---

## Project structure

```
poems/              ← all poem files live here
_includes/
  layouts/
    base.njk        ← HTML shell (head, nav, footer)
    home.njk        ← home page layout (poem listing)
    poem.njk        ← individual poem layout
_data/
  site.json         ← global site metadata (name, epigraph, URL)
src/
  css/
    style.css       ← all styles (no frameworks)
.github/
  workflows/
    deploy.yml      ← GitHub Actions build and deploy pipeline
.eleventy.js        ← Eleventy configuration
package.json
index.njk           ← home page entry point
about.md            ← about page
```

---

## Deploy pipeline

Every push to `main` triggers the GitHub Actions workflow at `.github/workflows/deploy.yml`. It:

1. Checks out the repository
2. Installs Node dependencies (`npm ci`)
3. Runs the Eleventy build (`npm run build`)
4. Uploads the `_site/` output as a Pages artifact
5. Deploys to GitHub Pages via the Actions source

GitHub Pages must be configured to use **GitHub Actions** as the source (Settings → Pages → Source → GitHub Actions). No manual deployment is ever needed.

---

## Tech stack

- **[Eleventy (11ty)](https://www.11ty.dev/)** — static site generator
- **Nunjucks** — templating
- **Plain CSS** — no frameworks, no Tailwind
- **No client-side JavaScript**
- **EB Garamond** (poem body) + **DM Sans** (navigation/metadata) via Google Fonts

---

## What this is

The Threaded Poets Society is a gathering of poems. The name comes from an old idea: that the poet is a needle and thread, stitching the living to the dead, the spoken to the unspeakable. These poems are published here because a poem, once made, should not remain private.

The project is open. Add your voice.
