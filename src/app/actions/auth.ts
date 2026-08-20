'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const supabase = createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  redirect('/')
}

export async function register(formData: FormData) {
  const supabase = createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const secretKey = formData.get('secret_key') as string

  // Verifica la chiave segreta (impostata nelle variabili d'ambiente)
  const expectedSecret = process.env.REGISTRATION_SECRET || 'MilioniPandini26'
  
  if (secretKey !== expectedSecret) {
    return { error: 'Chiave segreta di laboratorio errata!' }
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: 'Registrazione completata! Controlla la tua email per confermare, o effettua il login se la conferma email è disabilitata.' }
}

export async function logout() {
  const supabase = createClient()
  await supabase.auth.signOut()
  redirect('/auth/login')
}
