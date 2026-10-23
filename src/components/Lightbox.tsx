import { useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import type { Photo } from '@/content/types'
import { asset } from '@/lib/assets'

interface LightboxProps {
  photos: Photo[]
  index: number
  onClose: () => void
  onNavigate: (index: number) => void
}

/** A native modal keeps keyboard focus inside and makes the background inert. */
export function Lightbox({ photos, index, onClose, onNavigate }: LightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const touchStartX = useRef<number | null>(null)
  const photo = photos[index]
  const goNext = () => onNavigate((index + 1) % photos.length)
  const goPrev = () => onNavigate((index - 1 + photos.length) % photos.length)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const previousOverflow = document.body.style.overflow
    dialog.showModal()
    document.body.style.overflow = 'hidden'
    return () => {
      dialog.close()
      document.body.style.overflow = previousOverflow
      if (previouslyFocused?.isConnected) previouslyFocused.focus({ preventScroll: true })
    }
  }, [])

  if (!photo) return null

  return (
    <dialog
      ref={dialogRef} aria-label="תצוגת תמונה מלאה"
      className="photo-dialog fixed inset-0 m-0 w-screen h-dvh max-w-none max-h-none border-0 bg-background text-foreground p-0"
      onCancel={(event) => { event.preventDefault(); onClose() }}
      onKeyDown={(event) => {
        if (event.key === 'Tab') {
          const buttons = event.currentTarget.querySelectorAll<HTMLButtonElement>('button:not(:disabled)')
          const first = buttons[0]
          const last = buttons[buttons.length - 1]
          if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
          else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
        }
        if (event.key === 'ArrowLeft') { event.preventDefault(); goNext() }
        if (event.key === 'ArrowRight') { event.preventDefault(); goPrev() }
      }}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between p-3 md:p-4">
          <span className="text-sm text-muted-foreground" aria-live="polite"><bdi dir="ltr">{index + 1} / {photos.length}</bdi></span>
          <button type="button" onClick={onClose} aria-label="סגירה" autoFocus className="p-3 rounded-full hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-ring">
            <X className="w-6 h-6" aria-hidden="true" />
          </button>
        </div>
        <div
          className="flex-1 flex items-center justify-center px-3 min-h-0"
          onClick={(event) => { if (event.target === event.currentTarget) onClose() }}
          onTouchStart={(event) => { touchStartX.current = event.touches[0].clientX }}
          onTouchEnd={(event) => {
            if (touchStartX.current === null) return
            const distance = event.changedTouches[0].clientX - touchStartX.current
            touchStartX.current = null
            if (Math.abs(distance) < 40) return
            if (distance > 0) goNext()
            else goPrev()
          }}
        >
          <img src={asset(photo.src)} alt={photo.caption ?? ''} className="max-h-full max-w-full object-contain" />
        </div>
        <div className="px-4 pt-4 pb-6 pb-safe text-center">
          {photo.caption && <p className="mb-4 text-sm md:text-base leading-relaxed" aria-live="polite">{photo.caption}</p>}
          {photos.length > 1 && (
            <div className="flex items-center justify-center gap-8">
              <button type="button" onClick={goPrev} aria-label="התמונה הקודמת" className="p-3 rounded-full bg-white/10 hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-ring"><ChevronRight className="w-6 h-6" aria-hidden="true" /></button>
              <button type="button" onClick={goNext} aria-label="התמונה הבאה" className="p-3 rounded-full bg-white/10 hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-ring"><ChevronLeft className="w-6 h-6" aria-hidden="true" /></button>
            </div>
          )}
        </div>
      </div>
    </dialog>
  )
}
