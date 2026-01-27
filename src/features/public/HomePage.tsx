import { Link } from 'react-router-dom'
import { BookOpen, Camera, Heart, ChefHat } from 'lucide-react'
import { getRawStorageUrl } from '@/lib/imageUrl'

// Profile photo path in Supabase Storage
const PROFILE_PHOTO = 'father-homepage.png'

function MemorialCandleLarge() {
  return (
    <div className="relative">
      {/* Outer glow */}
      <div className="absolute -inset-12 bg-gradient-radial from-amber-100/40 via-amber-50/10 to-transparent rounded-full animate-pulse" style={{ animationDuration: '4s' }} />

      {/* Inner glow */}
      <div className="absolute -inset-6 bg-gradient-radial from-amber-200/50 to-transparent rounded-full animate-candle-glow" />

      {/* Flame container */}
      <div className="relative">
        {/* Flame SVG */}
        <svg
          className="w-12 h-20 mx-auto animate-flame"
          viewBox="0 0 48 80"
          fill="none"
        >
          <defs>
            <linearGradient id="flameGradientLg" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#d97706" />
              <stop offset="30%" stopColor="#f59e0b" />
              <stop offset="60%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#fef9c3" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Outer flame */}
          <path
            d="M24 0C24 0 4 28 4 52C4 68 12.954 80 24 80C35.046 80 44 68 44 52C44 28 24 0 24 0Z"
            fill="url(#flameGradientLg)"
            filter="url(#glow)"
          />

          {/* Inner bright core */}
          <ellipse cx="24" cy="58" rx="8" ry="12" fill="#fffbeb" opacity="0.9" />
          <ellipse cx="24" cy="60" rx="4" ry="8" fill="#fff" opacity="0.7" />
        </svg>

        {/* Candle body */}
        <div className="w-10 h-24 bg-gradient-to-b from-[#faf8f5] via-[#f0ebe0] to-[#e5ddd0] rounded-t-sm mx-auto shadow-md relative overflow-hidden">
          {/* Wax drip texture */}
          <div className="absolute top-0 start-1 w-2 h-4 bg-gradient-to-b from-white/60 to-transparent rounded-b-full" />
          <div className="absolute top-0 end-2 w-1.5 h-3 bg-gradient-to-b from-white/40 to-transparent rounded-b-full" />
        </div>

        {/* Candle holder - ornate */}
        <div className="relative">
          <div className="w-14 h-3 bg-gradient-to-b from-[#c9a962] via-[#b8963e] to-[#a08040] rounded-t-sm mx-auto" />
          <div className="w-16 h-2 bg-gradient-to-b from-[#a08040] to-[#7a6030] mx-auto" />
          <div className="w-20 h-3 bg-gradient-to-b from-[#7a6030] via-[#8a7040] to-[#6a5020] rounded-b-md mx-auto shadow-lg" />
        </div>
      </div>
    </div>
  )
}

const sections = [
  {
    path: '/story',
    icon: BookOpen,
    title: 'סיפור חיים',
    description: 'מסע בדרך חייו, מרגעי הילדות ועד לזכרונות האחרונים',
  },
  {
    path: '/gallery',
    icon: Camera,
    title: 'גלריית תמונות',
    description: 'אלבומי תמונות משפחתיים ורגעים בלתי נשכחים',
  },
  {
    path: '/recipes',
    icon: ChefHat,
    title: 'ספר המתכונים',
    description: 'המתכונים האהובים שהכין במו ידיו',
  },
  {
    path: '/memories',
    icon: Heart,
    title: 'קיר הזכרונות',
    description: 'שתפו זיכרון אישי והנציחו את זכרו',
  },
]

