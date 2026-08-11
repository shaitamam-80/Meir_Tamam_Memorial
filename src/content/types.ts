/** תמונה עם כיתוב אופציונלי */
export interface Photo {
  /** נתיב יחסי בתוך public/ — לדוגמה: 'images/story/childhood-1.jpg' */
  src: string
  /** כיתוב שיוצג מתחת לתמונה */
  caption?: string
}

/** פרק בסיפור החיים */
export interface StoryChapter {
  id: string
  title: string
  /** פסקאות טקסט — כל מחרוזת היא פסקה אחת */
  paragraphs: string[]
  /** תמונות שישולבו בתוך הפרק */
  images?: Photo[]
}

/** אירוע בציר הזמן */
export interface TimelineEvent {
  year: string
  title: string
  description: string
}

/** אלבום בגלריה */
export interface Album {
  id: string
  title: string
  description?: string
  /** תמונת השער של האלבום */
  cover: string
  photos: Photo[]
}

/** מילים לזכרו — הספד, מכתב או זיכרון שכתב אדם קרוב */
export interface MemorialWord {
  author: string
  /** קרבה — לדוגמה: 'הבן', 'הנכדה', 'חבר ילדות' */
  relation?: string
  /** כותרת אישית למכתב (אופציונלי) */
  title?: string
  /** פסקאות הטקסט. אפשר לשבור שורה בתוך פסקה עם \n */
  paragraphs: string[]
}
