'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'

export function DeleteButton({ id, actionFn }: { id: string, actionFn: (id: string) => Promise<void> }) {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (confirm("Sei sicuro di voler eliminare questo elemento?")) {
      setLoading(true)
      try {
        await actionFn(id)
      } catch (e) {
        console.error(e)
        alert("Errore durante l'eliminazione.")
      }
      setLoading(false)
    }
  }

  return (
    <Button variant="ghost" size="icon" onClick={handleDelete} disabled={loading}>
      <Trash2 className="h-4 w-4 text-destructive" />
    </Button>
  )
}
