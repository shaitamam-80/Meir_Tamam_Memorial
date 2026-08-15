/**
 * מכין תמונות סרוקות לאתר: יישור אוריינטציה, חיתוך שולי הסורק,
 * יישור הטיה (deskew), הקטנה ל-1200px ודחיסה מתחת ל-300KB.
 *
 * הרצה:
 *   npm run photos -- --in "C:\\Users\\shait\\OneDrive\\Pictures\\מאיר תמם" --out images/gallery/army
 *
 * אפשרויות:
 *   --in <תיקייה>        תיקיית המקור (חובה)
 *   --out <נתיב>         יעד יחסי לתוך public/ (ברירת מחדל: images/incoming)
 *   --prefix <שם>        קידומת לשמות הקבצים (ברירת מחדל: שם התיקייה ב---out)
 *   --recursive          לסרוק גם תת-תיקיות
 *   --split              לפצל סריקה שמכילה כמה תמונות לקבצים נפרדים
 *   --max <px>           רוחב/גובה מרבי (ברירת מחדל 1200)
 *   --budget <kb>        משקל מרבי לקובץ (ברירת מחדל 300)
 *   --format webp|jpeg   פורמט הפלט (ברירת מחדל webp)
 *   --no-crop            בלי חיתוך אוטומטי
 *   --no-deskew          בלי יישור הטיה
 *   --rotations <file>   קובץ JSON עם סיבובים ידניים (נוצר מדף הבדיקה)
 *   --dry                בדיקה בלבד — מדפיס מה יקרה בלי לכתוב קבצים
 *
 * דורש: npm install (sharp מותקן כתלות פיתוח)
 */
import { readdir, mkdir, writeFile, readFile, stat } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname, join, resolve, extname, basename, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const SUPPORTED = new Set(['.jpg', '.jpeg', '.png', '.tif', '.tiff', '.webp', '.bmp', '.gif'])

/** רוחב התמונה המוקטנת שעליה מתבצע הניתוח — מספיק לזיהוי שוליים, מהיר פי כמה */
const ANALYZE_W = 700
/** שיעור הפיקסלים בשורה/עמודה שמעליו נחשב שיש שם תוכן */
const CONTENT_RATIO = 0.02
/** גבולות שפיות לחיתוך שזוהה — הגנה מפני זיהוי שגוי שיחתוך רסיס מהתמונה */
const MIN_CROP_AREA = 0.03
const MIN_CROP_SIDE = 0.06
const MAX_CROP_ASPECT = 6
/** טווח ההטיה שמתוקן אוטומטית (במעלות) */
const DESKEW_MIN = 0.25
const DESKEW_MAX = 12

// ---------- פענוח ארגומנטים ----------

function parseArgs(argv) {
  const opts = {
    in: null,
    out: 'images/incoming',
    prefix: null,
    recursive: false,
    split: false,
    max: 1200,
    budget: 300,
    format: 'webp',
    crop: true,
    deskew: true,
    rotations: null,
    dry: false,
  }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    const next = () => argv[++i]
    switch (a) {
      case '--in': opts.in = next(); break
      case '--out': opts.out = next().replace(/^\/+|\/+$/g, ''); break
      case '--prefix': opts.prefix = next(); break
      case '--recursive': opts.recursive = true; break
      case '--split': opts.split = true; break
      case '--max': opts.max = Number(next()); break
      case '--budget': opts.budget = Number(next()); break
      case '--format': opts.format = next(); break
      case '--no-crop': opts.crop = false; break
      case '--no-deskew': opts.deskew = false; break
      case '--rotations': opts.rotations = next(); break
      case '--dry': opts.dry = true; break
      case '--help': case '-h': opts.help = true; break
      default:
        if (a.startsWith('--')) {
          const err = new Error(`אפשרות לא מוכרת: ${a}`)
          err.usage = true
          throw err
        }
    }
  }
  if (!opts.prefix) opts.prefix = opts.out.split('/').filter(Boolean).pop() || 'photo'
  return opts
}

// ---------- ניתוח התמונה ----------

function median(arr) {
  const s = Float64Array.from(arr).sort()
  const m = s.length >> 1
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2
}

