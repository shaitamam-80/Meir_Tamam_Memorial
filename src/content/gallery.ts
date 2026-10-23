import type { Album } from './types'
import { photos } from './photos'

const pick = (...ids: (keyof typeof photos)[]) => ids.map((id) => photos[id])

export const albums: Album[] = [
  {
    id: 'early-years', title: 'השנים המוקדמות',
    description: 'תצלומים מהנעורים ומהשירות הצבאי',
    cover: photos.YO001.thumbnail,
    photos: pick('YO001', 'YO002', 'YO003', 'YO005', 'YO007', 'AR001', 'AR002'),
  },
  {
    id: 'wedding', title: 'רחל ומאיר', description: 'רגעים מיום החתונה',
    cover: photos.WD012.thumbnail,
    photos: pick('WD004', 'WD006', 'WD012', 'WD046', 'WD052', 'WD142'),
  },
  {
    id: 'family', title: 'הבית והמשפחה',
    description: 'ילדים, מפגשים והרגעים שבין החגיגות',
    cover: photos.SF001.thumbnail,
    photos: pick('SF001', 'SF004', 'SF003', 'SF005', 'TR076', 'SF007', 'MY001', 'WF001', 'WF052', 'WF057', 'HO001', 'HO003', 'MY002'),
  },
  {
    id: 'grandchildren', title: 'סבא של אהבה',
    description: 'הרגעים היפים עם שמונת הנכדים והנכדות',
    cover: photos.CH045.thumbnail,
    photos: pick('TR022', 'CH006', 'CH014', 'CH017', 'CH036', 'WF074', 'WF079', 'CH045'),
  },
  {
    id: 'together', title: 'טיולים ושמחות',
    description: 'גלידה, ים, חופשות וימי הולדת יחד',
    cover: photos.TR028.thumbnail,
    photos: pick('TR001', 'TR011', 'TR028', 'TR033', 'TR047', 'TR062', 'HO008', 'TR059'),
  },
]
