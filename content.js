chrome.storage.local.get({ enabled: true }, ({ enabled }) => {
  if (!enabled) return;

  // OneTrust reject buttons: the banner, then the preference centre.
  const SELECTORS = ['#onetrust-reject-all-handler', '.ot-pc-refuse-all-handler'];

  const isVisible = (el) => {
    const r = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none';
  };

  const findButton = () => {
    for (const sel of SELECTORS) {
      const el = document.querySelector(sel);
      if (el && isVisible(el)) return el;
    }
    return null;
  };

  // Only click once the button has been visible for a moment: clicking while OneTrust is still
  // animating the banner in can leave its dark overlay behind.
  const SETTLE_MS = 800;
  let visibleSince = 0;
  let lastClick = 0;
  const tryClick = () => {
    const btn = findButton();
    if (!btn) { visibleSince = 0; return; }
    if (!visibleSince) visibleSince = Date.now();
    if (Date.now() - visibleSince < SETTLE_MS || Date.now() - lastClick < 1000) return;
    lastClick = Date.now();
    btn.click();
    console.log('[Auto Cookie Reject] clicked:', btn);
  };

  // Safety net: after our click the banner is gone but the overlay stays. Happens on domains not yet
  // registered in OneTrust (e.g. dev sites), where consent isn't saved and the banner doesn't close cleanly.
  const cleanUp = () => {
    if (!lastClick || findButton()) return;
    const banner = document.querySelector('#onetrust-banner-sdk');
    if (banner && isVisible(banner)) return;
    document.querySelectorAll('.onetrust-pc-dark-filter').forEach((el) => {
      if (isVisible(el)) {
        el.style.setProperty('display', 'none', 'important');
        console.log('[Auto Cookie Reject] removed leftover overlay');
      }
    });
  };

  const tick = () => { tryClick(); cleanUp(); };
  const observer = new MutationObserver(tick);
  observer.observe(document.documentElement, { childList: true, subtree: true, attributes: true });
  const timer = setInterval(tick, 250);
  tick();
  // Stop after 20s so it never interferes with normal page use.
  setTimeout(() => { observer.disconnect(); clearInterval(timer); }, 20000);
});
