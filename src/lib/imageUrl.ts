const supabaseUrl = import.meta.env.VITE_SUPABASE_URL

export interface ImageTransformOptions {
  width?: number
  height?: number
  quality?: number
  resize?: 'cover' | 'contain' | 'fill'
  format?: 'origin' | 'webp'
}

/**
 * Generate an optimized Supabase Storage URL with image transformations
 * Uses Supabase Image Transformations API for on-the-fly optimization
 *
 * @param storagePath - The path to the image in Supabase Storage (e.g., "photos/image.jpg")
 * @param bucket - The storage bucket name (default: "photos")
 * @param options - Transform options for optimization
 */
export function getOptimizedUrl(
  storagePath: string,
  bucket: string = 'photos',
  options: ImageTransformOptions = {}
): string {
  if (!supabaseUrl) {
    console.error('VITE_SUPABASE_URL not configured')
    return ''
  }

  // Default options for cemetery-optimized loading
  const {
    width,
    height,
    quality = 80,
    resize = 'cover',
    format = 'webp',
  } = options

  // Build the transform URL
  const params = new URLSearchParams()

  if (width) params.set('width', width.toString())
  if (height) params.set('height', height.toString())
  params.set('quality', quality.toString())
  params.set('resize', resize)
  if (format !== 'origin') params.set('format', format)

  // Supabase Image Transformation URL format
  return `${supabaseUrl}/storage/v1/render/image/public/${bucket}/${storagePath}?${params.toString()}`
}

/**
 * Get thumbnail URL (400px width, optimized for grid)
 */
export function getThumbnailUrl(storagePath: string, bucket: string = 'photos'): string {
  return getOptimizedUrl(storagePath, bucket, { width: 400, quality: 80 })
}

/**
 * Get full-size URL for lightbox (1200px max width)
 */
export function getFullSizeUrl(storagePath: string, bucket: string = 'photos'): string {
  return getOptimizedUrl(storagePath, bucket, { width: 1200, quality: 85 })
}

/**
 * Get hero image URL (larger, high quality for featured content)
 */
export function getHeroUrl(storagePath: string, bucket: string = 'photos'): string {
  return getOptimizedUrl(storagePath, bucket, { width: 1600, quality: 90 })
}

/**
 * Get the raw storage URL (without transformations)
 * Use sparingly - prefer optimized URLs
 */
export function getRawStorageUrl(storagePath: string, bucket: string = 'photos'): string {
  if (!supabaseUrl) {
    console.error('VITE_SUPABASE_URL not configured')
    return ''
  }
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${storagePath}`
}
