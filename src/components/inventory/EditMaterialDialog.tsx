'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Edit2 } from 'lucide-react'
import { updateMaterial } from '@/app/actions/inventory'

export function EditMaterialDialog({ material }: { material: any }) {
  const [open, setOpen] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await updateMaterial(material.id, new FormData(e.currentTarget))
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline" className="h-7 w-7"><Edit2 className="h-3 w-3" /></Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifica Materiale</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Marca (es. Bambu Lab, Sunlu)</Label>
            <Input name="brand" required defaultValue={material.brand} />
          </div>
          <div className="space-y-2">
            <Label>Tipo Materiale (es. PLA Basic, PETG, ABS)</Label>
            <Input name="material_type" required defaultValue={material.material_type} />
          </div>
          <div className="space-y-2">
            <Label>Costo per Kg (€)</Label>
            <Input name="cost_per_kg" type="number" step="0.01" required defaultValue={material.cost_per_kg} />
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
