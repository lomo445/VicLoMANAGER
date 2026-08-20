'use client'

import { useState, useMemo } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Plus, Trash2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createOrder } from '@/app/actions/order'
import { calculateFinalSellingPrice, calculateTotalProductionCost } from '@/lib/calculations'

export function NewOrderDialog({ products, extrasCatalog, avgKw, avgKwhCost }: { products: any[], extrasCatalog: any[], avgKw: number, avgKwhCost: number }) {
  const [open, setOpen] = useState(false)
  
  const [clientName, setClientName] = useState('')
  
  // Order Items
  const [orderItems, setOrderItems] = useState<{id: string, product_id: string, quantity: number}[]>([])
  
  // Order Extras
  const [selectedExtras, setSelectedExtras] = useState<{id: string, name: string, unit_cost: number, unit_price: number, quantity: number}[]>([])

  const addProduct = (productId: string) => {
    setOrderItems([...orderItems, { id: crypto.randomUUID(), product_id: productId, quantity: 1 }])
  }

  const removeProduct = (id: string) => {
    setOrderItems(orderItems.filter(item => item.id !== id))
  }

  const updateProductQuantity = (id: string, qty: number) => {
    setOrderItems(orderItems.map(item => item.id === id ? { ...item, quantity: qty } : item))
  }

  const totalProductsQuantity = orderItems.reduce((acc, curr) => acc + curr.quantity, 0)

  const addExtra = (catalogId: string) => {
    const extra = extrasCatalog.find(e => e.id === catalogId)
    if (extra) {
      setSelectedExtras([...selectedExtras, { 
        id: crypto.randomUUID(), 
        name: extra.name, 
        unit_cost: extra.default_cost, 
        unit_price: extra.default_price, 
        // Default quantity to the total number of products in the order
        quantity: totalProductsQuantity > 0 ? totalProductsQuantity : 1 
      }])
    }
  }

  const removeExtra = (id: string) => {
    setSelectedExtras(selectedExtras.filter(e => e.id !== id))
  }

  // Calculate Totals
  const { totalProductionCost, finalSellingPrice, margin } = useMemo(() => {
    let totalProdCost = 0
    let totalSellPrice = 0

    // Products cost and price
    orderItems.forEach(item => {
      const p = products.find(prod => prod.id === item.product_id)
      if (p) {
        const materialCost = p.materials ? (p.base_weight_g / 1000) * p.materials.cost_per_kg : (p.base_weight_g / 1000) * 20
        const hours = (p.base_print_time_minutes / 60); const electricalCost = avgKw * hours * avgKwhCost
        const costPerUnit = calculateTotalProductionCost(electricalCost, materialCost, 0)
        totalProdCost += costPerUnit * item.quantity
        totalSellPrice += p.base_selling_price * item.quantity
      }
    })

    // Extras cost
    const extrasCost = selectedExtras.reduce((acc, curr) => acc + (curr.unit_cost * curr.quantity), 0)
    totalProdCost += extrasCost

    return {
      totalProductionCost: totalProdCost,
      finalSellingPrice: totalSellPrice,
      margin: totalSellPrice - totalProdCost
    }
  }, [orderItems, selectedExtras, products, avgKw, avgKwhCost])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (orderItems.length === 0) {
      alert("Aggiungi almeno un prodotto all'ordine!")
      return
    }

    const formData = new FormData(e.currentTarget)
    formData.append('order_items', JSON.stringify(orderItems))
    formData.append('extras', JSON.stringify(selectedExtras))
    
    await createOrder(formData)
    setOpen(false)
    setOrderItems([])
    setSelectedExtras([])
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button><Plus className="mr-2 h-4 w-4" /> Nuovo Ordine</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Aggiungi Nuovo Ordine</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="client_name">Nome Cliente *</Label>
              <Input id="client_name" name="client_name" required value={clientName} onChange={e => setClientName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="client_contact">Contatto (es. Telefono/Email)</Label>
              <Input id="client_contact" name="client_contact" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="commission_date">Data di Inserimento</Label>
              <Input id="commission_date" name="commission_date" type="date" defaultValue={new Date().toISOString().split('T')[0]} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expected_delivery_date">Data di Consegna Prevista</Label>
              <Input id="expected_delivery_date" name="expected_delivery_date" type="date" />
            </div>
          </div>

          {/* Products List */}
          <div className="border border-border p-4 rounded-md space-y-4 bg-muted/30">
            <div className="flex justify-between items-center mb-2">
              <Label className="text-base font-semibold">Prodotti Ordinati *</Label>
              <Select onValueChange={addProduct}>
                <SelectTrigger className="w-[250px]">
                  <SelectValue placeholder="Aggiungi un prodotto..." />
                </SelectTrigger>
                <SelectContent className="z-50 bg-popover text-popover-foreground">
                  {products.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.name} - €{p.base_selling_price}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {orderItems.length === 0 && (
              <div className="text-sm text-muted-foreground text-center py-4 border-2 border-dashed border-border rounded-md">
                Nessun prodotto aggiunto. Seleziona un prodotto dal menu.
              </div>
            )}

            {orderItems.map((item, index) => {
              const product = products.find(p => p.id === item.product_id)
              return (
                <div key={item.id} className="flex items-center gap-3 bg-card p-3 border border-border rounded-md shadow-sm">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{product?.name}</div>
                    <div className="text-xs text-muted-foreground">Prezzo cad: €{product?.base_selling_price}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-xs">Qtà:</Label>
                    <Input type="number" value={item.quantity} onChange={e => updateProductQuantity(item.id, parseInt(e.target.value) || 1)} className="w-20" min="1" />
                  </div>
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeProduct(item.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              )
            })}
          </div>

          {/* Extras Repeater */}
          <div className="border border-border p-4 rounded-md space-y-4 bg-muted/30">
            <div className="flex justify-between items-center mb-2">
              <div>
                <Label className="text-base font-semibold">Extra / Lavorazioni</Label>
                <p className="text-xs text-muted-foreground font-normal">Aggiungi NFC, verniciatura, ecc. (Solo costo)</p>
              </div>
              <Select onValueChange={addExtra}>
                <SelectTrigger className="w-[250px]">
                  <SelectValue placeholder="Aggiungi da catalogo..." />
                </SelectTrigger>
                <SelectContent className="z-50 bg-popover text-popover-foreground">
                  {extrasCatalog.map(e => (
                    <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {selectedExtras.map((extra, index) => (
              <div key={extra.id} className="flex items-center gap-3 bg-card p-3 border border-border rounded-md shadow-sm">
                <div className="flex-1">
                  <div className="font-medium text-sm">{extra.name}</div>
                  <div className="text-xs text-muted-foreground">Costo prod: €{extra.unit_cost}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Label className="text-xs">Qtà:</Label>
                  <Input type="number" value={extra.quantity} onChange={e => {
                    const newExtras = [...selectedExtras]
                    newExtras[index].quantity = parseInt(e.target.value) || 1
                    setSelectedExtras(newExtras)
                  }} className="w-20" min="1" />
                </div>
                <Button type="button" variant="ghost" size="icon" onClick={() => removeExtra(extra.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
          
          {/* Live Calculation Preview */}
          <div className="bg-primary/10 p-4 rounded-md space-y-2 text-sm border border-primary/20">
            <h4 className="font-semibold text-primary mb-2">Preventivo Live Ordine</h4>
            <div className="flex justify-between text-muted-foreground">
              <span>Costi Produzione Totali (Stima + Extra):</span>
              <span>€{totalProductionCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg text-foreground">
              <span>Prezzo di Vendita Finale:</span>
              <span>€{finalSellingPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-green-500 font-medium pt-2 border-t border-primary/20 mt-2">
              <span>Margine Netto Previsto:</span>
              <span>€{margin.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Annulla</Button>
            <Button type="submit">Salva Ordine Completo</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
