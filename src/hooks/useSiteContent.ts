import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { SiteContent } from '@/types/database.types'

export function useSiteContent() {
  return useQuery({
    queryKey: ['siteContent'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_content')
        .select('*')

      if (error) throw error

      // Convert array to key-value object for easy access
      const content: Record<string, string> = {}
      for (const item of data as SiteContent[]) {
        content[item.key] = item.content
      }
      return content
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - good for cemetery visits
  })
}

export function useSiteContentItem(key: string) {
  return useQuery({
    queryKey: ['siteContent', key],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_content')
        .select('content')
        .eq('key', key)
        .single()

      if (error) throw error
      return data?.content || null
    },
    staleTime: 5 * 60 * 1000,
  })
}

// Biography chapters helper
export interface BiographyChapter {
  key: string
  title: string
  content: string
}

const BIOGRAPHY_CHAPTER_CONFIG = [
  { key: 'biography_chapter1', title: 'שורשים וילדות – מנבל לישראל' },
  { key: 'biography_chapter2', title: 'אהבה, משפחה וקריירה' },
  { key: 'biography_chapter3', title: 'הנס והבחירה בנתינה' },
  { key: 'biography_chapter4', title: 'סבא של אהבה ומסורת' },
]

export function useBiographyChapters() {
  const { data: siteContent, isLoading, error } = useSiteContent()

  const chapters: BiographyChapter[] = []

  if (siteContent) {
    for (const config of BIOGRAPHY_CHAPTER_CONFIG) {
      if (siteContent[config.key]) {
        chapters.push({
          key: config.key,
          title: config.title,
          content: siteContent[config.key],
        })
      }
    }
  }

  return { data: chapters, isLoading, error }
}
