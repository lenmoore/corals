# korals

an editorial site for **KORALS — A celebration of coral reefs**, a tribute to Sir David Attenborough's 100th birthday on 8 May 2026, and an invitation to build a reef together.

## what it is

a single-page, dark editorial site (hero / anatomy / time scale / centenary / invitation) served by Vite. specimens are rendered as luminous plates over a dark observatory background — drop in real coral imagery as it arrives.

## running it

```sh
npm install
npm run dev
```

build a static bundle:

```sh
npm run build && npm run preview
```

## adding specimen images

specimens live in `public/haeckel/`. to swap or add:

1. drop a new file into `public/haeckel/`
2. open `index.html`, find the two `<img class="specimen-img" ...>` tags (one in the hero stage, one in `.anatomy-stage`), and update `src` to the new path

both stages currently use the same Haeckel plate as a placeholder. when more images arrive they can each point at different files.

## charity

if you are moved by this, here is a reef organisation we trust: [Coral Reef Alliance](https://coral.org).
