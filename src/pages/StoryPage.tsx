import { storyChapters } from '@/content/story'
import { timelineEvents } from '@/content/timeline'
import { asset } from '@/lib/assets'
import type { Photo, StoryChapter } from '@/content/types'

function StoryFigure({ image }: { image: Photo }) {
  return (
    <figure className="my-6">
      <img
        src={asset(image.src)}
        alt={image.caption ?? ''}
        loading="lazy"
        className="w-full rounded-lg border border-accent/20 shadow-sm"
      />
      {image.caption && (
        <figcaption className="text-center text-sm text-muted-foreground mt-2">
          {image.caption}
        </figcaption>
      )}
    </figure>
  )
}

/**
 * Renders a chapter with its images woven between the paragraphs:
 * images are distributed evenly through the text rather than stacked at the end.
 */
function Chapter({ chapter, index }: { chapter: StoryChapter; index: number }) {
  const images = chapter.images ?? []
  const paragraphs = chapter.paragraphs

  // After which paragraph to place each image (spread evenly)
  const imageAfterParagraph = (imgIndex: number) =>
    Math.min(
      paragraphs.length - 1,
      Math.floor(((imgIndex + 1) * paragraphs.length) / (images.length + 1)),
    )

  return (
    <article
      className="memorial-card animate-fade-in-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <h2 className="font-heading text-2xl text-primary mb-6 flex items-center gap-3">
        <span className="w-8 h-0.5 bg-accent shrink-0" />
        {chapter.title}
      </h2>

      <div className="text-lg text-foreground/90 leading-relaxed">
        {paragraphs.map((paragraph, pIndex) => (
          <div key={pIndex}>
            <p className="mb-4 last:mb-0">{paragraph}</p>
            {images.map(
              (image, imgIndex) =>
                imageAfterParagraph(imgIndex) === pIndex && (
                  <StoryFigure key={imgIndex} image={image} />
                ),
            )}
          </div>
        ))}
      </div>
    </article>
  )
}

function Timeline() {
  return (
    <div className="relative">
      {/* Vertical line — desktop */}
      <div className="absolute top-0 bottom-0 start-1/2 -translate-x-1/2 w-px gold-line-vertical hidden md:block" />

      <div className="space-y-8 md:space-y-0">
        {timelineEvents.map((event, index) => (
          <div
            key={event.year + event.title}
            className={`relative md:flex md:items-center md:gap-8 ${
              index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
            }`}
          >
            <div className="flex-1 animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="memorial-card md:max-w-md md:ms-auto md:me-0">
                <div className="flex items-center gap-3 mb-3">
                  <span className="md:hidden inline-flex items-center justify-center px-3 h-8 bg-surface text-primary font-heading text-sm rounded-full border border-accent/30 shrink-0">
                    {event.year}
                  </span>
                  <h3 className="font-heading text-xl text-primary">{event.title}</h3>
                </div>

                <p className="text-muted-foreground leading-relaxed">{event.description}</p>
              </div>
            </div>

            {/* Year marker — desktop */}
            <div className="hidden md:flex flex-col items-center z-10">
              <div className="w-4 h-4 rounded-full bg-accent shadow-lg ring-4 ring-background" />
              <div className="mt-2 px-4 py-1 bg-surface rounded-full border border-accent/20">
                <span className="font-heading text-primary">{event.year}</span>
              </div>
            </div>

            <div className="flex-1 hidden md:block" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function StoryPage() {
  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative py-14 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-surface/50 to-transparent" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="animate-fade-in-up font-heading text-4xl md:text-5xl text-primary mb-6">
            סיפור חיים
          </h1>

          <div className="gold-line w-24 mx-auto mb-6 animate-fade-in delay-200" />

          <p className="animate-fade-in-up delay-300 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            מסע בדרך חייו, מהרגעים הראשונים ועד לזכרונות שנשארו בלבנו
          </p>
        </div>
      </section>

      {/* Chapters */}
      <section className="py-8 px-4">
        <div className="max-w-3xl mx-auto space-y-8">
          {storyChapters.map((chapter, index) => (
            <Chapter key={chapter.id} chapter={chapter} index={index} />
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="py-14 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-2xl md:text-3xl text-primary text-center mb-12">
            <span className="text-ornament">ציר הזמן</span>
          </h2>

          <Timeline />
        </div>
      </section>

      {/* Closing */}
      <section className="py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="gold-line w-16 mx-auto mb-8" />

          <p className="font-heading text-xl md:text-2xl text-primary leading-relaxed">
            זכרו יאיר את דרכנו לעד,
            <br />
            תהא נשמתו צרורה בצרור החיים
          </p>
        </div>
      </section>
    </div>
  )
}
