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

- Production property: `Go7 Workhorse` (550458942)
- Production stream: `go7workhorse.com`
- Measurement ID: `G-VCG5F1M7MB`

### Tracked events

All events fire through a hydration-independent delegated listener baked into the
inline `<script>` in `GoogleAnalytics.tsx`. No React-only `onClick` handlers are
used, so events are captured before and after hydration completes.

| Event | Data attribute trigger | Key params |
|---|---|---|
| `download_click` | `<a data-analytics-download="mac\|windows">` | `platform`, `destination_href`, `transport_type` |
| `repo_click` | `<a data-analytics-outbound="repo_click">` | `destination_href` |
| `llms_txt_click` | `<a data-analytics-outbound="llms_txt_click">` | `destination_href` |

Links that carry these attributes:

- **download_click** — download cards in `LatestRelease`, `DownloadLink` buttons sitewide
- **repo_click** — "Public repo" in nav and footer, "Releases" in footer, hero repo link, "Release notes" and "All releases" on the download page
- **llms_txt_click** — "llms.txt" in the footer

### Verify in GA4

Open GA4 → Reports → Realtime, then on the live site:

- Click a download button → `download_click` appears with `platform` set.
- Click "Public repo" in the nav → `repo_click` appears.
- Click "llms.txt" in the footer → `llms_txt_click` appears.

Use GA4 Admin → DebugView with `?debug=1` appended to the URL for event-by-event inspection.

## Live-site monitor

`npm run monitor` fetches the live site and asserts five facts: HTTP success,
the GA4 measurement id, the SoftwareApplication JSON-LD, the `download_click`
event, and both outbound event names (`repo_click`, `llms_txt_click`).
It reads the page and its first-party scripts only — it changes nothing.
Point it elsewhere with `MONITOR_URL=https://preview... npm run monitor`.

The check logic is pure and covered by `src/lib/monitor.test.ts` in `npm test`.
A daily GitHub Actions run (`.github/workflows/live-monitor.yml`) runs the same
command on a schedule and on manual dispatch.
