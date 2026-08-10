import { useCallback, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import type { Photo } from '@/content/types'
import { asset } from '@/lib/assets'

interface LightboxProps {
  photos: Photo[]
  index: number
  onClose: () => void
  onNavigate: (index: number) => void
}

/**
 * Fullscreen photo viewer with swipe, arrow keys and buttons.
 * RTL: "next" moves to the left, like turning a page in a Hebrew book.
 */
export function Lightbox({ photos, index, onClose, onNavigate }: LightboxProps) {
  const touchStartX = useRef<number | null>(null)
  const photo = photos[index]

  const goNext = useCallback(() => {
    onNavigate((index + 1) % photos.length)
  }, [index, photos.length, onNavigate])

  const goPrev = useCallback(() => {
    onNavigate((index - 1 + photos.length) % photos.length)
  }, [index, photos.length, onNavigate])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
      // RTL: left arrow advances, right arrow goes back
      if (e.key === 'ArrowLeft') goNext()
      if (e.key === 'ArrowRight') goPrev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, goNext, goPrev])

  // Lock body scroll while open
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    touchStartX.current = null
    if (Math.abs(dx) < 40) return
    // RTL swipe: dragging finger to the right reveals the next photo
    if (dx > 0) goNext()
    else goPrev()
  }

  if (!photo) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="תצוגת תמונה מלאה"
      className="fixed inset-0 z-[100] bg-primary/95 backdrop-blur-sm flex flex-col animate-fade-in"
      onClick={onClose}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between p-4 text-primary-foreground">
        <span className="text-sm opacity-80">
          {index + 1} / {photos.length}
        </span>
        <button
          onClick={onClose}
          aria-label="סגירה"
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Photo */}
      <div
        className="flex-1 flex items-center justify-center px-2 min-h-0"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <img
          src={asset(photo.src)}
          alt={photo.caption ?? ''}
          className="max-h-full max-w-full object-contain rounded-sm"
        />
      </div>

      {/* Caption + navigation */}
      <div className="p-4 pb-8 text-center" onClick={(e) => e.stopPropagation()}>
        {photo.caption && (
          <p className="text-primary-foreground/90 mb-4 text-sm md:text-base leading-relaxed">
            {photo.caption}
          </p>
        )}

        {photos.length > 1 && (
          <div className="flex items-center justify-center gap-8">
            {/* RTL: prev is on the right */}
            <button
              onClick={goPrev}
              aria-label="התמונה הקודמת"
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-primary-foreground transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            <button
              onClick={goNext}
              aria-label="התמונה הבאה"
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-primary-foreground transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
