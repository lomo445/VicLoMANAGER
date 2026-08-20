'use client'

import Link from "next/link"
import Image from "next/image"
import { Home, Package, ShoppingCart, Settings, LogOut } from "lucide-react"
import { logout } from "@/app/actions/auth"
import { usePathname } from "next/navigation"

export function Sidebar() {
  const pathname = usePathname()

  const navItems = [
    { href: "/", icon: Home, label: "Dashboard" },
    { href: "/orders", icon: ShoppingCart, label: "Ordini" },
    { href: "/inventory", icon: Package, label: "Inventario" },
    { href: "/settings", icon: Settings, label: "Impostazioni" },
  ]

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-72 bg-card border-r border-border flex-col shadow-sm z-10 h-full shrink-0">
        <div className="p-6 border-b border-border flex flex-col items-center justify-center space-y-4">
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-muted shadow-md">
            <Image 
              src="/logo.jpg" 
              alt="VicloLab Logo" 
              fill 
              className="object-cover"
              priority
            />
          </div>
          <div className="text-center">
            <h2 className="font-extrabold text-2xl tracking-tight text-card-foreground">VicloLab</h2>
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mt-1">Management System</p>
          </div>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
            return (
              <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-3 py-3 font-medium rounded-xl transition-colors ${isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'}`}>
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="p-4 border-t border-border flex flex-col gap-2">
          <button onClick={() => logout()} className="flex items-center justify-center gap-2 w-full px-3 py-2 text-sm text-destructive font-medium rounded-md hover:bg-destructive/10 transition-colors">
            <LogOut className="h-4 w-4" />
            Esci
          </button>
          <div className="text-xs text-center font-medium text-muted-foreground mt-2">
            &copy; {new Date().getFullYear()} VicloLab
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border flex items-center justify-around p-2 z-50 pb-safe">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
          return (
            <Link key={item.href} href={item.href} className={`flex flex-col items-center p-2 rounded-lg ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
              <Icon className="h-6 w-6 mb-1" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          )
        })}
        <button onClick={() => logout()} className="flex flex-col items-center p-2 rounded-lg text-destructive">
          <LogOut className="h-6 w-6 mb-1" />
          <span className="text-[10px] font-medium">Esci</span>
        </button>
      </div>
    </>
  )
}
