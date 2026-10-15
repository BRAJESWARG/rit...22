# Ritika's 22nd Birthday Experience: Build Notes

Reference for everything that was built, why it was built that way, and how to change it.
Written 16 October 2026, the day before the birthday (17 October 2026).

- Project folder: `ritika-birthday/` (Vite + React 19 + TypeScript + Tailwind CSS 3.4.17)
- Spec: a PRD markdown supplied in chat (`birthday_experience_prd_and_architecture.md`). It is not
  stored in this repo. It described a single-file HTML app; this is the React/TypeScript port of it.
- Quick start: `npm install`, then `npm run dev` (http://localhost:5173). `npm run build` type-checks
  and writes `dist/`. `npm run preview` serves `dist/` on port 4173. `npm run lint` runs oxlint.
- Testing shortcut: append `?stage=N` (1 to 6) to open any stage directly.

---

## 1. What the app does

A guided six-stage birthday experience, mobile-first, that also lays out for tablet and desktop.

| Stage | Component | What happens | Advances when |
| :---: | :--- | :--- | :--- |
| 1 | `stages/EnvelopeStage.tsx` | Luxury envelope with a pulsing gold glow and an "R" wax seal. Tap opens the flap, slides the letter up, fires confetti and chimes. | 1.1 s after the tap (auto) |
| 2 | `stages/DarkRoomStage.tsx` | Pitch-black room, a snoring teddy bear, an unlit fairy-light string. "Turn on the lights" fades in an amber/purple twilight, lights the string, wakes the bear. | "Bring out the cake!" |
| 3 | `stages/CandlesStage.tsx` | Two-tier SVG cake with Ritika's name and "22 years of awesome". Three candles with flickering flames; tap each (or "Blow all candles") to extinguish with a smoke puff and a whoosh. | All out, then "I made my wish" |
| 4 | `stages/CakeCutStage.tsx` | Dotted slice guide with a bouncing finger hint. Drag or swipe down 70 px to slice; a knife emoji follows the pointer. Halves split apart with a spring curve. Fallback "Slice with knife" button. | "Something's growing..." |
| 5 | `stages/BlossomTreeStage.tsx` | Canvas tree grows inside a heart (see section 4) while a letter types out at 25 ms per character. Replay button. | Tree bloomed, then "Enter Ritika's Lounge" |
| 6 | `stages/LoungeStage.tsx` | Live milestone ticker, four 3D flip cards, balloon-pop mini game, golden fortune cookie, "Start over". | n/a |

Persistent chrome: a glass header with the photo chip, six progress dots (non-linear jumps, visited
dots turn gold), a music/sound toggle, a confetti cannon button, and a full-screen drifting starfield.

---

## 2. Timeline of the work

### Session 1: build
1. Scaffolded with `npm create vite@latest -- --template react-ts`, added Tailwind and canvas-confetti.
2. Wrote the global styles, fonts (Playfair Display, Outfit, Caveat from Google Fonts), the stage
   state machine in `App.tsx`, the header, starfield, the Web Audio synthesizer, confetti helpers,
   milestone maths, all six stages and the four lounge widgets.
3. Visual QA with headless Chrome driven by puppeteer-core (see section 7) at 390, 820 and 1440 px.
   Found and fixed: sliced cake halves pushing the page wider than a phone screen; heart canopy too
   sparse on desktop.
4. Migrated from Tailwind v4 (which the scaffold installed) to Tailwind v3.4.17 with PostCSS and
   Autoprefixer, because the PRD pins 3.4.17 and targets iOS 15, and Tailwind v4 needs Safari 16.4+.
   Set the Vite build target to Safari 15 and added a browserslist entry.
5. Fixed a missing `shimmer` keyframe (Tailwind v3 only emits keyframes for utilities it sees used),
   centred the progress dots between the brand chip and the controls on wide screens.
6. Wrote `README.md`.

### Session 2: follow-ups
7. The run instructions had shell comments after the commands; zsh passed them to vite as arguments.
   Commands are now documented without trailing comments.
8. Tree alignment. The original tree was a wide dome of branches with a heart of blossoms floating
   above it. Rewritten twice: first a boundary-constrained recursive tree (branches only reached the
   lobes, hollow middle), then space colonisation, which fills the heart evenly and traces its outline.
9. Music. The app only had chimes and pops; a looping music-box "Happy Birthday" with a soft chord
   pad was added, with a hardened Safari/iOS audio unlock.
10. Photo thumbnail: header chip, browser/home-screen icons, link-preview image and meta tags.

---

## 3. Project layout and responsibilities

```
ritika-birthday/
  index.html                  viewport, fonts, icons, Open Graph / Twitter meta (uses %VITE_SITE_URL%)
  .env                        VITE_SITE_URL= (empty locally; set to the deployed origin for previews)
  vite.config.ts              react plugin; build.target = es2020 / safari15 / chrome90 / firefox90 / edge90
  tailwind.config.ts          fonts, extra colours, all keyframes and animation utilities
  postcss.config.js           tailwindcss + autoprefixer
  public/                     icon-512.png, apple-touch-icon.png, ritika-thumb.jpg, ritika-og.jpg
  src/
    main.tsx                  React root (StrictMode)
    App.tsx                   stage state (1..6), maxStage for visited dots, ?stage=N support, scroll-to-top
    types.ts                  Stage type and STAGES list (titles for dots)
    index.css                 Tailwind directives, base styles, .glass, .text-shimmer, svg-origin utilities,
                              shimmer keyframes, reduced-motion override
    audio/synth.ts            AudioContext singleton (getAudioContext / peekAudioContext / warmUp) and
                              one-shot sounds: playChime, playPop, playNextMelodyNote, playFanfare,
                              playWhoosh (filtered noise), playLightsOn, playPluck
    audio/music.ts            looping tune: startMusic / stopMusic / isMusicPlaying
    audio/soundCtx.ts         React context object + SoundApi type
    audio/SoundContext.tsx    provider: enabled flag, unlock on first gesture, visibility handling
    audio/useSound.ts         hook
    lib/content.ts            ALL personalised copy: RECIPIENT, AGE, BIRTHDAY_LABEL, LETTER,
                              MEMORY_CARDS, FORTUNES, BALLOONS
    lib/milestones.ts         BIRTH_DATE (2004-10-17 local) and computeMilestones()
    lib/confetti.ts           fireConfettiCannon (3 bursts), burstAt(x, y), sprinkle(ms)
    components/
      Header.tsx              photo chip, dots (44 px targets), sound toggle, confetti button
      Starfield.tsx           fixed full-screen canvas, 60-140 drifting/pulsing particles, DPR aware
      StageShell.tsx          eyebrow + headline + 600 ms entrance animation
      Button.tsx              primary / gold / ghost variants, min 44 px height
      Cake.tsx                SVG cake; candles with flame flicker, hit areas, smoke circles
      TeddyBear.tsx           SVG mascot; awake prop switches eyes, hat wiggle, "zzz"
      FairyLights.tsx         SVG string on a quadratic curve, 13 bulbs with staggered blink
      HeartTree.tsx           the procedural tree (section 4)
      Typewriter.tsx          character-by-character text with caret, onDone
      stages/                 one file per stage
      lounge/MilestoneTicker  updates every second
      lounge/MemoryCards      3D flip (perspective, preserve-3d, backface-visibility)
      lounge/BalloonGame      bobbing balloons, pop animation, confetti at the balloon
      lounge/FortuneCookie    SVG cookie halves swing apart, parchment slides down, random fortune
  docs/BUILD_NOTES.md         this file
```

Dependencies (from `package.json`): react / react-dom 19.2, vite 8.3, typescript 6.0, oxlint,
@vitejs/plugin-react 6, canvas-confetti 1.9.4, tailwindcss 3.4.17, postcss, autoprefixer.
Node 25 and npm 11 were used.

---

## 4. The heart blossom tree (`HeartTree.tsx`)

### Geometry
- Parametric heart: `x = 16 sin^3 t`, `y = -(13 cos t - 5 cos 2t - 2 cos 3t - cos 4t)`. In those units
  the lobes peak at y = -12, the notch is at y = -5, width is 32 (x = +/-16), the bottom tip is y = +17.
- Scale `s` = min((W - 10% W) / 32, (0.96 H - 0.05 H - max(28, 0.12 H)) / 29), so the heart fits
  both axes. Trunk base at 0.96 H; trunk length = min(remaining height, 0.35 H); heart tip sits on
  the trunk top; heart centre `cy = tipY - 17 s`.
- Because the tip is a cusp, the trunk climbs 5 s into the heart before the first fork (`forkY`).
- Two masks are rasterised once with an offscreen canvas and `getImageData`: canopy mask at 0.97 s
  (where branches may grow) and full mask (blossom scatter). Inside tests are array lookups.

### Growth (space colonisation, Runions et al.)
- Attraction points: a uniform fill of the canopy mask, count = clamp(32 x 29 x 3.1, 1200, 2200),
  plus a ring of 260 points on the outline at 0.955 s so twigs reach the silhouette.
- Parameters in heart units: STEP 0.55 s, KILL 0.78 s, INFLUENCE 4.5 s. Each iteration every live
  attractor pulls its nearest node within INFLUENCE (uniform grid lookup); each pulled node grows one
  STEP along the averaged direction (small random jitter; random nudge when pulls cancel); attractors
  within KILL of a new node die. Stops when nothing grows, at 600 iterations, or near 9000 nodes.
- Limb width: pipe model. Each node's width = topW x (leaves below it / total leaves)^0.55, clamped
  between a twig width (~1 px, scaled) and 0.75 x trunk width. Colour lerps from `#4a2810` to `#8a4a36`.
- The whole build takes about 20 ms. It is deterministic per `runId` (mulberry32 seed), so a resize
  (mobile address bar) rescales the same tree instead of growing a different one.

### Blossoms and animation
- Blossoms at 75% of twig tips, 6% of thin nodes, plus clamp(area/2200, 60, 180) uniform scatter.
  Five-petal flowers for ~35%, discs otherwise; colours `#f472b6 #fb7185 #fff1f2 #f9a8d4 #fda4af`.
- Timeline over GROW_SECONDS = 5: trunk 0 to 0.10, branches level by level to 0.82 (GROWTH_END),
  blossoms fade in 60 ms after their twig, scatter between 0.50 and 0.93. `onBloomed` fires at 0.97,
  which enables the "Enter the Lounge" button. Petals (max 42) fall with sine drift from 0.55 on.
- The tree is drawn to an offscreen layer each frame while growing (segments batched into one
  `Path2D` per width bucket) and cached once complete; the main canvas composites layer + petals.
- A heart-shaped glow (7 layered fills at 2.4% alpha) sits behind the canopy, same geometry.
- `canvas.dataset.buildMs` records the last build time for QA.

---

## 5. Audio

- `getAudioContext()` creates the context lazily and calls `resume()` whenever the state is not
  `running` (covers Safari `suspended` and iOS `interrupted`). `warmUp()` plays a one-sample silent
  buffer once inside a gesture (old iOS unlock trick).
- `SoundProvider` listens for `pointerdown`, `touchend` and `keydown` on `window`; the first gesture
  unlocks audio and starts the music if sound is enabled. `visibilitychange` suspends the context when
  the tab is hidden and resumes it when visible.
- Sound is ON by default (the PRD's risk table suggested muted by default; the chime on opening the
  envelope depends on it being on, and the first tap is the unlocking gesture). Flip the `useState(true)`
  in `SoundContext.tsx` to change it.
- Effects: chime (sine + octave, 10 ms attack, exponential decay), pop (240 Hz to 80 Hz sweep),
  arpeggio note (C4 D4 E4 G4 A4 C5 sequence), fanfare, whoosh (band-passed noise) for candles,
  lights-on (sawtooth hum + two chimes), pluck for card flips (C5 D5 E5 G5 by card index).
- Music (`music.ts`): "Happy Birthday to You" in C at 96 BPM as a music-box voice (sine fundamental
  + 2nd and 3rd partials, 12 ms attack, 1.5 x note-length release), soft sine chord pads (C, G, C, F,
  G, C), a 3-beat rest, then it loops. Scheduling uses a 500 ms timer that queues the next pass when
  the current one is within 1 s of ending. `stopMusic()` ramps a master gain to silence over 0.35 s
  and stops queued oscillators. Verified in Chrome by instrumentation: first tap -> one running
  AudioContext and ~99 oscillators scheduled; mute -> no new scheduling; unmute -> restarts.
- Not tested on a real iPhone or in Safari by ear.

---

## 6. Design and responsiveness

- Palette "Ethereal Twilight and Champagne Rose": slate-950 background, glass panels (slate-900 at
  75% + blur), pink-500 to amber-400 gradients for primary actions, pink-300 eyebrows, amber for
  visited dots and the lights stage.
- Fonts: Playfair Display (headlines), Outfit (body/UI), Caveat (handwritten notes, seal, letter).
- Breakpoints: single column by default; `md` (768 px) puts the header on one row and the dark-room
  bear beside the text; `lg` (1024 px) puts the cake beside its controls, the tree beside the letter,
  the lounge games side by side, and the four cards in one row. Content width max 42 rem, 72 rem on lg.
- Touch targets are at least 44 px (header buttons, dots, candle hit boxes, balloons).
- Safe-area padding top and bottom; `viewport-fit=cover`; `user-scalable=no` per the PRD.
- `prefers-reduced-motion` collapses animations and transitions.
- Cake slicing uses Pointer Events (one code path for touch and mouse), `touch-action: none` on the
  slicing area, and a clipped wrapper so the split halves never widen the page.

---

## 7. Verification approach

- `npm run lint` and `npm run build` (tsc -b + vite build) are clean.
- Visual and functional QA used puppeteer-core with the system Chrome
  (`/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`) against `npm run preview`:
  - viewports: phone 390x844 @2x with touch, tablet 820x1180 @2x, desktop 1440x900;
  - a scripted click-through of all six stages (open envelope, lights, blow candles, drag-slice,
    wait for bloom, enter lounge, flip a card, pop a balloon, crack the cookie), screenshots at each
    step, and a check that no page errors or console errors occurred;
  - a tree-only capture after 6.7 s with the build time read from `data-build-ms`;
  - an audio probe that wraps `AudioContext` and `createOscillator` before page load to count
    scheduled oscillators across tap / mute / unmute.
- Plain `chrome --headless --screenshot` is NOT reliable for phone widths: Chrome will not make a
  window narrower than about 500 px and virtual time does not drive `requestAnimationFrame`.
- Those scripts lived in a temporary session folder and are not part of the repo. Minimal recipe to
  recreate: `npm init -y && npm i puppeteer-core`, then

```js
import puppeteer from 'puppeteer-core'
const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' })
const page = await browser.newPage()
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
await page.goto('http://localhost:4173/?stage=1', { waitUntil: 'networkidle0' })
await page.click('button[aria-label="Open the envelope"]')
await new Promise(r => setTimeout(r, 1500))
await page.screenshot({ path: 'stage2.png', fullPage: true })
await browser.close()
```

---

## 8. Decisions, trade-offs and known caveats

- **Tailwind 3.4.17 instead of 4.x.** Required by the PRD and by the iOS 15 target. Consequence:
  `npm audit` reports 7 advisories (2 moderate, 5 high) in Tailwind v3's build-time chain (braces,
  micromatch, chokidar, fast-glob, postcss-selector-parser, postcss-nested). They affect the dev
  toolchain only; nothing from them ships to the browser. The only fix npm offers is Tailwind v4.
