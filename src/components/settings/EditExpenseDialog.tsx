'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Edit2 } from 'lucide-react'
import { updateExpense } from '@/app/actions/settings'

export function EditExpenseDialog({ expense }: { expense: any }) {
  const [open, setOpen] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await updateExpense(expense.id, new FormData(e.currentTarget))
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline" className="h-7 w-7"><Edit2 className="h-3 w-3" /></Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifica Spesa</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Titolo / Descrizione</Label>
            <Input name="title" required defaultValue={expense.title} />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Importo (€)</Label>
              <Input name="amount" type="number" step="0.01" required defaultValue={expense.amount} />
            </div>
            <div className="space-y-2">
              <Label>Data Spesa</Label>
              <Input name="expense_date" type="date" required defaultValue={expense.expense_date} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Categoria</Label>
            <Select name="category" required defaultValue={expense.category}>
              <SelectTrigger>
                <SelectValue placeholder="Seleziona..." />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="affitto">Affitto / Utenze (non luce)</SelectItem>
                <SelectItem value="software">Software / Abbonamenti</SelectItem>
                <SelectItem value="marketing">Marketing / Pubblicità</SelectItem>
                <SelectItem value="manutenzione">Manutenzione Macchine</SelectItem>
                <SelectItem value="altro">Altro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Note Aggiuntive (opzionale)</Label>
            <Input name="notes" defaultValue={expense.notes} />
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
