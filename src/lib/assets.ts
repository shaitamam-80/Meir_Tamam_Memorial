/**
 * ממיר נתיב יחסי מתוך public/ לכתובת מלאה, כולל ה-base של האתר.
 */
export function asset(path: string): string {
  return import.meta.env.BASE_URL + path.replace(/^\//, '')
}