- **Tailwind v3 syntax reminders:** `bg-gradient-to-r` (not `bg-linear-to-r`), keyframes live in
  `tailwind.config.ts`, custom utilities in `@layer utilities`. Keyframes referenced only from plain
  CSS (like `.text-shimmer`) must be declared in `index.css` or they are not emitted.
- **No photos originally.** The PRD mentioned extracted video frames and portraits, but none were in
  the workspace, so the envelope, bear, cake and tree are SVG/canvas illustrations. One portrait was
  supplied later and is used only as the thumbnail set (section 9).
- **Share preview URL.** Open Graph images must be absolute URLs for WhatsApp/Facebook. `index.html`
  uses `%VITE_SITE_URL%/ritika-og.jpg`; set `VITE_SITE_URL` in `.env` (or `.env.production`) to the
  deployed origin and rebuild. Empty value = relative path, fine for local work only.
- **Ticker wording.** Until 17 Oct it says "21 years young" and "Days until 22: 1"; on the day it
  shows "Today is the day" and the age flips to 22. Breaths = minutes x 16, heartbeats = minutes x 72.
- **Not verified on a real iPhone.** Everything above was checked in Chrome. Worth a quick pass on
  the actual device, especially the swipe-to-cut gesture and that music starts after the first tap.
- **Envelope auto-advance** uses a timer that is cleared on unmount, so jumping stages mid-animation
  is safe. The lounge fires confetti on entry.

