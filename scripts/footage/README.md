# Footage

Record the shipped desk, as it is, for the site and for sharing. Playwright's
Electron driver launches the installed app with its own empty userData, so your
real desk is never touched. It does run your real vendors and spends real
leftover.

```
npm run footage:seed                      # 1. project + linked folder (this repo)
npm run footage:bots                      # 2. vendors on the desk (+ a custom key the desk imports itself)
BRIEF="..." TAKE=fanout npm run footage:fanout   # 3. record; writes footage-out/video-fanout/*.webm
python3 scripts/footage/make-gif.py footage-out/video-fanout/<file>.webm public/media/fanout \
  --crop 0:48:1040:672 --width 1040 --mp4width 1040 --fps 12 \
  --seg 17 24 3 --seg 24 86 12 --seg 86 92 1 ...       # 4. cut: start end speed, repeated
```

`WORKHORSE_APP` points at another build (a downloaded release, the Dev app).
`WIN_W`/`WIN_H` set the window; 1040x720 keeps a 1040px GIF at 1:1 pixels.
Pick cut points from a contact sheet (`ffmpeg -vf fps=1/10`), then cut. The
title bar is the top 48px; crop it.

Nothing here fakes a screen. If the desk shows it, it happened.
