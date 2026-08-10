import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <h1 className="font-heading text-4xl text-primary mb-4">הדף לא נמצא</h1>
      <p className="text-muted-foreground mb-6">ייתכן שהקישור שגוי או שהדף הוסר</p>
      <Link to="/" className="text-primary underline underline-offset-4">
        חזרה לדף הבית
      </Link>
    </div>
  )
}