/**
 * מעריך את צבע רקע הסורק מטבעת הפיקסלים בשולי התמונה.
 * מחזיר null אם השוליים אינם אחידים — סימן שהתמונה ממלאת את כל הסריקה.
 */
function estimateBackground(gray, w, h) {
  const band = Math.max(2, Math.round(Math.min(w, h) * 0.02))
  const samples = []
  for (let y = 0; y < h; y++) {
    const edgeRow = y < band || y >= h - band
    for (let x = 0; x < w; x++) {
      if (edgeRow || x < band || x >= w - band) samples.push(gray[y * w + x])
    }
  }
  const bg = median(samples)
  const dev = median(samples.map((v) => Math.abs(v - bg)))
  const tol = Math.min(45, Math.max(14, dev * 4 + 8))
  const uniform = samples.filter((v) => Math.abs(v - bg) <= tol).length / samples.length
  // רקע סורק אמיתי הוא בהיר מאוד או כהה מאוד, ואחיד ברובו
  if (uniform < 0.75) return null
  if (bg > 40 && bg < 205) return null
  return { bg, tol }
}

/** מסכת תוכן: true במקום שבו הפיקסל שונה מרקע הסורק */
function buildMask(gray, w, h, { bg, tol }) {
  const mask = new Uint8Array(w * h)
  for (let i = 0; i < mask.length; i++) mask[i] = Math.abs(gray[i] - bg) > tol ? 1 : 0
  return mask
}

/** הרחבה מורפולוגית — מגשרת על פערים בתמונות בהירות שנבלעות ברקע */
function dilate(mask, w, h, r = 2) {
  const out = new Uint8Array(w * h)
  // מעבר אופקי ואז אנכי (dilation נפרדת לצירים)
  const tmp = new Uint8Array(w * h)
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let v = 0
      for (let dx = -r; dx <= r && !v; dx++) {
        const nx = x + dx
        if (nx >= 0 && nx < w && mask[y * w + nx]) v = 1
      }
      tmp[y * w + x] = v
    }
  }
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let v = 0
      for (let dy = -r; dy <= r && !v; dy++) {
        const ny = y + dy
        if (ny >= 0 && ny < h && tmp[ny * w + x]) v = 1
      }
      out[y * w + x] = v
    }
  }
  return out
}

/** רכיבי קשירות — כל רכיב הוא תמונה נפרדת על משטח הסורק */
function findRegions(mask, w, h) {
  const seen = new Uint8Array(w * h)
  const regions = []
  const stack = []
  const minArea = w * h * 0.02
  for (let i = 0; i < mask.length; i++) {
    if (!mask[i] || seen[i]) continue
    stack.length = 0
    stack.push(i)
    seen[i] = 1
    let area = 0
    let x0 = w, y0 = h, x1 = -1, y1 = -1
    while (stack.length) {
      const p = stack.pop()
      const px = p % w
      const py = (p - px) / w
      area++
      if (px < x0) x0 = px
      if (px > x1) x1 = px
      if (py < y0) y0 = py
      if (py > y1) y1 = py
      if (px > 0 && mask[p - 1] && !seen[p - 1]) { seen[p - 1] = 1; stack.push(p - 1) }
      if (px < w - 1 && mask[p + 1] && !seen[p + 1]) { seen[p + 1] = 1; stack.push(p + 1) }
      if (py > 0 && mask[p - w] && !seen[p - w]) { seen[p - w] = 1; stack.push(p - w) }
      if (py < h - 1 && mask[p + w] && !seen[p + w]) { seen[p + w] = 1; stack.push(p + w) }
    }
    if (area >= minArea) regions.push({ x0, y0, x1, y1, area })
  }
  // מיזוג תיבות שחופפות — צדדים בהירים של אותה תמונה עלולים להתפצל
  let merged = true
  while (merged) {
    merged = false
    outer: for (let i = 0; i < regions.length; i++) {
      for (let j = i + 1; j < regions.length; j++) {
        const a = regions[i], b = regions[j]
        if (a.x0 <= b.x1 && b.x0 <= a.x1 && a.y0 <= b.y1 && b.y0 <= a.y1) {
          regions[i] = {
            x0: Math.min(a.x0, b.x0), y0: Math.min(a.y0, b.y0),
            x1: Math.max(a.x1, b.x1), y1: Math.max(a.y1, b.y1),
            area: a.area + b.area,
          }
          regions.splice(j, 1)
          merged = true
          break outer
        }
      }
    }
  }
  // סדר קריאה: מלמעלה למטה, ובשורה — מימין לשמאל (סדר עברי)
  regions.sort((a, b) => (Math.abs(a.y0 - b.y0) > h * 0.1 ? a.y0 - b.y0 : b.x0 - a.x0))
  return regions
}

