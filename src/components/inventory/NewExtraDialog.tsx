'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus } from 'lucide-react'
import { createExtra } from '@/app/actions/inventory'

export function NewExtraDialog() {
  const [open, setOpen] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await createExtra(new FormData(e.currentTarget))
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm"><Plus className="mr-2 h-4 w-4" /> Nuovo Extra / Lavorazione</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Aggiungi al Catalogo Extra</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Nome Accessorio/Lavorazione</Label>
            <Input name="name" required placeholder="es. Tag NFC NTAG215" />
          </div>
          <div className="space-y-2">
            <Label>Costo per te (Costo di produzione) (€)</Label>
            <Input name="default_cost" type="number" step="0.01" required />
            <p className="text-xs text-muted-foreground">Verrà aggiunto ai costi di produzione per calcolare l'utile netto, senza aumentare il prezzo al cliente.</p>
          </div>
          {/* We pass 0 automatically for price since user doesn't want it */}
          <input type="hidden" name="default_price" value="0" />
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Annulla</Button>
            <Button type="submit">Salva</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
