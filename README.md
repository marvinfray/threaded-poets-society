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

## Walt — the poetic assistant

[Walt](/walt/) is an LLM-driven poetic guide available at `/walt`. He helps
visitors explore feelings, images, metaphors, and memories, then gently shapes
those reflections into poems. Walt is not a generic chatbot; he listens, reflects,
and asks one good question at a time.

### How Walt works

Walt's browser interface talks to a small **Cloudflare Worker** (`worker/index.js`)
that proxies requests to Hugging Face. The Worker holds the HF token as a secret —
the browser never sees it.

- **Model:** [Qwen/Qwen2.5-1.5B-Instruct](https://huggingface.co/Qwen/Qwen2.5-1.5B-Instruct) — open-source, free tier
- **Proxy:** Cloudflare Worker — free tier (100 k requests/day)
- **No paid API required. No data collected.**

The Worker URL is baked into the built site at deploy time by Eleventy, read from
the `WALT_PROXY_URL` repository secret.

### First-time setup (Cloudflare Worker)

You will need:

| Secret | Where to get it |
|--------|-----------------|
| `CF_API_TOKEN` | Cloudflare dashboard → My Profile → API Tokens → Create token → **Edit Cloudflare Workers** template |
| `CF_ACCOUNT_ID` | Cloudflare dashboard → right sidebar → copy Account ID |
| `HF_TOKEN` | [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens) → New token → **Read** |

Add all three as **repository secrets** (Settings → Secrets and variables → Actions).

Then:

1. Push to `main` — the **Deploy Walt Worker** workflow runs, deploys the Worker,
   and prints the Worker URL in its logs (e.g. `https://walt-proxy.yourname.workers.dev`).
2. Add that URL as a fourth repository secret: `WALT_PROXY_URL`.
3. Trigger a site rebuild (push anything, or re-run the Pages workflow) — Eleventy
   bakes the URL into `/walt` and Walt is live.

### Walt system prompt

Walt's character and constraints live in `walt-system-prompt.md` at the project
root. The prompt is also inlined into `walt.njk` for the current static build.
When a server-side component is added, the prompt should be loaded server-side
and the HF token should move to a backend proxy.

### Future: poem submission

The **Prepare poem for submission** button on the Walt page is a placeholder.
The intended flow once a backend exists:

1. User finishes drafting a poem with Walt.
2. Walt helps format it (title, attribution, tags, context note).
3. User approves and clicks submit.
4. A backend endpoint opens a pull request to the `poems/` directory.
5. The poem enters the normal review/merge flow.

See `walt-system-prompt.md` for full architecture notes.

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