/** תיבת התוכן ההדוקה של אזור נתון, לפי צפיפות פיקסלים בשורות/עמודות */
function tightBox(mask, w, h, region) {
  const { x0, y0, x1, y1 } = region
  const rowMin = Math.max(3, Math.round((x1 - x0 + 1) * CONTENT_RATIO))
  const colMin = Math.max(3, Math.round((y1 - y0 + 1) * CONTENT_RATIO))
  let top = y0, bottom = y1, left = x0, right = x1
  const rowCount = (y) => {
    let c = 0
    for (let x = x0; x <= x1; x++) if (mask[y * w + x]) c++
    return c
  }
  const colCount = (x) => {
    let c = 0
    for (let y = y0; y <= y1; y++) if (mask[y * w + x]) c++
    return c
  }
  while (top < bottom && rowCount(top) < rowMin) top++
  while (bottom > top && rowCount(bottom) < rowMin) bottom--
  while (left < right && colCount(left) < colMin) left++
  while (right > left && colCount(right) < colMin) right--
  return { x0: left, y0: top, x1: right, y1: bottom }
}

/** רגרסיה לינארית פשוטה, מחזירה שיפוע ושארית ממוצעת */
function fitLine(xs, ys) {
  const n = xs.length
  if (n < 8) return null
  let sx = 0, sy = 0
  for (let i = 0; i < n; i++) { sx += xs[i]; sy += ys[i] }
  const mx = sx / n, my = sy / n
  let num = 0, den = 0
  for (let i = 0; i < n; i++) { num += (xs[i] - mx) * (ys[i] - my); den += (xs[i] - mx) ** 2 }
  if (den === 0) return null
  const slope = num / den
  const intercept = my - slope * mx
  let res = 0
  for (let i = 0; i < n; i++) res += Math.abs(ys[i] - (slope * xs[i] + intercept))
  return { slope, residual: res / n }
}

/**
 * מודד את זווית ההטיה מקצה עליון/תחתון של התמונה.
 * הקצה של מלבן מוטה הוא קו ישר — השיפוע שלו הוא הזווית.
 * מחזיר מעלות (חיובי = צריך לסובב עם כיוון השעון) או null.
 */
function measureSkew(mask, w, h, box) {
  const edgeSlope = (which) => {
    const xs = [], ys = []
    for (let x = box.x0; x <= box.x1; x++) {
      let found = -1
      if (which === 'top') {
        for (let y = box.y0; y <= box.y1; y++) if (mask[y * w + x]) { found = y; break }
      } else {
        for (let y = box.y1; y >= box.y0; y--) if (mask[y * w + x]) { found = y; break }
      }
      if (found >= 0) { xs.push(x); ys.push(found) }
    }
    if (xs.length < (box.x1 - box.x0) * 0.6) return null
    // הקודקוד מפריד בין שתי צלעות מאונכות — הצלע הארוכה והמתונה היא הקצה
    let apex = 0
    for (let i = 1; i < ys.length; i++) {
      if (which === 'top' ? ys[i] < ys[apex] : ys[i] > ys[apex]) apex = i
    }
    const sides = [
      { xs: xs.slice(0, apex + 1), ys: ys.slice(0, apex + 1) },
      { xs: xs.slice(apex), ys: ys.slice(apex) },
    ].filter((s) => s.xs.length >= xs.length * 0.35)
    let best = null
    for (const s of sides) {
      // מתעלמים מהקצוות עצמם — שם יש עיגול פינות ורעש סריקה
      const cut = Math.max(2, Math.round(s.xs.length * 0.08))
      const fit = fitLine(s.xs.slice(cut, -cut || undefined), s.ys.slice(cut, -cut || undefined))
      if (!fit || fit.residual > 1.6) continue
      if (!best || Math.abs(fit.slope) < Math.abs(best.slope)) best = fit
    }
    return best ? best.slope : null
  }

  const top = edgeSlope('top')
  const bottom = edgeSlope('bottom')
  if (top === null || bottom === null) return null
  const a = (Math.atan(top) * 180) / Math.PI
  const b = (Math.atan(bottom) * 180) / Math.PI
  // שני הקצוות מקבילים — אם הם לא מסכימים, המדידה לא אמינה
  if (Math.abs(a - b) > 0.7) return null
  const angle = (a + b) / 2
  if (Math.abs(angle) < DESKEW_MIN || Math.abs(angle) > DESKEW_MAX) return null
  return angle
}

