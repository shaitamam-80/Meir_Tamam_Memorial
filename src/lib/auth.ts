import { supabase } from './supabase'
import type { User, AuthChangeEvent, Session } from '@supabase/supabase-js'

/**
 * Send a magic link to the user's email for passwordless authentication
 */
export async function signInWithMagicLink(email: string): Promise<{ error: Error | null }> {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/admin/auth/callback`,
    },
  })

  return { error }
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<{ error: Error | null }> {
  const { error } = await supabase.auth.signOut()
  return { error }
}

/**
 * Get the currently authenticated user
 */
export async function getCurrentUser(): Promise<User | null> {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

/**
 * Get the current session
 */
export async function getSession(): Promise<Session | null> {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

/**
 * Subscribe to authentication state changes
 */
export function onAuthStateChange(
  callback: (event: AuthChangeEvent, session: Session | null) => void
) {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(callback)
  return subscription
}

/**
 * Check if an email is authorized (exists in family_members table)
 */
export async function checkIsAuthorizedEmail(email: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('family_members')
    .select('id')
    .eq('email', email.toLowerCase())
    .single()

  if (error || !data) {
    return false
  }

  return true
}

/**
 * Get the current user's family member record with role info
 */
export async function getCurrentFamilyMember() {
  const user = await getCurrentUser()
  if (!user?.email) return null

  const { data, error } = await supabase
    .from('family_members')
    .select('*')
    .eq('email', user.email.toLowerCase())
    .single()

  if (error || !data) {
    return null
  }

  return data
}
