import type { Album } from './types'
import { photos } from './photos'

const pick = (...ids: (keyof typeof photos)[]) => ids.map((id) => photos[id])

/**
 * אלבומי הגלריה — לפי תקופות בחיים. אין כיתובים מתחת לתמונות: שם האלבום הוא ההקשר.
 * מיפוי התמונות למקור: OneDrive\Pictures\לזכרו של מאיר תמם -1-001\מיפוי-תמונות.md
 */
export const albums: Album[] = [
  {
    id: 'early-years', title: 'השנים המוקדמות',
    cover: photos.YO001.thumbnail,
    photos: pick('YO001', 'YO002', 'YO003', 'YO005', 'YO007', 'AR001', 'AR002', 'M003', 'M005', 'M008', 'M010', 'M011', 'M014', 'M019', 'M020', 'M028', 'P285', 'M013', 'M018', 'M022', 'M023', 'M027'),
  },
  {
    id: 'wedding', title: 'רחל ומאיר',
    cover: photos.W013.thumbnail,
    photos: pick('W001', 'W005', 'W013', 'W143', 'W149', 'W002', 'W004', 'W006', 'W140', 'W162', 'W172', 'W144', 'W138', 'W167', 'W169', 'W145', 'W148', 'W154', 'W080', 'W082', 'W118', 'W135'),
  },
  {
    id: 'building-home', title: 'בונים בית',
    cover: photos.SF001.thumbnail,
    photos: pick('SF001', 'SF005', 'SF003', 'SF004', 'TR076', 'SF007', 'M006', 'M026', 'M024', 'M009', 'M029', 'M002', 'P274', 'P277', 'P279', 'P280', 'P281', 'P284'),
  },
  {
    id: 'family', title: 'הבית והמשפחה',
    cover: photos.M046.thumbnail,
    photos: pick('WF001', 'MY002', 'M046', 'M057', 'M084', 'M108', 'M087', 'P065', 'P068', 'P080', 'P086', 'P090', 'P298', 'P299', 'P119', 'P297'),
  },
  {
    id: 'grandchildren', title: 'סבא של אהבה',
    cover: photos.CH045.thumbnail,
    photos: pick('TR022', 'CH006', 'CH014', 'CH017', 'CH036', 'WF074', 'WF079', 'CH045', 'TR001', 'TR011', 'HO008', 'TR059', 'TR062', 'G022', 'G197', 'P308', 'G043', 'G047', 'G003', 'G012', 'G168', 'G180', 'G173', 'G237', 'G101', 'G016', 'G133', 'G174', 'G178', 'P020', 'P166', 'P200', 'P220', 'G070', 'G045'),
  },
  {
    id: 'together', title: 'טיולים ושמחות',
    cover: photos.TR028.thumbnail,
    photos: pick('WF052', 'WF057', 'HO001', 'HO003', 'MY001', 'TR033', 'TR028', 'TR047', 'G143', 'G083', 'G091', 'P138', 'P140', 'P265', 'P259', 'P253', 'G186', 'G188', 'G207', 'P292'),
  },
]