/** מנתח תמונה: מחזיר רקע, אזורי תמונה ותיבות הדוקות בקנה מידה מקורי */
async function analyze(buf) {
  const meta = await sharp(buf).metadata()
  const W = meta.width, H = meta.height
  const scale = Math.min(1, ANALYZE_W / W)
  const aw = Math.max(8, Math.round(W * scale))
  const ah = Math.max(8, Math.round(H * scale))
  const { data } = await sharp(buf)
    .resize(aw, ah, { fit: 'fill' })
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const bgInfo = estimateBackground(data, aw, ah)
  if (!bgInfo) return { W, H, aw, ah, bgInfo: null, regions: [], mask: null }

  const mask = buildMask(data, aw, ah, bgInfo)
  const regions = findRegions(dilate(mask, aw, ah, 2), aw, ah)
  return { W, H, aw, ah, bgInfo, regions, mask }
}

// ---------- עיבוד ----------

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v))

/** ממיר תיבה מקנה המידה של הניתוח לפיקסלים מקוריים, עם שוליים פנימיים */
function toSource(box, a, insetRatio = 0) {
  const sx = a.W / a.aw
  const sy = a.H / a.ah
  const bw = (box.x1 - box.x0 + 1) * sx
  const bh = (box.y1 - box.y0 + 1) * sy
  const inset = Math.round(Math.min(bw, bh) * insetRatio)
  const left = clamp(Math.round(box.x0 * sx) + inset, 0, a.W - 1)
  const top = clamp(Math.round(box.y0 * sy) + inset, 0, a.H - 1)
  const width = clamp(Math.round(bw) - inset * 2, 1, a.W - left)
  const height = clamp(Math.round(bh) - inset * 2, 1, a.H - top)
  return { left, top, width, height }
}

/** דוחס עד שהקובץ נכנס לתקציב המשקל */
async function encode(pipeline, format, budgetKb) {
  const qualities = [82, 76, 70, 64, 58, 50]
  let last = null
  for (const quality of qualities) {
    const clone = pipeline.clone()
    const buf = format === 'jpeg'
      ? await clone.jpeg({ quality, mozjpeg: true }).toBuffer()
      : await clone.webp({ quality, effort: 5 }).toBuffer()
    last = { buf, quality }
    if (buf.length <= budgetKb * 1024) return last
  }
  return last
}

