import Link from "next/link"
import { Home, Package, ShoppingCart, Settings, Users, Calculator } from "lucide-react"

export function Sidebar() {
  return (
    <div className="w-64 bg-white border-r flex flex-col">
      <div className="p-6">
        <div className="flex items-center gap-2 font-bold text-xl text-primary">
          <Calculator className="h-6 w-6" />
          <span>VicloLab</span>
        </div>
      </div>
      <nav className="flex-1 px-4 space-y-2">
        <Link href="/" className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100 transition-colors">
          <Home className="h-5 w-5" />
          Dashboard
        </Link>
        <Link href="/orders" className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100 transition-colors">
          <ShoppingCart className="h-5 w-5" />
          Ordini
        </Link>
        <Link href="/inventory" className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100 transition-colors">
          <Package className="h-5 w-5" />
          Inventario
        </Link>
        <Link href="/settings" className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100 transition-colors">
          <Settings className="h-5 w-5" />
          Impostazioni
        </Link>
      </nav>
      <div className="p-4 border-t text-sm text-gray-500">
        &copy; 2024 VicloLab Manager
      </div>
    </div>
  )
}
