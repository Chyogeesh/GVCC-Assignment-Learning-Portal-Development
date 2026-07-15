import { useEffect } from 'react'

/**
 * Best-effort, browser-based screenshot/recording deterrence.
 *
 * Browsers deliberately do NOT expose an API to block the OS-level
 * screenshot key, a phone's screenshot gesture, or a camera pointed at the
 * screen. True prevention only exists on native platforms with OS support
 * (see README "Screenshot Protection Approach").
 */
export default function ScreenshotProtection() {
  useEffect(() => {
    const blockContextMenu = (e) => e.preventDefault()

    const blockKeys = (e) => {
      const key = e.key
      const combo = (e.ctrlKey || e.metaKey) && ['p', 's', 'u'].includes(key.toLowerCase())
      const devtools =
        key === 'F12' ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && ['i', 'j', 'c'].includes(key.toLowerCase()))
      const printScreen = key === 'PrintScreen'

      if (combo || devtools || printScreen) {
        e.preventDefault()
      }
    }

    document.addEventListener('contextmenu', blockContextMenu)
    document.addEventListener('keydown', blockKeys)
    document.body.classList.add('no-select')

    return () => {
      document.removeEventListener('contextmenu', blockContextMenu)
      document.removeEventListener('keydown', blockKeys)
      document.body.classList.remove('no-select')
    }
  }, [])

  return null
}
