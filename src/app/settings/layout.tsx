import Link from "next/link"

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Impostazioni</h1>
      </div>
      
      <div className="flex gap-6">
        <div className="w-48 shrink-0">
          <nav className="flex flex-col space-y-1">
            <Link href="/settings" className="px-3 py-2 text-sm font-medium rounded-md bg-gray-100">
              Macchine e Sedi
            </Link>
            <Link href="/settings/expenses" className="px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-100">
              Registro Spese
            </Link>
          </nav>
        </div>
        <div className="flex-1 bg-white p-6 rounded-md border shadow-sm">
          {children}
        </div>
      </div>
    </div>
  )
}
