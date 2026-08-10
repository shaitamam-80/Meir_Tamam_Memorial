import { Link } from 'react-router-dom'
import { BookOpen, Camera, Heart } from 'lucide-react'
import { MemorialCandle } from '@/components/MemorialCandle'
import { profile } from '@/content/profile'
import { asset } from '@/lib/assets'

const sections = [
  {
    path: '/story',
    icon: BookOpen,
    title: 'סיפור חיים',
    description: 'מסע בדרך חייו, מרגעי הילדות ועד לזכרונות שנשארו בלבנו',
  },
  {
    path: '/gallery',
    icon: Camera,
    title: 'גלריית תמונות',
    description: 'אלבומי תמונות משפחתיים ורגעים בלתי נשכחים',
  },
  {
    path: '/words',
    icon: Heart,
    title: 'מילים לזכרו',
    description: 'הספדים ומילים שכתבו בני המשפחה והחברים',
  },
]

export function HomePage() {
  return (
    <div className="relative">
      {/* Hero section */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center px-4 py-12 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200%] h-[60%] bg-gradient-radial from-amber-50/30 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 text-center max-w-3xl mx-auto">
          {/* Profile photo */}
          <div className="mb-6 animate-fade-in">
            <div className="w-44 h-44 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-accent/30 shadow-warm-lg mx-auto bg-surface">
              <img
                src={asset(profile.photo)}
                alt={profile.fullName}
                className="w-full h-full object-cover"
                style={{ objectPosition: 'center 20%' }}
              />
            </div>
          </div>

          {/* Memorial candle */}
          <div className="mb-8 scale-[0.6] origin-top">
            <MemorialCandle />
          </div>

          {/* Name */}
          <h1 className="animate-fade-in-up delay-200 font-heading text-4xl sm:text-5xl md:text-6xl text-primary mb-2">
            {profile.fullName}
          </h1>

          {/* Years */}
          <p className="animate-fade-in-up delay-300 text-muted-foreground text-xl md:text-2xl mb-6">
            {profile.years}
          </p>

          <div className="animate-fade-in delay-400 gold-line w-32 mx-auto mb-8" />

          {/* Short bio */}
          <p className="animate-fade-in-up delay-500 text-lg md:text-xl text-foreground/80 leading-relaxed max-w-2xl mx-auto mb-8">
            {profile.shortBio}
          </p>

          {/* Tagline */}
          <p className="animate-fade-in-up delay-600 font-heading text-xl md:text-2xl text-primary/90 italic">
            {profile.tagline}
          </p>

          {/* Scripture */}
          <p className="animate-fade-in-up delay-700 text-sm md:text-base text-muted-foreground mt-4">
            {profile.scripture.text}
            <span className="block text-xs mt-1">{profile.scripture.source}</span>
          </p>
        </div>
      </section>

      {/* Navigation cards */}
      <section className="relative py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-heading text-2xl md:text-3xl text-primary mb-4">
              <span className="text-ornament">לזכור ולהנציח</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {sections.map((section, index) => (
              <Link
                key={section.path}
                to={section.path}
                className="group memorial-card flex flex-col items-center text-center p-8 hover:translate-y-[-4px] transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${index * 100 + 200}ms` }}
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-surface to-background flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 border border-accent/20">
                  <section.icon className="w-7 h-7 text-accent" strokeWidth={1.5} />
                </div>

                <h3 className="font-heading text-xl text-primary mb-2">{section.title}</h3>

                <p className="text-muted-foreground text-sm leading-relaxed">
                  {section.description}
                </p>

                <div className="mt-4 w-8 h-0.5 bg-accent/30 group-hover:w-12 group-hover:bg-accent transition-all duration-300" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Closing quote */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <blockquote className="font-heading text-2xl md:text-3xl text-primary leading-relaxed whitespace-pre-line">
            {profile.closingQuote}
          </blockquote>

          <div className="gold-line w-24 mx-auto mt-10" />
        </div>
      </section>
    </div>
  )
}
