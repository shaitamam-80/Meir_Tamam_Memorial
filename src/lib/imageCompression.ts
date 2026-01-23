import imageCompression from 'browser-image-compression'

export interface CompressionOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number
  maxSizeMB?: number
}

const DEFAULT_OPTIONS: CompressionOptions = {
  maxWidth: 1920,
  maxHeight: 1920,
  quality: 0.8,
  maxSizeMB: 0.5, // 500KB max
}

/**
 * Compress an image file before upload
 * Targets WebP format if browser supports it
 */
export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<File> {
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options }

  const compressionOptions = {
    maxSizeMB: mergedOptions.maxSizeMB,
    maxWidthOrHeight: Math.max(
      mergedOptions.maxWidth ?? 1920,
      mergedOptions.maxHeight ?? 1920
    ),
    useWebWorker: true,
    initialQuality: mergedOptions.quality,
    // Try to use WebP if supported
    fileType: 'image/webp' as const,
  }

  try {
    const compressedFile = await imageCompression(file, compressionOptions)
    return compressedFile
  } catch (error) {
    // Fallback to JPEG if WebP fails
    const fallbackOptions = {
      ...compressionOptions,
      fileType: 'image/jpeg' as const,
    }
    return imageCompression(file, fallbackOptions)
  }
}

/**
 * Get the file extension based on MIME type
 */
export function getExtensionFromMimeType(mimeType: string): string {
  const mimeToExt: Record<string, string> = {
    'image/webp': 'webp',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
  }
  return mimeToExt[mimeType] || 'jpg'
}

/**
 * Generate a unique filename with proper extension
 */
export function generateUniqueFilename(
  originalName: string,
  mimeType: string
): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  const extension = getExtensionFromMimeType(mimeType)
  const baseName = originalName.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9]/g, '_')
  return `${baseName}_${timestamp}_${random}.${extension}`
}
