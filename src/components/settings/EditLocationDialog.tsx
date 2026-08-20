'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Edit2 } from 'lucide-react'
import { updateLocation } from '@/app/actions/settings'

export function EditLocationDialog({ location }: { location: any }) {
  const [open, setOpen] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await updateLocation(location.id, new FormData(e.currentTarget))
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline" className="h-7 w-7"><Edit2 className="h-3 w-3" /></Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifica Sede</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Nome Sede</Label>
            <Input name="name" required defaultValue={location.name} />
          </div>
          <div className="space-y-2">
            <Label>Costo Energia (€/kWh)</Label>
            <Input name="electricity_cost_kwh" type="number" step="0.001" required defaultValue={location.electricity_cost_kwh} />
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
