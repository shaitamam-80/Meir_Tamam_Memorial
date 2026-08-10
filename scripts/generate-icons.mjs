/**
 * Generates PWA icons (memorial candle on navy) as PNG files,
 * with no external dependencies (pure Node: zlib + hand-rolled PNG encoder).
 *
 * Run: npm run icons
 * Outputs: public/pwa-192x192.png, public/pwa-512x512.png, public/apple-touch-icon.png
 */
import { deflateSync } from 'node:zlib'
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

// ---- Minimal PNG encoder (RGBA, 8-bit) ----
const CRC_TABLE = (() => {
  const t = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    t[n] = c >>> 0
  }
  return t
})()

function crc32(buf) {
  let c = 0xffffffff
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const typeBuf = Buffer.from(type, 'ascii')
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])))
  return Buffer.concat([len, typeBuf, data, crc])
}

function encodePng(width, height, rgba) {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 6 // color type RGBA
  // scanlines with filter byte 0
  const raw = Buffer.alloc((width * 4 + 1) * height)
  for (let y = 0; y < height; y++) {
    raw[y * (width * 4 + 1)] = 0
    rgba.copy(raw, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4)
  }
  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

// ---- Scene: memorial candle on navy ----
const NAVY = [30, 43, 75]
const GOLD = [201, 169, 98]
const CORE = [251, 243, 222]
const WAX = [239, 232, 216]
const HOLDER = [138, 112, 64]

function inTriangle(px, py, ax, ay, bx, by, cx, cy) {
  const d1 = (px - bx) * (ay - by) - (ax - bx) * (py - by)
  const d2 = (px - cx) * (by - cy) - (bx - cx) * (py - cy)
  const d3 = (px - ax) * (cy - ay) - (cx - ax) * (py - ay)
  const neg = d1 < 0 || d2 < 0 || d3 < 0
  const pos = d1 > 0 || d2 > 0 || d3 > 0
  return !(neg && pos)
}

/** Returns [r,g,b] color for normalized point (u,v) in [0,1] */
function sample(u, v) {
  // flame teardrop: circle + triangle tip
  const fcx = 0.5, fcy = 0.47, fr = 0.115
  const dx = u - fcx, dy = v - fcy
  const inFlame =
    dx * dx + dy * dy <= fr * fr ||
    inTriangle(u, v, 0.5, 0.2, fcx - 0.1, fcy - 0.02, fcx + 0.1, fcy - 0.02)
  if (inFlame) {
    // bright core
    const ex = (u - 0.5) / 0.05, ey = (v - 0.5) / 0.07
    if (ex * ex + ey * ey <= 1) return CORE
    return GOLD
  }
  // candle body
  if (u >= 0.44 && u <= 0.56 && v >= 0.62 && v <= 0.8) return WAX
  // holder
  if (u >= 0.4 && u <= 0.6 && v >= 0.8 && v <= 0.85) return HOLDER
  // soft glow around flame on navy
  const dist = Math.sqrt(dx * dx + dy * dy)
  const glow = Math.max(0, 1 - dist / 0.34)
  const g = glow * glow * 0.28
  return [
    NAVY[0] + (GOLD[0] - NAVY[0]) * g,
    NAVY[1] + (GOLD[1] - NAVY[1]) * g,
    NAVY[2] + (GOLD[2] - NAVY[2]) * g,
  ]
}

function render(size) {
  const rgba = Buffer.alloc(size * size * 4)
  const SS = 3 // supersampling grid per axis
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let r = 0, g = 0, b = 0
      for (let sy = 0; sy < SS; sy++) {
        for (let sx = 0; sx < SS; sx++) {
          const [cr, cg, cb] = sample((x + (sx + 0.5) / SS) / size, (y + (sy + 0.5) / SS) / size)
          r += cr; g += cg; b += cb
        }
      }
      const i = (y * size + x) * 4
      rgba[i] = r / (SS * SS)
      rgba[i + 1] = g / (SS * SS)
      rgba[i + 2] = b / (SS * SS)
      rgba[i + 3] = 255
    }
  }
  return encodePng(size, size, rgba)
}

mkdirSync(join(root, 'public'), { recursive: true })
for (const [file, size] of [
  ['pwa-192x192.png', 192],
  ['pwa-512x512.png', 512],
  ['apple-touch-icon.png', 180],
]) {
  writeFileSync(join(root, 'public', file), render(size))
  console.log(`created public/${file}`)
}