export function HomePage() {
  return (
    <div className="relative">
      {/* Hero section */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center px-4 overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Subtle radial gradient from top */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200%] h-[60%] bg-gradient-radial from-amber-50/30 via-transparent to-transparent" />
        </div>

        {/* Main content */}
        <div className="relative z-10 text-center max-w-3xl mx-auto">
          {/* Profile Photo */}
          <div className="mb-6 animate-fade-in">
            {/* Photo frame with gold border */}
            <div className="w-44 h-44 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-accent/30 shadow-warm-lg mx-auto">
              <img
                src={getRawStorageUrl(PROFILE_PHOTO)}
                alt="מאיר תמם ז״ל"
                className="w-full h-full object-cover"
                style={{ objectPosition: 'center 20%' }}
              />
            </div>
          </div>

          {/* Memorial candle below photo */}
          <div className="mb-8 scale-[0.6] origin-top">
            <MemorialCandleLarge />
          </div>

          {/* Name */}
          <h1 className="animate-fade-in-up delay-200 font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-primary mb-2">
            מאיר תמם בן אסתר ז״ל
          </h1>

          {/* Years */}
          <p className="animate-fade-in-up delay-300 text-muted-foreground text-xl md:text-2xl mb-6">
            1952–2026
          </p>

          {/* Decorative line */}
          <div className="animate-fade-in delay-400 gold-line w-32 mx-auto mb-8" />

          {/* Short bio */}
          <p className="animate-fade-in-up delay-500 text-lg md:text-xl text-foreground/80 leading-relaxed max-w-2xl mx-auto mb-8">
            איש של שקט, חיוך ואהבת אדם. מאיר נולד בתוניסיה, גדל בישראל של פעם,
            והקים משפחה לתפארת בדרכו הייחודית – בנועם הליכות ובסבלנות אין-קץ.
            הוא היה איש עמל שידע להעריך את החיים שניתנו לו במתנה, וסבא שכל עולמו היה נכדיו.
            אתר זה מוקדש לסיפורים, לטעמים המיוחדים ולמורשת שהשאיר אחריו.
          </p>

          {/* Tagline quote */}
          <p className="animate-fade-in-up delay-600 font-heading text-xl md:text-2xl text-primary/90 italic">
            ״החיוך השקט שניצח הכל״
          </p>

          {/* Scripture quote */}
          <p className="animate-fade-in-up delay-700 text-sm md:text-base text-muted-foreground mt-4">
            ״הֹלֵךְ תָּמִים וּפֹעֵל צֶדֶק וְדֹבֵר אֱמֶת בִּלְבָבוֹ״
            <span className="block text-xs mt-1">(תהילים ט״ו, ב׳)</span>
          </p>

          {/* Scroll indicator */}
          <div className="animate-fade-in delay-700 mt-16">
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <span className="text-sm">גלול למטה</span>
              <div className="w-6 h-10 border-2 border-current rounded-full p-1">
                <div className="w-1.5 h-2.5 bg-current rounded-full mx-auto animate-bounce" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation cards section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16">
            <h2 className="font-heading text-2xl md:text-3xl text-primary mb-4">
              <span className="text-ornament">לזכור ולהנציח</span>
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              בחרו באחד מהחלקים כדי לגלות עוד על חייו וזכרונותיו
            </p>
          </div>

          {/* Cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {sections.map((section, index) => (
              <Link
                key={section.path}
                to={section.path}
                className="group memorial-card flex flex-col items-center text-center p-8 hover:translate-y-[-4px] transition-all duration-300"
                style={{ animationDelay: `${index * 100 + 200}ms` }}
              >
                {/* Icon */}
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-surface to-background flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 border border-accent/20">
                  <section.icon className="w-7 h-7 text-accent" strokeWidth={1.5} />
                </div>

                {/* Title */}
                <h3 className="font-heading text-xl text-primary mb-2 group-hover:text-primary/80 transition-colors">
                  {section.title}
                </h3>

                {/* Description */}
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {section.description}
                </p>

                {/* Hover indicator */}
                <div className="mt-4 w-8 h-0.5 bg-accent/30 group-hover:w-12 group-hover:bg-accent transition-all duration-300" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Quote section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative">
            {/* Quote marks */}
            <span className="absolute -top-8 start-0 text-8xl text-accent/10 font-serif leading-none">״</span>
            <span className="absolute -bottom-16 end-0 text-8xl text-accent/10 font-serif leading-none rotate-180">״</span>

            <blockquote className="relative z-10 font-heading text-2xl md:text-3xl lg:text-4xl text-primary leading-relaxed py-8 px-4">
              מי שנטע בלבנו את האהבה לחיים,
              <br />
              לעולם לא באמת נפרד ממנו.
            </blockquote>
          </div>

          <div className="gold-line w-24 mx-auto mt-12" />
        </div>
      </section>
    </div>
  )
}

export default HomePage
