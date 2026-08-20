'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { calculateFinalSellingPrice, calculateTotalProductionCost } from "@/lib/calculations"

export async function createOrder(formData: FormData) {
  const supabase = createClient()
  
  const rawData = {
    client_name: formData.get('client_name') as string,
    client_contact: formData.get('client_contact') as string,
    product_id: formData.get('product_id') as string,
    custom_notes: formData.get('custom_notes') as string,
    commission_date: formData.get('commission_date') as string,
    expected_delivery_date: formData.get('expected_delivery_date') as string || null,
    status: formData.get('status') as string || 'da_stampare',
  }

  const extrasString = formData.get('extras') as string
  const selectedExtras = extrasString ? JSON.parse(extrasString) : []

  const { data: product } = await supabase.from('products').select('*').eq('id', rawData.product_id).single()
  
  const electricalCost = 0.50 
  const materialCost = product ? (product.base_weight_g / 1000) * 20 : 0 
  
  const extrasCost = selectedExtras.reduce((acc: number, curr: any) => acc + (curr.unit_cost * curr.quantity), 0)
  const extrasSurcharge = selectedExtras.reduce((acc: number, curr: any) => acc + (curr.unit_price * curr.quantity), 0)
  
  const calculated_production_cost = calculateTotalProductionCost(electricalCost, materialCost, extrasCost)
  const final_selling_price = calculateFinalSellingPrice(product?.base_selling_price || 0, extrasSurcharge)
  
  const { data: order, error: orderError } = await supabase.from('orders').insert([{
    ...rawData,
    final_selling_price,
    calculated_production_cost,
  }]).select().single()
  
  if (orderError) throw new Error('Failed to create order: ' + orderError.message)
  
  if (selectedExtras.length > 0 && order) {
    const extrasToInsert = selectedExtras.map((ex: any) => ({
      order_id: order.id,
      name: ex.name,
      unit_cost: ex.unit_cost,
      unit_price: ex.unit_price,
      quantity: ex.quantity,
    }))
    const { error: extrasError } = await supabase.from('order_extras').insert(extrasToInsert)
    if (extrasError) console.error("Error inserting extras:", extrasError)
  }
  
  revalidatePath('/orders')
  revalidatePath('/') 
}
