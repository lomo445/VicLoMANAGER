'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Edit2 } from 'lucide-react'
import { updatePrinter } from '@/app/actions/settings'

export function EditPrinterDialog({ printer, locations = [] }: { printer: any, locations?: any[] }) {
  const [open, setOpen] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await updatePrinter(printer.id, new FormData(e.currentTarget))
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline" className="h-7 w-7"><Edit2 className="h-3 w-3" /></Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifica Stampante</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Modello Stampante</Label>
            <Input name="model_name" required defaultValue={printer.model_name} />
          </div>
          <div className="space-y-2">
            <Label>Sede</Label>
            <Select name="location_id" required defaultValue={printer.location_id}>
              <SelectTrigger>
                <SelectValue placeholder="Seleziona..." />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                {locations.map(loc => (
                  <SelectItem key={loc.id} value={loc.id}>{loc.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Consumo in Stampa (W)</Label>
            <Input name="power_consumption_w" type="number" required defaultValue={printer.power_consumption_w} />
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
