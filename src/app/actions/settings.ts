'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createLocation(formData: FormData) {
  const supabase = createClient()
  const rawData = {
    name: formData.get('name') as string,
    electricity_cost_kwh: Number(formData.get('electricity_cost_kwh') || 0),
  }
  const { error } = await supabase.from('locations').insert([rawData])
  if (error) throw new Error(error.message)
  revalidatePath('/settings')
}

export async function deleteLocation(id: string) {
  const supabase = createClient()
  const { error } = await supabase.from('locations').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/settings')
}

export async function updateLocation(id: string, formData: FormData) {
  const supabase = createClient()
  const rawData = {
    name: formData.get('name') as string,
    electricity_cost_kwh: Number(formData.get('electricity_cost_kwh') || 0),
  }
  const { error } = await supabase.from('locations').update(rawData).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/settings')
}

export async function createPrinter(formData: FormData) {
  const supabase = createClient()
  const rawData = {
    model_name: formData.get('model_name') as string,
    location_id: formData.get('location_id') as string,
    power_consumption_w: Number(formData.get('power_consumption_w') || 0),
    status: formData.get('status') as string || 'active',
  }
  const { error } = await supabase.from('printers').insert([rawData])
  if (error) throw new Error(error.message)
  revalidatePath('/settings')
}

export async function deletePrinter(id: string) {
  const supabase = createClient()
  const { error } = await supabase.from('printers').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/settings')
}

export async function updatePrinter(id: string, formData: FormData) {
  const supabase = createClient()
  const rawData = {
    model_name: formData.get('model_name') as string,
    location_id: formData.get('location_id') as string,
    power_consumption_w: Number(formData.get('power_consumption_w') || 0),
    status: formData.get('status') as string || 'active',
  }
  const { error } = await supabase.from('printers').update(rawData).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/settings')
}

export async function createExpense(formData: FormData) {
  const supabase = createClient()
  const rawData = {
    title: formData.get('title') as string,
    category: formData.get('category') as string,
    amount: Number(formData.get('amount') || 0),
    expense_date: formData.get('expense_date') as string,
    notes: formData.get('notes') as string || '',
  }
  const { error } = await supabase.from('expenses').insert([rawData])
  if (error) throw new Error(error.message)
  revalidatePath('/settings/expenses')
  revalidatePath('/')
}

export async function deleteExpense(id: string) {
  const supabase = createClient()
  const { error } = await supabase.from('expenses').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/settings/expenses')
  revalidatePath('/')
}
