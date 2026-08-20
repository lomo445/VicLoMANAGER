'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createMaterial(formData: FormData) {
  const supabase = createClient()
  const rawData = {
    brand: formData.get('brand') as string,
    material_type: formData.get('material_type') as string,
    
    
    
    cost_per_kg: Number(formData.get('cost_per_kg') || 0),
    
  }
  const { error } = await supabase.from('materials').insert([rawData])
  if (error) throw new Error(error.message)
  revalidatePath('/inventory')
}

export async function updateMaterial(id: string, formData: FormData) {
  const supabase = createClient()
  const rawData = {
    brand: formData.get("brand") as string,
    material_type: formData.get("material_type") as string,
    cost_per_kg: Number(formData.get("cost_per_kg") || 0),
  }
  const { error } = await supabase.from("materials").update(rawData).eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath("/inventory")
}

export async function deleteMaterial(id: string) {
  const supabase = createClient()
  const { error } = await supabase.from('materials').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/inventory')
}

export async function createProduct(formData: FormData) {
  const supabase = createClient()
  const rawData = {
    name: formData.get('name') as string,
    type: formData.get('type') as string || 'standard',
    base_weight_g: Number(formData.get('base_weight_g') || 0),
    base_print_time_minutes: Number(formData.get('base_print_time_minutes') || 0),
    base_selling_price: Number(formData.get('base_selling_price') || 0),
    printer_id: formData.get('printer_id') as string || null,
    material_id: formData.get('material_id') as string || null,
  }
  const { error } = await supabase.from('products').insert([rawData])
  if (error) throw new Error(error.message)
  revalidatePath('/inventory')
}

export async function updateProduct(id: string, formData: FormData) {
  const supabase = createClient()
  const rawData = {
    name: formData.get('name') as string,
    base_weight_g: Number(formData.get('base_weight_g') || 0),
    base_print_time_minutes: Number(formData.get('base_print_time_minutes') || 0),
    base_selling_price: Number(formData.get('base_selling_price') || 0),
    material_id: formData.get('material_id') as string || null,
  }
  const { error } = await supabase.from('products').update(rawData).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/inventory')
}

export async function deleteProduct(id: string) {
  const supabase = createClient()
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/inventory')
}

export async function createExtra(formData: FormData) {
  const supabase = createClient()
  const rawData = {
    name: formData.get('name') as string,
    default_cost: Number(formData.get('default_cost') || 0),
    default_price: Number(formData.get('default_price') || 0),
  }
  const { error } = await supabase.from('extras_catalog').insert([rawData])
  if (error) throw new Error(error.message)
  revalidatePath('/inventory')
}

export async function updateExtra(id: string, formData: FormData) {
  const supabase = createClient()
  const rawData = {
    name: formData.get("name") as string,
    default_cost: Number(formData.get("default_cost") || 0),
    default_price: Number(formData.get("default_price") || 0),
  }
  const { error } = await supabase.from("extras_catalog").update(rawData).eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath("/inventory")
}

export async function deleteExtra(id: string) {
  const supabase = createClient()
  const { error } = await supabase.from('extras_catalog').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/inventory')
}
