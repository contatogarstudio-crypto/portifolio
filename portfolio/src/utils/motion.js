/** Lightweight runtime hint: no browser fingerprinting, no stored preferences. */
export function isLiteMotionDevice() {
  if (typeof window === 'undefined') return false
  const override = new URLSearchParams(window.location.search).get('motion')
  if (override === 'lite') return true
  if (override === 'full') return false
  const cores = navigator.hardwareConcurrency || 0
  const memory = navigator.deviceMemory || 0
  return Boolean(
    navigator.connection?.saveData ||
    (memory > 0 && memory <= 4) ||
    (cores > 0 && cores <= 2) ||
    (cores > 0 && cores <= 4 && memory > 0 && memory <= 8)
  )
}
