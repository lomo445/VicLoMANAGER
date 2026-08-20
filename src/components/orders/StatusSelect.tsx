'use client'

import { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { updateOrderStatus } from '@/app/actions/order'

export function StatusSelect({ id, currentStatus }: { id: string, currentStatus: string }) {
  const [loading, setLoading] = useState(false)

  const handleStatusChange = async (newStatus: string) => {
    setLoading(true)
    try {
      await updateOrderStatus(id, newStatus)
    } catch (e) {
      console.error(e)
      alert("Errore durante l'aggiornamento dello stato")
    }
    setLoading(false)
  }

  // Define colors based on status
  let colorClass = 'bg-muted text-muted-foreground' // da_stampare
  if (currentStatus === 'consegnato') colorClass = 'bg-green-500/20 text-green-500'
  else if (currentStatus === 'pronto') colorClass = 'bg-blue-500/20 text-blue-500'
  else if (currentStatus === 'in_lavorazione') colorClass = 'bg-yellow-500/20 text-yellow-500'

  return (
    <Select defaultValue={currentStatus} onValueChange={handleStatusChange} disabled={loading}>
      <SelectTrigger className={`h-7 text-xs font-semibold rounded-full border-0 focus:ring-0 w-max px-3 ${colorClass}`}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="bg-popover z-50">
        <SelectItem value="da_stampare">Da stampare</SelectItem>
        <SelectItem value="in_lavorazione">In lavorazione</SelectItem>
        <SelectItem value="pronto">Pronto (Stampato)</SelectItem>
        <SelectItem value="consegnato">Consegnato (Riscosso)</SelectItem>
      </SelectContent>
    </Select>
  )
}
