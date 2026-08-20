'use client'

import Link from "next/link"
import Image from "next/image"
import { Home, Package, ShoppingCart, Settings, LogOut } from "lucide-react"
import { logout } from "@/app/actions/auth"

export function Sidebar() {
  return (
    <div className="w-72 bg-white border-r flex flex-col shadow-sm z-10">
      <div className="p-6 border-b flex flex-col items-center justify-center space-y-4">
        <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-gray-50 shadow-md">
          <Image 
            src="/logo.jpg" 
            alt="VicloLab Logo" 
            fill 
            className="object-cover"
            priority
          />
        </div>
        <div className="text-center">
          <h2 className="font-extrabold text-2xl tracking-tight text-gray-900">VicloLab</h2>
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mt-1">Management System</p>
        </div>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        <Link href="/" className="flex items-center gap-3 px-3 py-3 text-gray-700 font-medium rounded-xl hover:bg-blue-50 hover:text-blue-700 transition-colors">
          <Home className="h-5 w-5" />
          Dashboard
        </Link>
        <Link href="/orders" className="flex items-center gap-3 px-3 py-3 text-gray-700 font-medium rounded-xl hover:bg-blue-50 hover:text-blue-700 transition-colors">
          <ShoppingCart className="h-5 w-5" />
          Ordini
        </Link>
        <Link href="/inventory" className="flex items-center gap-3 px-3 py-3 text-gray-700 font-medium rounded-xl hover:bg-blue-50 hover:text-blue-700 transition-colors">
          <Package className="h-5 w-5" />
          Inventario
        </Link>
        <Link href="/settings" className="flex items-center gap-3 px-3 py-3 text-gray-700 font-medium rounded-xl hover:bg-blue-50 hover:text-blue-700 transition-colors">
          <Settings className="h-5 w-5" />
          Impostazioni Macchine
        </Link>
      </nav>
      <div className="p-4 border-t flex flex-col gap-2">
        <button onClick={() => logout()} className="flex items-center justify-center gap-2 w-full px-3 py-2 text-sm text-red-600 font-medium rounded-md hover:bg-red-50 transition-colors">
          <LogOut className="h-4 w-4" />
          Esci
        </button>
        <div className="text-xs text-center font-medium text-gray-400">
          &copy; {new Date().getFullYear()} VicloLab Manager
        </div>
      </div>
    </div>
  )
}
