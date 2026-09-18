---
name: wave-radio
description: "Conventions for this Wave static radio app. Use when editing the player, station list, filters, cover art, or Media Session integration. Covers: stations.js schema and coverarts slug convention, lockscreen/Dynamic Island artwork with default fallback, horizontal scrollable country+category filter bars, clean version URLs (car/ classic/ sk/ subfolders with base tag), HLS playback with native fallback, filtered-list prev/next wrapping, and last-station persistence. Do not apply to classic/ / sk/ (alternate themes, leave untouched unless asked)."
license: MIT
metadata:
  author: arazgray
  scope: wave
---

# Wave Radio

No-build static app. Clean URLs via one folder per version (so `/wave/car/`
serves the car UI — required for homescreen installs). Files that matter:

- `index.html` — the basic app at `/wave/`. Edit this one.
- `car/index.html`, `classic/index.html`, `sk/index.html` — version subfolders.
  Each has `<base href="../">` FIRST in `<head>` (before any relative URL),
  so all shared relative paths (scripts, covers, noise, manifest, sw.js)
  keep resolving to the app root exactly as before.
- Version links are folder-style: root uses `car/` / `classic/` / `sk/`;
  subpages use `./` for Default (never `../` — it resolves against the base
  tag to the domain root) and bare `classic/` / `sk/` / `car/` for siblings.
  Placement: `index.html` header byline, classic under brand bar, sk inside
  radio-face, car in footer (protects zero-scroll). Labels: Default / Classic
  / SK / Car. Style links per theme.
- Per-version manifests at root (`manifest-car.json`, `manifest-classic.json`,
  `manifest-sk.json`): `start_url` points at its own folder so each homescreen
  install launches its version; icons/theme per theme. Subpages link their own
  manifest, never the shared `manifest.json` (classic previously had none —
  it has icon + manifest + theme-color now).
- `car/index.html` — driving UI. Zero-scroll, giant controls, presets; see "Car UI" below.
- `stations.js` — `const stations = [...]`, loaded before the inline script.
- `coverarts/<slug>.jpg` — per-station covers (local only, never external URLs).
- `cover-art-placeholder.jpg` — 1080x1080 JPEG default cover in root. Media Session only, never shown in list UI.
- `classic/`, `sk/` — alternate themes. Leave alone unless explicitly asked.
  (Live at `classic/index.html`, `sk/index.html`; same for car.)
- `noise.mp3` — tuning static (~300KB). Preloaded + cached, looped while a
  station connects. classic/sk/car only, never index.html; see "Tuning static".
- `hls.js`, `sw.js`, `manifest.json`, `icon.svg`, `equalizer.gif` — infra, don't touch.

## Station schema (`stations.js`)

Every station: `name`, `description`, `country`, `url`, `category`, `quality`, `cover`.

- `cover: './coverarts/<slug>.jpg'` — slug is lowercase ASCII, hyphen-separated, no dots:
  `Power Türk FM` → `power-turk-fm`, `WLTW 106.7 Lite FM` → `wltw-106-7-lite-fm`,
  `America's Country` → `americas-country`.
- Keep `coverarts/.gitkeep` so the empty folder survives in git.

## Media Session artwork (lockscreen / Dynamic Island)

No cover art in the list UI — artwork exists only in `MediaMetadata`. Read
`references/media-session-artwork.md` for the snippet. Rules:

- Always append default-cover entries **after** station-cover entries, so the OS
  still has an image when a station file is missing or 404s (a plain
  `station.cover || DEFAULT` fallback does not cover the 404 case).
- Resolve to absolute URLs: `new URL(src, document.baseURI).href`.
- Sizes `96x96`, `128x128`, `192x192`, `512x512`, `type: 'image/jpeg'`.

## Filters UI (`index.html` only)

- Derive both lists the same way, sorted, with an `All` default:
  `[...new Set(stations.map(s => s.country))].sort()` (same for `category`).
- Combined AND filter; label helper (`Country · Category` / `All stations`).
- Horizontal single-row bars, one per group: `.filter-scroll` wraps each list
  (`overflow-x: auto`, hidden scrollbar, touch momentum, edge-bleed padding),
  `.filter-grid` is `display: flex` with `min-width: max-content` and nowrap
  pills. Tapped pill scrolls into view (`inline: 'nearest'`).
- Filters live in a fixed `<nav>` above the scrollable `<main>` (each bar is a
  single row, so the viewport-eating problem of the old 4-per-row grid inside
  `<main>` does not apply). Layout:
  `.app { grid-template-rows: auto auto 1fr auto; }`.

## Playback

- HLS: `hls.js` when `Hls.isSupported()`, else native
  `audio.canPlayType('application/vnd.apple.mpegurl')`, else direct `src`.
  Always `stopAudio()` (destroy HLS, `removeAttribute('src')`, `load()`) before switching.
- Prev/next wraps **within the filtered list** via modulo — no cross-country hopping.
- Persist `{ country, category, name }` in `localStorage` (`wave:lastStation`);
  on restore, reapply saved filters, and fall back to `All`/`All` if the saved
  station is outside the current filters.

## Verification

- `node --check stations.js`, plus extract the inline `<script>` and
  `node --check` that too (pad a `const stations=[];` stub first).
- For artwork logic, stub `document.baseURI` and assert: no-cover → default
  only; with-cover → station entries first, default entries after.

## Tuning static (`noise.mp3`; classic/sk/car only, never index.html)

- At init, fetch `noise.mp3` once (~300KB → ~415KB base64), store the data URL
  in `localStorage` (`wave:noise`), and point a dedicated looped
  `noiseAudio` element (`volume: 0.2`, `preload: auto`) at it. On later loads,
  use the cached copy and skip the network. Quota errors fall back to memory;
  fetch failure falls back to plain `'noise.mp3'` src. All guarded try/catch.
- `playStation`: `stopAudio()` first, then `startNoise()` right when the
  stream load begins (resets `currentTime`, swallows play() rejections —
  the call always follows a user gesture or active playback).
- `pauseNoise()` on stream success AND inside `stopAudio()` (covers manual
  stop and load errors, since error paths route through `stopAudio()`).

## Car UI (`car/index.html`)

Distraction-free driving layout. Rules, in priority order:

- Zero scroll: `body { overflow: hidden }`, everything fits one viewport
  (`grid-template-rows: auto minmax(0, 1fr) auto auto auto`).
- Dark amber-on-black only (glare-free, night-safe). Status pill color-coded:
  grey STOPPED / pulsing amber LOADING / green PLAYING.
- Giant targets: transport buttons `min-height: 104px`, presets `78px`,
  voice toggle `56px`. One-glance station name via
  `clamp(2rem, 8vw, 3.4rem)` + 2-line clamp, `aria-live="polite"` stage.
- No filters while driving: prev/next cycles ALL stations (modulo).
- 6 presets, car-stereo behavior: tap = play, 650ms hold = save current
  (vibrate + green flash + spoken confirm). Stored as names in
  `wave:carPresets`; unresolvable names render as disabled "Empty".
  Suppress the synthetic `click` after pointer handling to avoid double-play.
- Wake Lock while playing (`navigator.wakeLock.request('screen')`),
  released on stop, re-acquired on `visibilitychange`. All in try/catch.
- Spoken station names via `speechSynthesis` (cancel before speak),
  toggle in `wave:carAnnounce` (default on), only on user-initiated change —
  never on silent restore.
- Shares `wave:lastStation` with `index.html` (same shape); if nothing
  selected, Play starts station 0.
- Landscape short screens: presets collapse to a single 6-column row,
  hint line hidden.
