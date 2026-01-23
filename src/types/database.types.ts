/**
 * Database types for Supabase tables
 * These types should match the Supabase schema
 */

// Enum types
export type MemoryStatus = 'pending' | 'approved' | 'rejected'
export type FamilyRole = 'admin' | 'editor'

// Table types
export interface FamilyMember {
  id: string
  email: string
  name: string
  role: FamilyRole
  created_at: string
}

export interface SiteContent {
  id: string
  key: string
  content: string
  updated_at: string
  updated_by: string | null
}

export interface TimelineEvent {
  id: string
  year: number
  title: string
  description: string | null
  photo_url: string | null
  display_order: number
  created_at: string
}

export interface Album {
  id: string
  name: string
  description: string | null
  cover_photo_url: string | null
  display_order: number
  created_at: string
}

export interface Photo {
  id: string
  album_id: string
  storage_path: string
  caption: string | null
  photo_date: string | null
  display_order: number
  uploaded_by: string | null
  created_at: string
}

export interface RecipeCategory {
  id: string
  name: string
  display_order: number
  created_at: string
}

export interface Recipe {
  id: string
  category_id: string | null
  name: string
  ingredients: string
  instructions: string
  photo_url: string | null
  display_order: number
  created_at: string
}

export interface Memory {
  id: string
  visitor_name: string
  relationship: string | null
  content: string
  status: MemoryStatus
  reviewed_by: string | null
  reviewed_at: string | null
  created_at: string
}

// Insert types (for creating new records)
export interface InsertFamilyMember {
  id?: string
  email: string
  name: string
  role?: FamilyRole
  created_at?: string
}

export interface InsertSiteContent {
  id?: string
  key: string
  content: string
  updated_at?: string
  updated_by?: string | null
}

export interface InsertTimelineEvent {
  id?: string
  year: number
  title: string
  description?: string | null
  photo_url?: string | null
  display_order?: number
  created_at?: string
}

export interface InsertAlbum {
  id?: string
  name: string
  description?: string | null
  cover_photo_url?: string | null
  display_order?: number
  created_at?: string
}

export interface InsertPhoto {
  id?: string
  album_id: string
  storage_path: string
  caption?: string | null
  photo_date?: string | null
  display_order?: number
  uploaded_by?: string | null
  created_at?: string
}

export interface InsertRecipeCategory {
  id?: string
  name: string
  display_order?: number
  created_at?: string
}

export interface InsertRecipe {
  id?: string
  category_id?: string | null
  name: string
  ingredients: string
  instructions: string
  photo_url?: string | null
  display_order?: number
  created_at?: string
}

export interface InsertMemory {
  id?: string
  visitor_name: string
  relationship?: string | null
  content: string
  status?: MemoryStatus
  reviewed_by?: string | null
  reviewed_at?: string | null
  created_at?: string
}

// Update types (for updating existing records)
export interface UpdateFamilyMember {
  email?: string
  name?: string
  role?: FamilyRole
}

export interface UpdateSiteContent {
  content?: string
  updated_at?: string
  updated_by?: string | null
}

export interface UpdateTimelineEvent {
  year?: number
  title?: string
  description?: string | null
  photo_url?: string | null
  display_order?: number
}

export interface UpdateAlbum {
  name?: string
  description?: string | null
  cover_photo_url?: string | null
  display_order?: number
}

export interface UpdatePhoto {
  album_id?: string
  storage_path?: string
  caption?: string | null
  photo_date?: string | null
  display_order?: number
}

export interface UpdateRecipeCategory {
  name?: string
  display_order?: number
}

export interface UpdateRecipe {
  category_id?: string | null
  name?: string
  ingredients?: string
  instructions?: string
  photo_url?: string | null
  display_order?: number
}

export interface UpdateMemory {
  visitor_name?: string
  relationship?: string | null
  content?: string
  status?: MemoryStatus
  reviewed_by?: string | null
  reviewed_at?: string | null
}

// Database schema type for Supabase client
export interface Database {
  public: {
    Tables: {
      family_members: {
        Row: FamilyMember
        Insert: InsertFamilyMember
        Update: UpdateFamilyMember
      }
      site_content: {
        Row: SiteContent
        Insert: InsertSiteContent
        Update: UpdateSiteContent
      }
      timeline_events: {
        Row: TimelineEvent
        Insert: InsertTimelineEvent
        Update: UpdateTimelineEvent
      }
      albums: {
        Row: Album
        Insert: InsertAlbum
        Update: UpdateAlbum
      }
      photos: {
        Row: Photo
        Insert: InsertPhoto
        Update: UpdatePhoto
      }
      recipe_categories: {
        Row: RecipeCategory
        Insert: InsertRecipeCategory
        Update: UpdateRecipeCategory
      }
      recipes: {
        Row: Recipe
        Insert: InsertRecipe
        Update: UpdateRecipe
      }
      memories: {
        Row: Memory
        Insert: InsertMemory
        Update: UpdateMemory
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      memory_status: MemoryStatus
      family_role: FamilyRole
    }
  }
}

// Helper type aliases for convenience
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']

export type Insertable<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert']

export type Updatable<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update']
