/**
 * Design Token Apply
 *
 * Reads stored design token overrides from localStorage and applies them
 * as CSS custom properties on :root. Runs on every page load.
 */

const STORAGE_KEY = 'design-tokens-overrides'

try {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (raw) {
    const overrides: Record<string, string> = JSON.parse(raw)
    for (const [prop, value] of Object.entries(overrides)) {
      document.documentElement.style.setProperty(prop, value)
    }
  }
} catch {
  // Silently ignore parse errors — corrupted storage is cleared by the builder
}