async function processFile(file, opts, state) {
  const original = relative(resolve(opts.in), file).split(sep).join('/')
  const notes = []
  const oriented = await sharp(file, { failOn: 'none' }).rotate().toBuffer()
  const outputs = []

  if (!opts.crop) {
    outputs.push({ buf: oriented, part: null })
    notes.push('ללא חיתוך (--no-crop)')
  } else {
    const a = await analyze(oriented)
    if (!a.bgInfo) {
      notes.push('לא זוהו שולי סורק — התמונה נשמרה כמות שהיא')
      outputs.push({ buf: oriented, part: null })
    } else {
      let regions = a.regions
      if (regions.length === 0) {
        notes.push('לא זוהה תוכן — נשמרה כמות שהיא')
        outputs.push({ buf: oriented, part: null })
        regions = []
      } else if (regions.length > 1 && !opts.split) {
        notes.push(`בסריקה יש ${regions.length} תמונות — הריצו שוב עם --split כדי לפצל`)
        // חותכים סביב כולן יחד
        regions = [regions.reduce((acc, r) => ({
          x0: Math.min(acc.x0, r.x0), y0: Math.min(acc.y0, r.y0),
          x1: Math.max(acc.x1, r.x1), y1: Math.max(acc.y1, r.y1),
        }))]
      }

      for (let i = 0; i < regions.length; i++) {
        const tight = tightBox(a.mask, a.aw, a.ah, regions[i])
        // שוליים רחבים הם מצב רגיל בסריקה; מה שחשוד הוא חיתוך לרסיס או ליחס קיצוני
        const cropW = (tight.x1 - tight.x0 + 1) / a.aw
        const cropH = (tight.y1 - tight.y0 + 1) / a.ah
        const aspect = (tight.x1 - tight.x0 + 1) / (tight.y1 - tight.y0 + 1)
        const sane = cropW * cropH >= MIN_CROP_AREA
          && cropW >= MIN_CROP_SIDE && cropH >= MIN_CROP_SIDE
          && aspect <= MAX_CROP_ASPECT && aspect >= 1 / MAX_CROP_ASPECT
        if (!sane) {
          notes.push('החיתוך שזוהה נראה שגוי — נשמרה בלי חיתוך, בדקו ידנית')
          outputs.push({ buf: oriented, part: null })
          continue
        }

        const angle = opts.deskew ? measureSkew(a.mask, a.aw, a.ah, tight) : null
        let buf
        if (angle !== null) {
          // מסובבים חתיכה מרווחת כדי לא לאבד פינות, ואז חותכים מחדש
          const loose = toSource(tight, a, -0.02)
          const bgLevel = Math.round(a.bgInfo.bg)
          const rotated = await sharp(oriented)
            .extract(loose)
            // הזווית שנמדדה היא ההטיה עצמה — מסובבים בכיוון ההפוך כדי לבטל אותה
            .rotate(-angle, { background: { r: bgLevel, g: bgLevel, b: bgLevel, alpha: 1 } })
            .toBuffer()
          const a2 = await analyze(rotated)
          if (a2.bgInfo && a2.regions.length) {
            const t2 = tightBox(a2.mask, a2.aw, a2.ah, a2.regions[0])
            buf = await sharp(rotated).extract(toSource(t2, a2, 0.006)).toBuffer()
          } else {
            buf = await sharp(rotated).toBuffer()
          }
          notes.push(`יושרה הטיה של ${angle.toFixed(1)}°`)
        } else {
          buf = await sharp(oriented).extract(toSource(tight, a, 0.004)).toBuffer()
        }
        outputs.push({ buf, part: regions.length > 1 ? i : null })
        if (regions.length > 1 && i === 0) notes.push(`פוצלה ל-${regions.length} תמונות`)
      }
    }
  }

  const results = []
  state.index++
  const sourceMeta = await sharp(oriented).metadata()
  for (const out of outputs) {
    const manual = opts.rotationMap?.[original] ?? opts.rotationMap?.[basename(original)] ?? 0
    const outNotes = [...notes]
    let pipeline = sharp(out.buf)
    if (manual) {
      pipeline = sharp(await pipeline.rotate(manual).toBuffer())
      outNotes.push(`סובבה ידנית ${manual}°`)
    }
    pipeline = pipeline.resize(opts.max, opts.max, { fit: 'inside', withoutEnlargement: true })

    const suffix = out.part === null ? '' : String.fromCharCode(97 + out.part)
    const name = `${opts.prefix}-${String(state.index).padStart(2, '0')}${suffix}.${opts.format === 'jpeg' ? 'jpg' : 'webp'}`
    const dest = join(root, 'public', opts.out, name)

    const enc = await encode(pipeline, opts.format, opts.budget)
    const meta = await sharp(enc.buf).metadata()
    if (!opts.dry) {
      await mkdir(dirname(dest), { recursive: true })
      await writeFile(dest, enc.buf)
    }
    results.push({
      original,
      name,
      src: `${opts.out}/${name}`,
      width: meta.width,
      height: meta.height,
      sourceWidth: sourceMeta.width,
      sourceHeight: sourceMeta.height,
      bytes: enc.buf.length,
      quality: enc.quality,
      notes: outNotes,
      portrait: meta.height > meta.width,
    })
  }
  return results
}

// ---------- דף בדיקה ----------

