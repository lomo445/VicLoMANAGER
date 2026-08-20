'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus } from 'lucide-react'
import { createProduct } from '@/app/actions/inventory'

export function NewProductDialog() {
  const [open, setOpen] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await createProduct(new FormData(e.currentTarget))
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm"><Plus className="mr-2 h-4 w-4" /> Nuovo Prodotto Base</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nuovo Prodotto</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Nome Prodotto</Label>
            <Input name="name" required placeholder="es. Vaso Geometrico" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Peso Base (g)</Label>
              <Input name="base_weight_g" type="number" required />
            </div>
            <div className="space-y-2">
              <Label>Tempo Stampa Base (min)</Label>
              <Input name="base_print_time_minutes" type="number" required />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Prezzo di Vendita Base (€)</Label>
            <Input name="base_selling_price" type="number" step="0.01" required />
          </div>
          <input type="hidden" name="type" value="standard" />
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Annulla</Button>
            <Button type="submit">Salva</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
