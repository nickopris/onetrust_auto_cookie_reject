// Toolbar icon toggles the extension on/off. Green icon + "ON" badge when active, grey + "OFF" when not.
const drawIcon = (on) => {
  const icons = {};
  for (const size of [16, 32]) {
    const ctx = new OffscreenCanvas(size, size).getContext('2d');
    const r = size / 2;
    ctx.fillStyle = on ? '#1e8e3e' : '#9aa0a6';
    ctx.beginPath();
    ctx.arc(r, r, r, 0, Math.PI * 2);
    ctx.fill();
    // Cookie "chips"
    ctx.fillStyle = '#ffffff';
    for (const [x, y] of [[0.35, 0.35], [0.65, 0.45], [0.4, 0.68], [0.68, 0.72]]) {
      ctx.beginPath();
      ctx.arc(x * size, y * size, size * 0.08, 0, Math.PI * 2);
      ctx.fill();
    }
    icons[size] = ctx.getImageData(0, 0, size, size);
  }
  return icons;
};

const render = (enabled) => {
  chrome.action.setIcon({ imageData: drawIcon(enabled) });
  chrome.action.setBadgeText({ text: enabled ? 'ON' : 'OFF' });
  chrome.action.setBadgeBackgroundColor({ color: enabled ? '#1e8e3e' : '#5f6368' });
  chrome.action.setTitle({ title: `Auto Cookie Reject: ${enabled ? 'ON' : 'OFF'} (click to toggle)` });
};

const refresh = () => chrome.storage.local.get({ enabled: true }, ({ enabled }) => render(enabled));

chrome.action.onClicked.addListener(() => {
  chrome.storage.local.get({ enabled: true }, ({ enabled }) => {
    chrome.storage.local.set({ enabled: !enabled });
    render(!enabled);
  });
});

chrome.runtime.onInstalled.addListener(refresh);
chrome.runtime.onStartup.addListener(refresh);
refresh();