function reviewHtml(results, opts) {
  const cards = results.map((r) => `
    <figure class="card" data-file="${escapeHtml(r.original)}">
      <img src="../public/${r.src}" alt="${escapeHtml(r.name)}" loading="lazy">
      <figcaption>
        <div class="name">${escapeHtml(r.name)}</div>
        <div class="orig">${escapeHtml(r.original)}</div>
        ${r.notes.length ? `<div class="notes">${r.notes.map(escapeHtml).join(' · ')}</div>` : ''}
        <div class="controls">
          <button data-rot="-90" title="סיבוב נגד כיוון השעון">⟲</button>
          <button data-rot="180" title="הפיכה">180°</button>
          <button data-rot="90" title="סיבוב עם כיוון השעון">⟳</button>
          <span class="state">0°</span>
        </div>
      </figcaption>
    </figure>`).join('\n')

  const snippet = results
    .map((r) => `  { src: '${r.src}', caption: '' },`)
    .join('\n')

  return `<!doctype html>
<html lang="he" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>בדיקת תמונות — ${escapeHtml(opts.prefix)}</title>
<style>
  :root { color-scheme: light; --navy:#22304a; --cream:#fbf9f4; --gold:#b8976a; }
  body { margin:0; padding:24px; background:var(--cream); color:var(--navy);
         font-family:"Assistant","Segoe UI",system-ui,sans-serif; }
  h1 { font-size:22px; margin:0 0 4px; }
  p.lead { margin:0 0 20px; opacity:.75; font-size:14px; line-height:1.6; }
  .grid { display:grid; gap:16px; grid-template-columns:repeat(auto-fill,minmax(240px,1fr)); }
  .card { margin:0; background:#fff; border:1px solid #e6e0d4; border-radius:10px;
          overflow:hidden; display:flex; flex-direction:column; }
  .card img { width:100%; height:220px; object-fit:contain; background:#f2eee5;
              transition:transform .15s ease; }
  figcaption { padding:10px 12px 12px; font-size:12px; }
  .name { font-weight:700; }
  .orig { opacity:.6; word-break:break-all; margin:2px 0 4px; }
  .notes { color:#7a5f2e; margin-bottom:6px; }
  .controls { display:flex; gap:6px; align-items:center; }
  button { font:inherit; cursor:pointer; border:1px solid #d8cfbc; background:#fff;
           border-radius:6px; padding:3px 9px; }
  button:hover { background:#f6f1e6; }
  .state { margin-inline-start:auto; opacity:.6; }
  .card.changed { outline:2px solid var(--gold); }
  .bar { position:sticky; top:0; z-index:5; background:var(--cream); padding:10px 0 14px;
         margin-bottom:8px; border-bottom:1px solid #e6e0d4; }
  .bar button { padding:7px 14px; }
  textarea { width:100%; height:120px; font-family:ui-monospace,monospace; font-size:12px;
             direction:ltr; text-align:left; margin-top:8px; border:1px solid #e6e0d4;
             border-radius:8px; padding:8px; }
  details { margin-top:24px; }
</style>
</head>
<body>
<h1>בדיקת תמונות — ${escapeHtml(opts.prefix)}</h1>
<p class="lead">
  ${results.length} תמונות עובדו. סובבו כאן כל תמונה ששוכבת על הצד, ואז לחצו
  «שמירת קובץ הסיבובים» — הקובץ יורד כ-<code>rotations.json</code>. שימו אותו
  בתיקיית הפרויקט והריצו שוב את אותה פקודה עם <code>--rotations rotations.json</code>.
</p>
<div class="bar">
  <button id="save">שמירת קובץ הסיבובים</button>
  <span id="count" style="margin-inline-start:10px;opacity:.7"></span>
</div>
<div class="grid">
${cards}
</div>

<details open>
  <summary>שורות מוכנות להדבקה בקובץ התוכן</summary>
  <textarea readonly>${escapeHtml(snippet)}</textarea>
</details>

<script>
  const rot = {}
  document.querySelectorAll('.card').forEach((card) => {
    const img = card.querySelector('img')
    const state = card.querySelector('.state')
    const file = card.dataset.file
    card.querySelectorAll('button').forEach((b) => b.addEventListener('click', () => {
      const next = (((rot[file] || 0) + Number(b.dataset.rot)) % 360 + 360) % 360
      if (next) rot[file] = next; else delete rot[file]
      img.style.transform = 'rotate(' + next + 'deg) scale(' + (next % 180 ? 0.72 : 1) + ')'
      state.textContent = next + '\\u00B0'
      card.classList.toggle('changed', Boolean(next))
      document.getElementById('count').textContent =
        Object.keys(rot).length ? Object.keys(rot).length + ' תמונות סומנו לסיבוב' : ''
    }))
  })
  document.getElementById('save').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(rot, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'rotations.json'
    a.click()
  })
</script>
</body>
</html>`
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ))
}

