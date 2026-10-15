# Ritika's 22nd Birthday Experience

An interactive, mobile-first birthday web app built with React 19, TypeScript and Tailwind CSS 3.4.
It guides the recipient through six stages, from a sealed envelope to a birthday lounge, with
procedural Web Audio sound, canvas graphics and gesture-driven interactions.

Full build history, design decisions and QA notes: [docs/BUILD_NOTES.md](docs/BUILD_NOTES.md).

## Run it

```bash
npm install
npm run dev        # local dev server with hot reload
npm run build      # type-check + production build into dist/
npm run preview    # serve the production build locally
npm run lint       # oxlint
```

Open `http://localhost:5173` after `npm run dev`. To jump straight to a stage while testing,
append `?stage=N` (1 to 6) to the URL.

## The six stages

| Stage | What happens | Advance trigger |
| :---: | :--- | :--- |
| 1 | The Mystery Envelope: tap the wax seal | Tap envelope or "Open your surprise" |
| 2 | Shhh... The Dark Room: switch the lights on, fairy lights and the bear wake up | "Bring out the cake!" |
| 3 | Make a Wish: tap each flame (or "Blow all candles") | All candles out, then "I made my wish" |
| 4 | Cut the Cake: swipe or drag down the dotted line (70px) or use the fallback button | "Something's growing..." |
| 5 | The Heart Blossom Tree: procedural canvas tree plus a typewriter letter | Tree bloomed, then "Enter Ritika's Lounge" |
| 6 | Birthday Lounge: live milestone ticker, flip cards, balloon pop, fortune cookie | Start over |

The header offers six progress dots for non-linear jumps, a sound toggle and a confetti cannon.

## Personalise it

All copy lives in one place: [src/lib/content.ts](src/lib/content.ts).

- `RECIPIENT`, `AGE`, `BIRTHDAY_LABEL`: name, milestone and the date chip.
- `LETTER`: the typewriter letter shown next to the tree.
- `MEMORY_CARDS`: the four flip cards (emoji, title, note, gradient).
- `FORTUNES`: the fortune cookie messages.

The date of birth used by the milestone ticker is in [src/lib/milestones.ts](src/lib/milestones.ts)
(`BIRTH_DATE`, currently 17 October 2004).

## Project layout

```
src/
  App.tsx                     stage state machine and layout shell
  audio/synth.ts              Web Audio procedural synthesizer (chimes, pops, whoosh)
  audio/music.ts              looping music-box "Happy Birthday" (oscillators only, no files)
  audio/SoundContext.tsx      provider: unlocks audio on the first tap, mute toggle
  audio/useSound.ts           hook used by components
  lib/confetti.ts             canvas-confetti helpers
  lib/milestones.ts           live age / days / breaths calculations
  lib/content.ts              all personalised copy
  components/
    Header.tsx                brand chip, progress dots, sound and confetti controls
    Starfield.tsx             ambient particle canvas
    Cake.tsx                  SVG cake with tappable candles and smoke
    TeddyBear.tsx, FairyLights.tsx
    HeartTree.tsx             space-colonisation blossom tree grown inside a heart, petal physics
    Typewriter.tsx
    stages/                   one component per stage
    lounge/                   ticker, memory cards, balloon game, fortune cookie
```

## Browser support

The build targets Safari 15 / iOS 15 and equivalent Chrome, Firefox and Edge releases.
Browsers block audio until the page is touched, so the music-box tune and the sound effects start on
the first tap or click anywhere (the envelope seal, for example). The speaker button in the header
mutes and unmutes everything. If nothing is audible, check the tab is not muted and system volume is up.
