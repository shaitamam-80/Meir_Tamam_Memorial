import { useState } from 'react'
import { Download } from 'lucide-react'
import { asset } from '@/lib/assets'
import { profile } from '@/content/profile'

export function MemorialFilm() {
  const [failed, setFailed] = useState(false)

  return (
    <section id="memorial-film" aria-labelledby="film-heading" className="px-4 py-10 bg-surface/40 scroll-mt-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h2 id="film-heading" className="font-heading text-2xl md:text-3xl text-primary">סיפור חייו בתמונות</h2>
          <p className="text-muted-foreground mt-2">רגעים מהדרך, מהבית ומהמשפחה</p>
        </div>
        <video
          controls playsInline preload="none" poster={asset(profile.photo)}
          width={1280} height={720} aria-label="סרט לזכרו של מאיר תמם"
          className="w-full aspect-video rounded-xl bg-background border border-accent/25"
          onError={() => setFailed(true)}
        >
          <source src={asset('media/memorial-film.mp4')} type="video/mp4" onError={() => setFailed(true)} />
          <track kind="captions" src={asset('media/memorial-he.vtt')} srcLang="he" label="עברית" default />
          הדפדפן אינו תומך בהפעלת הסרט. אפשר לשמור אותו בעזרת הקישור שמתחת לנגן.
        </video>
        {failed && <p role="alert" className="text-muted-foreground text-center mt-3">לא ניתן לטעון את הסרט כרגע. אפשר לנסות שוב או לשמור אותו דרך הקישור הבא.</p>}
        <div className="text-center mt-4">
          <a href={asset('media/memorial-film.mp4')} download="מאיר-תמם-סרט-זיכרון.mp4" className="inline-flex items-center gap-2 text-muted-foreground underline underline-offset-4 py-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">
            <Download className="w-4 h-4" aria-hidden="true" />שמירת הסרט לצפייה ללא חיבור
          </a>
        </div>
      </div>
    </section>
  )
}
