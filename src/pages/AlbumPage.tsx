import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { albums } from '@/content/gallery'
import { asset } from '@/lib/assets'
import { Lightbox } from '@/components/Lightbox'

export function AlbumPage() {
  const { albumId } = useParams()
  const album = albums.find((a) => a.id === albumId)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  if (!album) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <h1 className="font-heading text-2xl text-primary mb-4">האלבום לא נמצא</h1>
        <Link to="/gallery" className="text-primary underline underline-offset-4">
          חזרה לגלריה
        </Link>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative py-12 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-surface/50 to-transparent" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          {/* Breadcrumb — in RTL "back" points right */}
          <Link
            to="/gallery"
            className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ChevronRight className="w-4 h-4" />
            <span>כל האלבומים</span>
          </Link>

          <h1 className="animate-fade-in-up font-heading text-3xl md:text-4xl text-primary mb-4">
            {album.title}
          </h1>

          {album.description && (
            <p className="animate-fade-in-up delay-200 text-muted-foreground max-w-xl mx-auto">
              {album.description}
            </p>
          )}
        </div>
      </section>

      {/* Photo grid */}
      <section className="py-4 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-3">
          {album.photos.map((photo, index) => (
            <button
              key={index}
              onClick={() => setLightboxIndex(index)}
              aria-label={photo.caption ?? `תמונה ${index + 1}`}
              className="group aspect-square overflow-hidden rounded-lg border border-border bg-surface animate-fade-in-up focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <img
                src={asset(photo.src)}
                alt={photo.caption ?? ''}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </button>
          ))}
        </div>
      </section>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          photos={album.photos}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </div>
  )
}
