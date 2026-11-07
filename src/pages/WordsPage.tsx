import { memorialWords } from '@/content/words'

/** How many paragraphs of each letter show before "continue reading". */
const PREVIEW_PARAGRAPHS = 4

export function WordsPage() {
  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative py-14 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-surface/50 to-transparent" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="animate-fade-in-up font-heading text-4xl md:text-5xl text-primary mb-6">
            מילים לזכרו
          </h1>

          <div className="gold-line w-24 mx-auto mb-6 animate-fade-in delay-200" />

          <p className="animate-fade-in-up delay-300 text-lg text-muted-foreground max-w-2xl mx-auto">
            הספדים, מכתבים ומילים שכתבו בני המשפחה והחברים
          </p>
        </div>
      </section>

      {/* Entries */}
      <section className="py-8 px-4">
        <div className="max-w-3xl mx-auto space-y-6">
          {memorialWords.map((entry, index) => (
            <article
              key={index}
              className="memorial-card animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Opening quote mark */}
              <span className="block text-5xl text-accent/25 font-serif leading-none mb-2" aria-hidden>
                ״
              </span>

              {entry.title && (
                <h2 className="font-heading text-2xl md:text-3xl text-primary mb-3">
                  {entry.title}
                </h2>
              )}

              <div className="mb-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="font-heading text-xl md:text-2xl font-semibold text-foreground">{entry.author}</span>
                {entry.relation && <span className="text-lg text-muted-foreground">{entry.relation}</span>}
              </div>

              <div className="text-lg text-foreground/90 leading-relaxed space-y-3">
                {entry.paragraphs.slice(0, PREVIEW_PARAGRAPHS).map((paragraph, pIndex) => (
                  <p key={pIndex} className="whitespace-pre-line">{paragraph}</p>
                ))}
              </div>

              {/* Long letters fold after a short opening, so many stories fit on the page. */}
              {entry.paragraphs.length > PREVIEW_PARAGRAPHS && (
                <details className="group mt-3">
                  <summary className="list-none [&::-webkit-details-marker]:hidden inline-flex items-center gap-1 cursor-pointer text-primary font-semibold py-2 underline underline-offset-4 decoration-accent/50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">
                    <span className="group-open:hidden">להמשך הקריאה</span>
                    <span className="hidden group-open:inline">הסתרה</span>
                  </summary>
                  <div className="mt-3 text-lg text-foreground/90 leading-relaxed space-y-3">
                    {entry.paragraphs.slice(PREVIEW_PARAGRAPHS).map((paragraph, pIndex) => (
                      <p key={pIndex} className="whitespace-pre-line">{paragraph}</p>
                    ))}
                  </div>
                </details>
              )}
            </article>
          ))}
        </div>
      </section>

      {/* Closing */}
      <section className="py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="gold-line w-16 mx-auto mb-8" />

          <p className="font-heading text-xl text-primary leading-relaxed">
            תהא נשמתו צרורה בצרור החיים
          </p>
        </div>
      </section>
    </div>
  )
}
