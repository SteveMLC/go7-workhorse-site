# Go7 Workhorse site

Product door for [Go7 Workhorse](https://github.com/go7studio/Go7-Workhorse).

This is a download page, not the desk. The desk is a native Windows and macOS window.

- Live: https://go7workhorse.com
- `go7desk.com` redirects here
- Installers come from GitHub releases

```
npm install
npm test
npm run dev
```

## Analytics

GA4 runs when `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set.

- Production property: `Go7 Workhorse`
- Production stream: `go7workhorse.com`
- Measurement ID: `G-VCG5F1M7MB`

## Live-site monitor

`npm run monitor` fetches the live site and asserts four facts: HTTP success,
the GA4 measurement id, the SoftwareApplication JSON-LD, and the `download_click`
event. It reads the page and its first-party scripts only — it changes nothing.
Point it elsewhere with `MONITOR_URL=https://preview... npm run monitor`.

The check logic is pure and covered by `src/lib/monitor.test.ts` in `npm test`.
A daily GitHub Actions run (`.github/workflows/live-monitor.yml`) runs the same
command on a schedule and on manual dispatch.
