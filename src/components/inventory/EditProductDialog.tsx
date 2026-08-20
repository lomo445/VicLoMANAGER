'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Edit2 } from 'lucide-react'
import { updateProduct } from '@/app/actions/inventory'

export function EditProductDialog({ product, materials = [] }: { product: any, materials?: any[] }) {
  const [open, setOpen] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await updateProduct(product.id, new FormData(e.currentTarget))
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline" className="h-7 w-7"><Edit2 className="h-3 w-3" /></Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifica Prodotto</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Nome Prodotto</Label>
            <Input name="name" required defaultValue={product.name} />
          </div>
          
          <div className="space-y-2">
            <Label>Materiale Base</Label>
            <Select name="material_id" required defaultValue={product.material_id || undefined}>
              <SelectTrigger>
                <SelectValue placeholder="Seleziona..." />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                {materials.map(m => (
                  <SelectItem key={m.id} value={m.id}>{m.brand} {m.material_type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Peso Base (g)</Label>
              <Input name="base_weight_g" type="number" required defaultValue={product.base_weight_g} />
            </div>
            <div className="space-y-2">
              <Label>Tempo Stampa Base (min)</Label>
              <Input name="base_print_time_minutes" type="number" required defaultValue={product.base_print_time_minutes} />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Prezzo di Vendita Base (€)</Label>
            <Input name="base_selling_price" type="number" step="0.01" required defaultValue={product.base_selling_price} />
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Annulla</Button>
            <Button type="submit">Salva Modifiche</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
