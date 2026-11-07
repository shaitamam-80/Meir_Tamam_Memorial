import { useState } from 'react'
import { Download } from 'lucide-react'
import { asset } from '@/lib/assets'

interface Film {
  id: string
  title: string
  description: string
  file: string
  poster: string
  downloadName: string
}

const FILMS: Film[] = [
  {
    id: 'youth',
    title: 'נעורים',
    description: 'השנים הראשונות, החברים והשכונה',
    file: 'media/memorial-youth.mp4',
    poster: 'media/memorial-youth.jpg',
    downloadName: 'מאיר-תמם-נעורים.mp4',
  },
  {
    id: 'wedding',
    title: 'החתונה',
    description: 'החתונה והבית שבנו יחד',
    file: 'media/memorial-wedding.mp4',
    poster: 'media/memorial-wedding.jpg',
    downloadName: 'מאיר-תמם-החתונה.mp4',
  },
]

function FilmPlayer({ film }: { film: Film }) {
  const [failed, setFailed] = useState(false)
  const headingId = `film-${film.id}-heading`

  return (
    <article aria-labelledby={headingId}>
      <h3 id={headingId} className="font-heading text-xl text-primary">{film.title}</h3>
      <p className="text-muted-foreground mt-1 mb-3">{film.description}</p>
      <video
        controls playsInline preload="none" poster={asset(film.poster)}
        width={1280} height={720} aria-label={`סרט לזכרו של מאיר תמם: ${film.title}`}
        className="w-full aspect-video rounded-xl bg-background border border-accent/25"
        onError={() => setFailed(true)}
      >
        <source src={asset(film.file)} type="video/mp4" onError={() => setFailed(true)} />
        הדפדפן אינו תומך בהפעלת הסרט. אפשר לשמור אותו בעזרת הקישור שמתחת לנגן.
      </video>
      {failed && <p role="alert" className="text-muted-foreground mt-3">לא ניתן לטעון את הסרט כרגע. אפשר לנסות שוב או לשמור אותו דרך הקישור הבא.</p>}
      <a href={asset(film.file)} download={film.downloadName} className="inline-flex items-center gap-2 text-muted-foreground underline underline-offset-4 py-2 mt-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">
        <Download className="w-4 h-4" aria-hidden="true" />שמירת הסרט לצפייה ללא חיבור
      </a>
    </article>
  )
}

export function MemorialFilm() {
  return (
    <section id="memorial-film" aria-labelledby="film-heading" className="px-4 py-10 bg-surface/40 scroll-mt-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-6">
          <h2 id="film-heading" className="font-heading text-2xl md:text-3xl text-primary">סיפור חייו בתמונות</h2>
          <p className="text-muted-foreground mt-2">רגעים מהדרך, מהבית ומהמשפחה</p>
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          {FILMS.map((film) => <FilmPlayer key={film.id} film={film} />)}
        </div>
      </div>
    </section>
  )
}
