import type { Album } from './types'

/**
 * הגלריה — אלבומים לפי תקופות.
 *
 * איך מוסיפים אלבום:
 * 1. צרו תיקייה חדשה ב-public/images/gallery/ (למשל: wedding/)
 * 2. העתיקו אליה את התמונות (מוקטנות! עד 1200 פיקסלים רוחב, ראו CONTENT_GUIDE.md)
 * 3. הוסיפו כאן אובייקט אלבום עם רשימת התמונות
 *
 * האלבומים למטה הם דוגמה עם תמונות ממלא-מקום — החליפו אותם בתמונות אמיתיות.
 */
export const albums: Album[] = [
  {
    id: 'early-years',
    title: 'השנים הראשונות',
    description: 'ילדות בעכו, משפחת המוצא והשורשים',
    cover: 'images/placeholder-photo.svg',
    photos: [
      { src: 'images/placeholder-photo.svg', caption: 'תמונה לדוגמה — החליפו אותי' },
      { src: 'images/placeholder-photo.svg', caption: 'תמונה לדוגמה — החליפו אותי' },
    ],
  },
  {
    id: 'family',
    title: 'המשפחה',
    description: 'החתונה עם רחל, הילדים והבית',
    cover: 'images/placeholder-photo.svg',
    photos: [
      { src: 'images/placeholder-photo.svg', caption: 'תמונה לדוגמה — החליפו אותי' },
      { src: 'images/placeholder-photo.svg', caption: 'תמונה לדוגמה — החליפו אותי' },
    ],
  },
  {
    id: 'grandchildren',
    title: 'סבא של אהבה',
    description: 'הרגעים היפים עם שבעת הנכדים',
    cover: 'images/placeholder-photo.svg',
    photos: [
      { src: 'images/placeholder-photo.svg', caption: 'תמונה לדוגמה — החליפו אותי' },
    ],
  },
]