// ---------- ריצה ----------

async function collect(dir, recursive) {
  const out = []
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      if (recursive) out.push(...await collect(full, true))
    } else if (SUPPORTED.has(extname(entry.name).toLowerCase())) {
      out.push(full)
    }
  }
  return out.sort((a, b) => a.localeCompare(b, 'he'))
}

const HELP = `
הכנת תמונות סרוקות לאתר ההנצחה

  npm run photos -- --in "<תיקיית הסריקות>" --out images/gallery/<אלבום> [--split]

ראו את ההערות בראש הקובץ scripts/prepare-photos.mjs לרשימת האפשרויות המלאה.
`

async function main() {
  const opts = parseArgs(process.argv.slice(2))
  if (opts.help || !opts.in) {
    console.log(HELP)
    process.exit(opts.in ? 0 : 1)
  }
  const srcDir = resolve(opts.in)
  if (!existsSync(srcDir) || !(await stat(srcDir)).isDirectory()) {
    console.error(`התיקייה לא נמצאה: ${srcDir}`)
    process.exit(1)
  }
  if (opts.rotations) {
    const raw = await readFile(resolve(opts.rotations), 'utf8')
    opts.rotationMap = JSON.parse(raw)
    console.log(`נטענו ${Object.keys(opts.rotationMap).length} סיבובים ידניים`)
  }

  const files = await collect(srcDir, opts.recursive)
  if (!files.length) {
    console.error(`לא נמצאו תמונות ב-${srcDir}`)
    process.exit(1)
  }
  console.log(`נמצאו ${files.length} תמונות ב-${srcDir}`)
  console.log(`יעד: public/${opts.out}/  ·  עד ${opts.max}px  ·  עד ${opts.budget}KB  ·  ${opts.format}`)
  if (opts.dry) console.log('מצב בדיקה — לא ייכתבו קבצים')
  console.log('')

  const state = { index: 0 }
  const results = []
  const failures = []
  for (const file of files) {
    try {
      const res = await processFile(file, opts, state)
      for (const r of res) {
        const size = `${(r.bytes / 1024).toFixed(0)}KB`
        const dims = `${r.sourceWidth}×${r.sourceHeight} → ${r.width}×${r.height}`
        console.log(`✓ ${r.original}  →  ${r.name}  (${dims}, ${size})`)
        if (r.notes.length) console.log(`    ${r.notes.join(' · ')}`)
        results.push(r)
      }
    } catch (err) {
      failures.push({ file, message: err.message })
      console.error(`✗ ${file}: ${err.message}`)
    }
  }

  if (!opts.dry && results.length) {
    const reviewDir = join(root, 'photo-review')
    await mkdir(reviewDir, { recursive: true })
    const page = join(reviewDir, `${opts.prefix}.html`)
    await writeFile(page, reviewHtml(results, opts))
    await writeFile(
      join(reviewDir, `${opts.prefix}.json`),
      JSON.stringify({ options: { ...opts, rotationMap: undefined }, results }, null, 2),
    )
    console.log(`\nדף בדיקה: ${page}`)
    console.log('פתחו אותו בדפדפן, סובבו מה שצריך, ושמרו את rotations.json')
  }

  const heavy = results.filter((r) => r.bytes > opts.budget * 1024)
  const verb = opts.dry ? 'יעובדו' : 'נכתבו'
  console.log(`\nסיכום: ${results.length} קבצים ${verb}, ${failures.length} שגיאות`)
  if (heavy.length) {
    console.log(`⚠ ${heavy.length} קבצים עדיין מעל ${opts.budget}KB — שקלו --max 1000`)
  }
  const portrait = results.filter((r) => r.portrait).length
  console.log(`   ${portrait} לאורך · ${results.length - portrait} לרוחב`)
}

main().catch((err) => {
  console.error(err.usage ? `${err.message}\n${HELP}` : err)
  process.exit(1)
})
