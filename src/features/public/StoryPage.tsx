import { ChevronLeft, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useBiographyChapters } from '@/hooks/useSiteContent'
import { useTimelineEvents } from '@/hooks/useTimeline'

// Fallback timeline data (shown if database is empty)
const fallbackTimelineEvents = [
  {
    id: '1',
    year: 1952,
    title: 'ההתחלה בנבל',
    description: 'הלידה בתוניסיה להורים אסתר ופרג\'י ז"ל. האח הצעיר במשפחה בת 9 אחים ואחיות.',
  },
  {
    id: '2',
    year: 1955,
    title: 'העלייה והסירים',
    description: 'העלייה לארץ ישראל והתיישבות בעכו. הזיכרון המשפחתי על אמא אסתר והסירים הגדולים שלקחה איתה למסע.',
  },
  {
    id: '3',
    year: 1979,
    title: 'ברית האהבה',
    description: 'הנישואים לרחל (2.12.1979). הקמת הבית החם המבוסס על ערכים של נתינה וכבוד הדדי.',
  },
  {
    id: '4',
    year: 1980,
    title: 'המשפחה מתרחבת',
    description: 'הולדת הילדים – שי (1980), יניב (1982), אסתי (1986) ומעיין (1988). מאיר כאבא שקט, נוכח ומסור.',
  },
  {
    id: '5',
    year: 2014,
    title: 'החיים במתנה',
    description: 'דום הלב, נס ההצלה והשיקום. נקודת המפנה שהובילה לבחירה בנתינה והתנדבות.',
  },
  {
    id: '6',
    year: 2009,
    title: 'סבא של אהבה',
    description: '"סבא של אהבה" – השנים היפות עם שבעת הנכדים. התנדבות עם ילדים בעלי צרכים מיוחדים.',
  },
]

// Fallback biography content
const fallbackBiography = {
  title: 'שורשים וילדות – מנבל לישראל',
  paragraphs: [
    'מאיר נולד ב-10 בדצמבר 1952 בעיר החוף נבל שבתוניסיה, להוריו אסתר ופרג\'י ז"ל. הוא היה האח הצעיר במשפחת תמם המלוכדת, שמנתה תשעה אחים ואחיות. הבית היה מלא במסורת, כבוד ודרך ארץ.',
    'בשנת 1955, כשהיה פעוט כבן שלוש, עלתה המשפחה לישראל. ילדותו עברה עליו בעכו, בין לימודים בבית הספר "ויצמן" למשחקי כדורגל וגולות בשכונה, כשהוא סופג את ערכי העבודה והמסחר מאביו בחנות המכולת המשפחתית.',
  ],
}

function BiographySection() {
  const { data: chapters, isLoading, error } = useBiographyChapters()

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    )
  }

  // If no chapters in database, show fallback
  if (error || !chapters || chapters.length === 0) {
    return (
      <div className="memorial-card animate-fade-in-up">
        <h2 className="font-heading text-2xl text-primary mb-6 flex items-center gap-3">
          <span className="w-8 h-0.5 bg-accent" />
          {fallbackBiography.title}
        </h2>

        <div className="prose prose-lg text-foreground/90 leading-relaxed space-y-4">
          {fallbackBiography.paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>
    )
  }

  // Display chapters from database
  return (
    <div className="space-y-8">
      {chapters.map((chapter, index) => (
        <div
          key={chapter.key}
          className="memorial-card animate-fade-in-up"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <h2 className="font-heading text-2xl text-primary mb-6 flex items-center gap-3">
            <span className="w-8 h-0.5 bg-accent" />
            {chapter.title}
          </h2>

          <div className="prose prose-lg text-foreground/90 leading-relaxed">
            {chapter.content.split('\n\n').map((paragraph, pIndex) => (
              <p key={pIndex} className="mb-4 last:mb-0">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function TimelineSection() {
  const { data: events, isLoading, error } = useTimelineEvents()

  // Use database events or fallback
  const timelineEvents = (error || !events || events.length === 0)
    ? fallbackTimelineEvents
    : events

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute top-0 bottom-0 start-1/2 -translate-x-1/2 w-px gold-line-vertical hidden md:block" />

      {/* Timeline events */}
      <div className="space-y-12 md:space-y-0">
        {timelineEvents.map((event, index) => (
          <div
            key={event.id}
            className={`relative md:flex md:items-center md:gap-8 ${
              index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
            }`}
            style={{ animationDelay: `${index * 150}ms` }}
          >
            {/* Content card */}
            <div
              className={`flex-1 animate-fade-in-up ${
                index % 2 === 0 ? 'md:text-end' : 'md:text-start'
              }`}
            >
              <div className="memorial-card md:max-w-md md:ms-auto md:me-0">
                <div className="flex items-center gap-3 mb-3">
                  {/* Mobile year badge */}
                  <span className="md:hidden inline-flex items-center justify-center w-16 h-8 bg-accent/10 text-accent font-heading text-sm rounded-full border border-accent/20">
                    {event.year}
                  </span>
                  <h3 className="font-heading text-xl text-primary">
                    {event.title}
                  </h3>
                </div>

                <p className="text-muted-foreground leading-relaxed">
                  {event.description}
                </p>
              </div>
            </div>

            {/* Year marker - desktop */}
            <div className="hidden md:flex flex-col items-center z-10">
              {/* Dot */}
              <div className="w-4 h-4 rounded-full bg-accent shadow-lg ring-4 ring-background" />

              {/* Year */}
              <div className="mt-2 px-4 py-1 bg-surface rounded-full border border-accent/20">
                <span className="font-heading text-primary">{event.year}</span>
              </div>
            </div>

            {/* Spacer for alternating layout */}
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
      {/* Hero section */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 bg-gradient-to-b from-surface/50 to-transparent" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          {/* Breadcrumb */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>חזרה לדף הבית</span>
          </Link>

          <h1 className="animate-fade-in-up font-heading text-4xl md:text-5xl lg:text-6xl text-primary mb-6">
            סיפור חיים
          </h1>

          <div className="gold-line w-24 mx-auto mb-8 animate-fade-in delay-200" />

          <p className="animate-fade-in-up delay-300 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            מסע בציר הזמן של חייו, מהרגעים הראשונים ועד לזכרונות שנשארו בלבנו
          </p>
        </div>
      </section>

      {/* Biography section */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <BiographySection />
        </div>
      </section>

      {/* Timeline section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-2xl md:text-3xl text-primary text-center mb-16">
            <span className="text-ornament">ציר הזמן</span>
          </h2>

          <TimelineSection />
        </div>
      </section>

      {/* Closing section */}
      <section className="py-20 px-4">
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

export default StoryPage
