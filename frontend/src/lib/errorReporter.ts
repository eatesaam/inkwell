const APP_ID = process.env.NEXT_PUBLIC_APP_ID || (typeof window !== 'undefined' ? (() => {
  const m = window.location.hostname.match(/preview-([^.]+)/);
  return m ? m[1] : 'unknown';
})() : 'unknown');

const REPORT_URL = process.env.NEXT_PUBLIC_RUNTIME_ERROR_REPORT_URL;

function report(message: string, stack?: string) {
  if (!REPORT_URL) return;
  try {
    fetch(REPORT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        app_id: APP_ID, message, stack,
        url: window.location.href,
        user_agent: navigator.userAgent,
      }),
    }).catch(() => {});
  } catch {}
}

export function initErrorReporter() {
  if (typeof window === 'undefined') return;
  window.onerror = (msg, _src, _line, _col, err) => {
    report(String(msg), err?.stack);
  };
  window.onunhandledrejection = (e) => {
    report(e.reason?.message || String(e.reason), e.reason?.stack);
  };
  const orig = console.error;
  console.error = (...args: any[]) => {
    report(args.map(String).join(' '));
    orig.apply(console, args);
  };
}