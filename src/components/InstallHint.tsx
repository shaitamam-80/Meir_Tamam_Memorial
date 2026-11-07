import { useEffect, useState } from 'react'
import { Share, Smartphone, X } from 'lucide-react'

/** Chrome's install event is not in the DOM typings yet. */
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const DISMISSED_KEY = 'install-hint-dismissed'

function isStandalone(): boolean {
  const nav = navigator as Navigator & { standalone?: boolean }
  return window.matchMedia('(display-mode: standalone)').matches || nav.standalone === true
}

function isIos(): boolean {
  // iPadOS reports itself as a Mac, so also check for touch.
  return /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
}

function wasDismissed(): boolean {
  try { return localStorage.getItem(DISMISSED_KEY) === '1' } catch { return false }
}

/**
 * A quiet invitation to keep the site on the phone's home screen.
 * Android/Chrome: a button that opens the browser's own install dialog.
 * iPhone: Safari cannot be asked to install, so it shows the two taps instead.
 * Nothing shows on desktop, inside the installed app, or once dismissed.
 */
export function InstallHint() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null)
  // iPhone is known up front; Android only once Chrome offers the install event.
  const [mode, setMode] = useState<'android' | 'ios' | null>(() =>
    !isStandalone() && !wasDismissed() && isIos() ? 'ios' : null,
  )

  useEffect(() => {
    if (isStandalone() || wasDismissed() || isIos()) return

    const onPrompt = (event: Event) => {
      event.preventDefault()
      setInstallEvent(event as BeforeInstallPromptEvent)
      setMode('android')
    }
    const onInstalled = () => setMode(null)
    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  if (!mode) return null

  const dismiss = () => {
    try { localStorage.setItem(DISMISSED_KEY, '1') } catch { /* private mode: just hide */ }
    setMode(null)
  }

  const install = async () => {
    if (!installEvent) return
    await installEvent.prompt()
    await installEvent.userChoice
    setInstallEvent(null)
    setMode(null)
  }

  return (
    <aside aria-label="שמירת האתר בטלפון" className="px-4 pb-10">
      <div className="relative max-w-md mx-auto memorial-card text-center">
        <button
          type="button" onClick={dismiss} aria-label="סגירה"
          className="absolute top-2 end-2 p-2 rounded-full text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>
        <Smartphone className="w-7 h-7 mx-auto text-accent" strokeWidth={1.5} aria-hidden="true" />
        <p className="font-heading text-lg text-primary mt-3">לשמור את האתר בטלפון</p>
        <p className="text-muted-foreground text-sm mt-1 leading-relaxed">כך תוכלו לחזור אליו בלחיצה אחת, גם בלי קליטה.</p>

        {mode === 'android' ? (
          <button
            type="button" onClick={install}
            className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3 font-semibold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          >
            הוספה למסך הבית
          </button>
        ) : (
          <p className="mt-4 text-foreground leading-relaxed">
            לחצו על <Share className="inline w-5 h-5 align-text-bottom text-accent" aria-label="כפתור השיתוף" /> בתחתית המסך,
            <br />
            ואז על <span className="font-semibold">״הוסף למסך הבית״</span>
          </p>
        )}
      </div>
    </aside>
  )
}
