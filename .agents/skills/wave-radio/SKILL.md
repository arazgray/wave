---
name: wave-radio
description: "Conventions for this Wave static radio app. Use when editing the player, station list, filters, cover art, or Media Session integration. Covers: stations.js schema and coverarts slug convention, lockscreen/Dynamic Island artwork with default fallback, 4-per-row country+category filter grids inside the scrollable main, HLS playback with native fallback, filtered-list prev/next wrapping, and last-station persistence. Do not apply to classic.html / sk.html (alternate themes, leave untouched unless asked)."
license: MIT
metadata:
  author: arazgray
  scope: wave
---

# Wave Radio

No-build static app. Files that matter:

- `index.html` — the basic app. Edit this one.
- `car.html` — driving UI. Zero-scroll, giant controls, presets; see "Car UI" below.
- `stations.js` — `const stations = [...]`, loaded before the inline script.
- `coverarts/<slug>.jpg` — per-station covers (local only, never external URLs).
- `cover-art-placeholder.jpg` — 1080x1080 JPEG default cover in root. Media Session only, never shown in list UI.
- `classic.html`, `sk.html` — alternate themes. Leave alone unless explicitly asked.
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

## Filters UI

- Derive both lists the same way, sorted, with an `All` default:
  `[...new Set(stations.map(s => s.country))].sort()` (same for `category`).
- Combined AND filter; label helper (`Country · Category` / `All stations`).
- Grid: `repeat(4, minmax(0, 1fr))`, `gap: 0.35rem`; small pills
  (`padding: 0.3rem 0.4rem`, `font-size: 0.78rem`, ellipsis, nowrap).
- **Filters must live INSIDE the scrollable `<main>`**, above the station list.
  A separate fixed filter row eats the whole mobile viewport and leaves the
  station list at ~0 height with nowhere to scroll.
- Layout: `.app { grid-template-rows: auto minmax(0, 1fr) auto; }`
  (header / scroll area / player); scroll container needs `min-height: 0`,
  `overflow-y: auto`, and `padding-bottom: 2rem` so last stations clear the
  sticky bottom player, which stays a grid row.

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

## Car UI (`car.html`)

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
