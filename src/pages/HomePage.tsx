import { Link } from 'react-router-dom'
import { BookOpen, Camera, Heart, Play } from 'lucide-react'
import { MemorialCandle } from '@/components/MemorialCandle'
import { MemorialFilm } from '@/components/MemorialFilm'
import { profile } from '@/content/profile'
import { asset } from '@/lib/assets'

const sections = [
  { path: '/story', icon: BookOpen, title: 'סיפור חיים', description: 'השורשים, המשפחה והדרך שעבר' },
  { path: '/gallery', icon: Camera, title: 'אלבומים משפחתיים', description: 'הפנים, המקומות והרגעים יחד' },
  { path: '/words', icon: Heart, title: 'מילים לזכרו', description: 'זיכרונות ומילים של המשפחה והחברים' },
]

export function HomePage() {
  return (
    <div>
      <section className="px-4 pt-8 pb-10 md:py-16">
        <div className="max-w-5xl mx-auto grid items-center gap-7 md:grid-cols-2 md:gap-12">
          <div className="text-center md:text-start">
            <p className="text-sm text-muted-foreground mb-3 tracking-wide">זוכרים באהבה</p>
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl text-primary leading-tight">
              {profile.fullName}
            </h1>
            <p className="text-muted-foreground text-xl mt-3"><bdi dir="ltr">{profile.years}</bdi></p>
            <p className="text-lg text-foreground/90 mt-5 leading-relaxed">{profile.introduction}</p>
            <a
              href="#memorial-film"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3 mt-5 font-semibold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              <Play className="w-5 h-5" aria-hidden="true" />
              לצפייה בסרט לזכרו
            </a>
          </div>
          <figure className="overflow-hidden rounded-2xl border border-accent/25 shadow-warm-lg bg-surface">
            <img
              src={asset(profile.photo)} alt={profile.photoAlt}
              width={1200} height={900} fetchPriority="high"
              className="w-full aspect-[4/3] object-cover"
            />
          </figure>
        </div>
        <div className="max-w-3xl mx-auto mt-8 md:mt-12 text-center">
          <blockquote className="font-heading text-xl md:text-2xl text-primary leading-relaxed">
            ״{profile.familyQuote}״
          </blockquote>
          <p className="text-muted-foreground text-sm mt-2">{profile.quoteAuthor}</p>
        </div>
      </section>

      <section className="px-4 pb-12">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-lg text-foreground/90 leading-relaxed">{profile.shortBio}</p>
        </div>
      </section>

      <MemorialFilm />

      <section className="px-4 py-12 md:py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-heading text-2xl md:text-3xl text-primary text-center mb-7">לזכור את הרגעים יחד</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {sections.map((section) => (
              <Link key={section.path} to={section.path} className="memorial-card flex flex-col items-center text-center gap-3 transition-colors hover:border-accent/50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">
                <section.icon className="w-7 h-7 text-accent" strokeWidth={1.5} aria-hidden="true" />
                <h3 className="font-heading text-xl text-primary">{section.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{section.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pt-4 pb-12 text-center">
        <div className="mx-auto mb-6 w-fit" aria-hidden="true"><MemorialCandle compact /></div>
        <p className="font-heading text-xl text-primary whitespace-pre-line leading-relaxed">{profile.closingQuote}</p>
        <p className="text-muted-foreground mt-6 text-sm">{profile.scripture.text}<span className="block mt-1">{profile.scripture.source}</span></p>
      </section>
    </div>
  )
}
