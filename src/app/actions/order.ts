'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const orderSchema = z.object({
  client_name: z.string().min(1),
  client_contact: z.string().optional(),
  product_id: z.string().uuid(),
  custom_notes: z.string().optional(),
  expected_delivery_date: z.string().optional(),
  status: z.enum(['da_stampare', 'in_stampa', 'post_produzione', 'pronto', 'consegnato']).default('da_stampare'),
  // Add extras payload handling here if needed
})

export async function createOrder(formData: FormData) {
  const supabase = createClient()
  
  const rawData = {
    client_name: formData.get('client_name') as string,
    client_contact: formData.get('client_contact') as string,
    product_id: formData.get('product_id') as string,
    custom_notes: formData.get('custom_notes') as string,
    expected_delivery_date: formData.get('expected_delivery_date') as string,
    status: formData.get('status') as string || 'da_stampare',
  }
  
  const validatedData = orderSchema.parse(rawData)
  
  // Here we would also calculate production cost based on product and extras
  // Assuming 0 for now as placeholder, you would fetch product base cost and add
  
  const { error } = await supabase.from('orders').insert([{
    ...validatedData,
    final_selling_price: 0, // Calculate using calculations engine
    calculated_production_cost: 0,
  }])
  
  if (error) {
    throw new Error('Failed to create order: ' + error.message)
  }
  
  revalidatePath('/orders')
}
