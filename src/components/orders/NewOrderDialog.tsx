'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Plus, Trash2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createOrder } from '@/app/actions/order'
import { calculateFinalSellingPrice, calculateTotalProductionCost } from '@/lib/calculations'

export function NewOrderDialog({ products, extrasCatalog }: { products: any[], extrasCatalog: any[] }) {
  const [open, setOpen] = useState(false)
  
  // Form State
  const [clientName, setClientName] = useState('')
  const [productId, setProductId] = useState('')
  const [selectedExtras, setSelectedExtras] = useState<{id: string, name: string, unit_cost: number, unit_price: number, quantity: number}[]>([])

  // Derived State (Real-time calculation)
  const selectedProduct = products.find(p => p.id === productId)
  
  // Real calculation logic would also need electricity and material costs, using placeholders for now
  const electricalCost = 0.50 // Mock
  const materialCost = selectedProduct ? (selectedProduct.base_weight_g / 1000) * 20 : 0 // Assuming 20 eur/kg
  
  const extrasCost = selectedExtras.reduce((acc, curr) => acc + (curr.unit_cost * curr.quantity), 0)
  const extrasSurcharge = 0 // Extra prices do not increase selling price as per user request
  
  const totalProductionCost = calculateTotalProductionCost(electricalCost, materialCost, extrasCost)
  const finalSellingPrice = calculateFinalSellingPrice(selectedProduct?.base_selling_price || 0, extrasSurcharge)
  const margin = finalSellingPrice - totalProductionCost

  const addExtra = (catalogId: string) => {
    const extra = extrasCatalog.find(e => e.id === catalogId)
    if (extra) {
      setSelectedExtras([...selectedExtras, { 
        id: crypto.randomUUID(), 
        name: extra.name, 
        unit_cost: extra.default_cost, 
        unit_price: extra.default_price, 
        quantity: 1 
      }])
    }
  }

  const removeExtra = (id: string) => {
    setSelectedExtras(selectedExtras.filter(e => e.id !== id))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    formData.append('extras', JSON.stringify(selectedExtras))
    
    await createOrder(formData)
    setOpen(false)
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

          <div className="space-y-2">
            <Label>Prodotto *</Label>
            <Select name="product_id" required value={productId} onValueChange={setProductId}>
              <SelectTrigger>
                <SelectValue placeholder="Seleziona un prodotto" />
              </SelectTrigger>
              <SelectContent>
                {products.map(p => (
                  <SelectItem key={p.id} value={p.id}>{p.name} - €{p.base_selling_price}</SelectItem>
                ))}
              </SelectContent>
            </Select>
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

          <div className="border border-border p-4 rounded-md space-y-4 bg-muted/50">
            <div className="flex justify-between items-center">
              <Label>Extra / Lavorazioni (Opzionale)</Label>
              <Select onValueChange={addExtra}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Aggiungi da catalogo..." />
                </SelectTrigger>
                <SelectContent>
                  {extrasCatalog.map(e => (
                    <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {selectedExtras.map((extra, index) => (
              <div key={extra.id} className="flex items-center gap-2 bg-background p-2 border border-border rounded">
                <Input value={extra.name} readOnly className="flex-1" />
                <Input type="number" value={extra.quantity} onChange={e => {
                  const newExtras = [...selectedExtras]
                  newExtras[index].quantity = parseInt(e.target.value) || 1
                  setSelectedExtras(newExtras)
                }} className="w-20" min="1" />
                <Button type="button" variant="ghost" size="icon" onClick={() => removeExtra(extra.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
          
          <div className="bg-primary/10 p-4 rounded-md space-y-2 text-sm border border-primary/20">
            <h4 className="font-semibold text-primary mb-2">Preventivo Live</h4>
            <div className="flex justify-between text-muted-foreground">
              <span>Costo Produzione (Stima):</span>
              <span>€{totalProductionCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg text-foreground">
              <span>Prezzo di Vendita Finale:</span>
              <span>€{finalSellingPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-green-500 font-medium">
              <span>Margine Netto Previsto:</span>
              <span>€{margin.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Annulla</Button>
            <Button type="submit">Salva Ordine</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
