import { Link } from 'react-router-dom'
import { Images } from 'lucide-react'
import { albums } from '@/content/gallery'
import { asset } from '@/lib/assets'

export function GalleryPage() {
  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative py-14 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-surface/50 to-transparent" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="animate-fade-in-up font-heading text-4xl md:text-5xl text-primary mb-6">
            גלריית תמונות
          </h1>

          <div className="gold-line w-24 mx-auto mb-6 animate-fade-in delay-200" />

          <p className="animate-fade-in-up delay-300 text-lg text-muted-foreground max-w-2xl mx-auto">
            רגעים ותקופות מחייו, מסודרים באלבומים
          </p>
        </div>
      </section>

      {/* Album grid */}
      <section className="py-8 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
          {albums.map((album, index) => (
            <Link
              key={album.id}
              to={`/gallery/${album.id}`}
              className="group memorial-card p-0 overflow-hidden hover:translate-y-[-4px] transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Cover */}
              <div className="aspect-[4/3] overflow-hidden bg-surface">
                <img
                  src={asset(album.cover)}
                  alt={album.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Info */}
              <div className="p-5">
                <div className="flex items-center justify-between gap-3 mb-1">
                  <h2 className="font-heading text-xl text-primary">{album.title}</h2>
                  <span className="flex items-center gap-1.5 text-muted-foreground text-sm shrink-0">
                    <Images className="w-4 h-4 text-accent" />
                    {album.photos.length}
                  </span>
                </div>

                {album.description && (
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {album.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
