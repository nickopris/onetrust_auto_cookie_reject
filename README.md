# Auto Cookie Reject

A Chrome extension (Manifest V3) for testing. It clicks the OneTrust cookie banner's **Reject All** button automatically on any page that uses OneTrust.

## Install

1. Open `chrome://extensions`.
2. Turn on **Developer mode**.
3. Click **Load unpacked** and select this folder.
4. Pin the extension from the puzzle-piece menu so its icon stays in the toolbar.

After changing any file, click the reload icon on the extension's card in `chrome://extensions`.

## On/off switch

Click the toolbar icon to toggle the extension:

- Green icon with an **ON** badge: active.
- Grey icon with an **OFF** badge: does nothing.

The setting is remembered across browser restarts.

## How it works

- Runs on every site (`<all_urls>`), but only clicks OneTrust's reject buttons:
  - `#onetrust-reject-all-handler` (the banner)
  - `.ot-pc-refuse-all-handler` (the preference centre)
- Waits until the button has been visible for 0.8 seconds before clicking, so OneTrust has finished showing the banner.
- Retries until the banner closes, then stops watching the page after 20 seconds.
- If the banner closes but OneTrust's dark overlay (`.onetrust-pc-dark-filter`) is left on screen, the extension hides it. This happens on domains not yet registered in OneTrust, such as dev sites, where consent isn't saved.

Each action is logged to the DevTools console with the `[Auto Cookie Reject]` prefix.

## Notes

- On domains not registered in OneTrust, consent isn't saved, so the banner returns on every page load and the extension clicks it each time.
- Sites whose OneTrust setup has no Reject All button on the banner are left alone.

## Files

| File | Purpose |
| --- | --- |
| `manifest.json` | Extension configuration and permissions |
| `content.js` | Finds and clicks the reject button, removes a leftover overlay |
| `background.js` | Toolbar on/off switch, icon and badge |
