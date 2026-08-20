'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus } from 'lucide-react'
import { createPrinter } from '@/app/actions/settings'

export function NewPrinterDialog({ locations }: { locations: any[] }) {
  const [open, setOpen] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await createPrinter(new FormData(e.currentTarget))
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="secondary"><Plus className="mr-2 h-4 w-4" /> Aggiungi Stampante 3D</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nuova Macchina</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Modello Macchina</Label>
            <Input name="model_name" required placeholder="es. Bambu Lab A1 Mini" />
          </div>
          <div className="space-y-2">
            <Label>Postazione (Sede)</Label>
            <Select name="location_id" required>
              <SelectTrigger>
                <SelectValue placeholder="Seleziona sede" />
              </SelectTrigger>
              <SelectContent>
                {locations.map(loc => (
                  <SelectItem key={loc.id} value={loc.id}>{loc.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Consumo Energetico (Watt)</Label>
            <Input name="power_consumption_w" type="number" required placeholder="es. 150" />
            <p className="text-xs text-muted-foreground">Stima media del consumo durante la stampa.</p>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Annulla</Button>
            <Button type="submit">Salva</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