---

## 9. Thumbnail assets

Source: a 1597x1600 portrait (not stored in the repo). Crops made with macOS `sips`:
- square face crop 760x760 at offset y=60, x=500 -> `public/icon-512.png` (favicon, 512 px),
  `public/apple-touch-icon.png` (180 px), `public/ritika-thumb.jpg` (256 px, header chip);
- landscape crop 1597x838 at y=40 -> `public/ritika-og.jpg` (1200x630, link preview).

`Header.tsx` renders the thumb inside the gradient chip (the "R" stays underneath as a fallback).

---

## 10. How to personalise or extend

| Want to change | Where |
| :--- | :--- |
| Name, age, date chip | `RECIPIENT`, `AGE`, `BIRTHDAY_LABEL` in `src/lib/content.ts` |
| The letter under the tree | `LETTER` in `src/lib/content.ts` (typed at 25 ms/char, `speed` prop in `BlossomTreeStage.tsx`) |
| Flip cards, fortunes, balloon colours | `MEMORY_CARDS`, `FORTUNES`, `BALLOONS` in `src/lib/content.ts` |
| Date of birth for the ticker | `BIRTH_DATE` in `src/lib/milestones.ts` |
| Default sound on/off | `useState(true)` in `src/audio/SoundContext.tsx` |
| The tune, tempo, volume | `TUNE`, `PADS`, `BPM`, the `0.075` peak in `src/audio/music.ts` |
| Tree density / speed | `STEP`, `KILL`, `INFLUENCE`, attractor count, `GROW_SECONDS` in `HeartTree.tsx` |
| Colours, fonts, animations | `tailwind.config.ts` and `src/index.css` |
| Cake text | `Cake.tsx` reads `RECIPIENT` and `AGE` |
| Icons and share image | files in `public/`, tags in `index.html` |

Deployment: it is a static site. `npm run build` -> upload `dist/` to Vercel, Netlify, GitHub Pages
or any static host. If it will live under a sub-path (e.g. `/ritika/`), set `base` in
`vite.config.ts` and prefix the asset paths in `index.html` and `Header.tsx` accordingly. Set
`VITE_SITE_URL` before building so link previews work.
