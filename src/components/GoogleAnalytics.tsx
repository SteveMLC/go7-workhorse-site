const MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();

export function GoogleAnalytics() {
  if (!MEASUREMENT_ID) {
    return null;
  }

  return (
    <>
      <script
        key="ga-loader"
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`}
      />
      <script
        key="ga-config"
        dangerouslySetInnerHTML={{
          __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}

          // One guard wraps config + listeners. A duplicate <GoogleAnalytics />
          // mount (nested layout, future code path) would otherwise fire two
          // config calls and two page-view beacons per visit.
          if (!window.__go7WorkhorseGa) {
            window.__go7WorkhorseGa = true;
            gtag('js', new Date());
            gtag('config', '${MEASUREMENT_ID}');

            function go7WorkhorseClickParams(link) {
              var linkText = link.textContent ? link.textContent.replace(/\\s+/g, ' ').trim() : '';
              return {
                destination_href: link.href,
                page_location: window.location.href,
                link_text: linkText ? linkText.slice(0, 100) : undefined
              };
            }

            document.addEventListener('click', function(event) {
              var target = event.target;
              var link = target && target.closest ? target.closest('a[data-analytics-download]') : null;
              if (!link || !link.href) return;

              var platform = link.getAttribute('data-analytics-download') || 'unknown';
              var plainPrimaryClick =
                event.button === 0 &&
                !event.altKey &&
                !event.ctrlKey &&
                !event.metaKey &&
                !event.shiftKey;

              if (!plainPrimaryClick) {
                gtag('event', 'download_click', {
                  ...go7WorkhorseClickParams(link),
                  platform: platform,
                  transport_type: 'beacon'
                });
                return;
              }

              gtag('event', 'download_click', {
                ...go7WorkhorseClickParams(link),
                platform: platform,
                transport_type: 'beacon'
              });
              // transport_type:'beacon' survives the navigation; no setTimeout delay.
              window.location.assign(link.href);
            }, true);

            document.addEventListener('click', function(event) {
              var target = event.target;
              var link = target && target.closest ? target.closest('a[data-analytics-outbound]') : null;
              if (!link || !link.href) return;
              var eventName = link.getAttribute('data-analytics-outbound');
              if (!eventName) return;
              gtag('event', eventName, go7WorkhorseClickParams(link));
            }, true);
          }
        `,
        }}
      />
    </>
  );
}
