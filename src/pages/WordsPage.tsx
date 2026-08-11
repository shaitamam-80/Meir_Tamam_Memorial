import { memorialWords } from '@/content/words'

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
        <div className="max-w-3xl mx-auto space-y-8">
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
                <h2 className="font-heading text-2xl md:text-3xl text-primary mb-6">
                  {entry.title}
                </h2>
              )}

              <div className="text-lg text-foreground/90 leading-relaxed space-y-4">
                {entry.paragraphs.map((paragraph, pIndex) => (
                  <p key={pIndex} className="whitespace-pre-line">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Author */}
              <footer className="mt-6 pt-4 border-t border-border flex items-baseline gap-2">
                <span className="font-heading text-primary">{entry.author}</span>
                {entry.relation && (
                  <span className="text-muted-foreground text-sm">· {entry.relation}</span>
                )}
              </footer>
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
