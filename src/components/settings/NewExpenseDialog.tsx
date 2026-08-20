'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus } from 'lucide-react'
import { createExpense } from '@/app/actions/settings'

export function NewExpenseDialog() {
  const [open, setOpen] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await createExpense(new FormData(e.currentTarget))
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm"><Plus className="mr-2 h-4 w-4" /> Registra Spesa</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nuova Spesa Operativa</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Descrizione</Label>
            <Input name="title" required placeholder="es. Acquisto colla spray" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select name="category" required>
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="filamento">Filamento</SelectItem>
                  <SelectItem value="ricambi_hardware">Ricambi Hardware</SelectItem>
                  <SelectItem value="accessori_extra">Accessori/Extra</SelectItem>
                  <SelectItem value="packaging">Packaging</SelectItem>
                  <SelectItem value="utenze">Utenze</SelectItem>
                  <SelectItem value="altro">Altro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Importo (€)</Label>
              <Input name="amount" type="number" step="0.01" required />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Data</Label>
            <Input name="expense_date" type="date" required defaultValue={new Date().toISOString().split('T')[0]} />
          </div>
          <div className="space-y-2">
            <Label>Note Aggiuntive</Label>
            <Input name="notes" placeholder="Opzionale" />
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
