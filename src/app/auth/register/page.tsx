'use client'

import { useState } from 'react'
import { register } from '@/app/actions/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import Image from 'next/image'

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)
    const formData = new FormData(e.currentTarget)
    const result = await register(formData)
    
    if (result?.error) {
      setError(result.error)
    } else if (result?.success) {
      setSuccess(result.success)
    }
    setLoading(false)
  }

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="space-y-4 items-center">
        <div className="relative w-20 h-20 rounded-full overflow-hidden border border-gray-100 shadow-sm">
          <Image src="/logo.jpg" alt="VicloLab Logo" fill className="object-cover" />
        </div>
        <div className="text-center">
          <CardTitle className="text-2xl font-bold">Crea Account VicloLab</CardTitle>
          <CardDescription>Registrati come amministratore del laboratorio</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {success ? (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 text-green-700 rounded-md border border-green-200">
              {success}
            </div>
            <Link href="/auth/login" className="block w-full text-center py-2 px-4 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700">
              Vai al Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" autoComplete="username" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              {/* autoComplete="new-password" allows saving to Mac Keychain automatically */}
              <Input id="password" name="password" type="password" autoComplete="new-password" required minLength={6} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="secret_key">Chiave Segreta di Sistema</Label>
              <Input id="secret_key" name="secret_key" type="password" required placeholder="Inserisci la chiave fornita..." />
              <p className="text-xs text-muted-foreground">Necessaria per evitare registrazioni indesiderate sul server.</p>
            </div>
            
            {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md">{error}</div>}
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Registrazione...' : 'Registrati'}
            </Button>
            
            <div className="text-center text-sm text-gray-500 mt-4">
              Hai già un account? <Link href="/auth/login" className="text-blue-600 hover:underline">Accedi</Link>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
