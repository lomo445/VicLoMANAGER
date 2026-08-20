'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus } from 'lucide-react'
import { createMaterial } from '@/app/actions/inventory'

export function NewMaterialDialog() {
  const [open, setOpen] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await createMaterial(new FormData(e.currentTarget))
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm"><Plus className="mr-2 h-4 w-4" /> Aggiungi Bobina</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nuova Bobina / Materiale</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Marca</Label>
              <Input name="brand" required placeholder="es. Sunlu" />
            </div>
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Input name="material_type" required placeholder="es. PLA+" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Colore</Label>
              <Input name="color_name" required placeholder="es. Rosso" />
            </div>
            <div className="space-y-2">
              <Label>Codice HEX</Label>
              <Input name="hex_code" type="color" className="h-10 px-1" defaultValue="#ff0000" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Costo per Kg (€)</Label>
              <Input name="cost_per_kg" type="number" step="0.01" required />
            </div>
            <div className="space-y-2">
              <Label>Peso bobina iniziale (g)</Label>
              <Input name="spool_weight_g" type="number" defaultValue="1000" required />
            </div>
          </div>
          <input type="hidden" name="current_stock_g" value="1000" />
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Annulla</Button>
            <Button type="submit">Salva</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
