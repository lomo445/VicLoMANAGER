'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { calculateFinalSellingPrice, calculateTotalProductionCost } from "@/lib/calculations"

export async function createOrder(formData: FormData) {
  const supabase = createClient()
  
  const rawData = {
    client_name: formData.get('client_name') as string,
    client_contact: formData.get('client_contact') as string,
    custom_notes: formData.get('custom_notes') as string || '',
    commission_date: formData.get('commission_date') as string,
    expected_delivery_date: formData.get('expected_delivery_date') as string || null,
    status: formData.get('status') as string || 'da_stampare',
  }

  const orderItemsString = formData.get('order_items') as string
  const orderItems = orderItemsString ? JSON.parse(orderItemsString) : []
  
  if (orderItems.length === 0) throw new Error("Order must have at least one product")

  const extrasString = formData.get('extras') as string
  const selectedExtras = extrasString ? JSON.parse(extrasString) : []

  // Calculate totals
  let totalProdCost = 0
  let totalSellPrice = 0

  const { data: allProducts } = await supabase.from('products').select('*')
  
  const finalItemsToInsert = []

  for (const item of orderItems) {
    const product = allProducts?.find(p => p.id === item.product_id)
    if (product) {
      const materialCost = (product.base_weight_g / 1000) * 20 
      const electricalCost = 0.50 
      const costPerUnit = calculateTotalProductionCost(electricalCost, materialCost, 0)
      
      totalProdCost += costPerUnit * item.quantity
      totalSellPrice += product.base_selling_price * item.quantity
      
      finalItemsToInsert.push({
        product_id: product.id,
        quantity: item.quantity,
        unit_price: product.base_selling_price,
        unit_cost: costPerUnit
      })
    }
  }
  
  const extrasCost = selectedExtras.reduce((acc: number, curr: any) => acc + (curr.unit_cost * curr.quantity), 0)
  totalProdCost += extrasCost
  
  // Insert main order
  const { data: order, error: orderError } = await supabase.from('orders').insert([{
    ...rawData,
    final_selling_price: totalSellPrice,
    calculated_production_cost: totalProdCost,
  }]).select().single()
  
  if (orderError) throw new Error('Failed to create order: ' + orderError.message)
  
  // Insert order items
  const itemsWithOrderId = finalItemsToInsert.map(item => ({ ...item, order_id: order.id }))
  const { error: itemsError } = await supabase.from('order_items').insert(itemsWithOrderId)
  if (itemsError) console.error("Error inserting order items:", itemsError)

  // Insert extras
  if (selectedExtras.length > 0 && order) {
    const extrasToInsert = selectedExtras.map((ex: any) => ({
      order_id: order.id,
      name: ex.name,
      unit_cost: ex.unit_cost,
      unit_price: 0, // Forced to 0
      quantity: ex.quantity,
    }))
    const { error: extrasError } = await supabase.from('order_extras').insert(extrasToInsert)
    if (extrasError) console.error("Error inserting extras:", extrasError)
  }
  
  revalidatePath('/orders')
  revalidatePath('/') 
}

export async function deleteOrder(id: string) {
  const supabase = createClient()
  const { error } = await supabase.from('orders').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/orders')
  revalidatePath('/')
}
