'use client'

import { useState } from 'react'
import { login } from '@/app/actions/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import Image from 'next/image'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const formData = new FormData(e.currentTarget)
    const result = await login(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="space-y-4 items-center">
        <div className="relative w-20 h-20 rounded-full overflow-hidden border border-gray-100 shadow-sm">
          <Image src="/logo.jpg" alt="VicloLab Logo" fill className="object-cover" />
        </div>
        <div className="text-center">
          <CardTitle className="text-2xl font-bold">VicloLab Manager</CardTitle>
          <CardDescription>Accedi al tuo laboratorio</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" autoComplete="username" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            {/* autoComplete="current-password" is what tells Mac Keychain to save/use passkey! */}
            <Input id="password" name="password" type="password" autoComplete="current-password" required />
          </div>
          
          {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md">{error}</div>}
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Accesso in corso...' : 'Accedi'}
          </Button>
          
          <div className="text-center text-sm text-gray-500 mt-4">
            Non hai un account? <Link href="/auth/register" className="text-blue-600 hover:underline">Registrati</Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
