import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"
import { Package, TrendingUp, AlertCircle, Euro, CheckCircle2, Clock } from "lucide-react"

export default async function DashboardPage() {
  const supabase = createClient()
  
  const { data: orders } = await supabase.from('orders').select('*')
  const { data: expenses } = await supabase.from('expenses').select('amount')
  
  const activeOrders = orders?.filter(o => o.status !== 'consegnato') || []
  
  const totalRevenue = orders?.reduce((acc, order) => acc + Number(order.final_selling_price || 0), 0) || 0
  const totalExpenses = expenses?.reduce((acc, exp) => acc + Number(exp.amount || 0), 0) || 0
  const totalProductionCost = orders?.reduce((acc, order) => acc + Number(order.calculated_production_cost || 0), 0) || 0
  
  const netProfit = totalRevenue - totalExpenses - totalProductionCost

  // Ritardi
  const today = new Date()
  today.setHours(0,0,0,0)
  
  const delayedOrders = activeOrders.filter(o => {
    if (!o.expected_delivery_date) return false
    const delivery = new Date(o.expected_delivery_date)
    return delivery < today
  })

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
      
      {/* Widget Ritardi / Festa */}
      {delayedOrders.length > 0 ? (
        <div className="bg-destructive/15 border-l-4 border-destructive p-4 rounded-md shadow-sm flex items-start gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <Clock className="w-6 h-6 text-destructive mt-0.5" />
          <div>
            <h3 className="text-lg font-bold text-destructive">Attenzione: Ordini in ritardo!</h3>
            <p className="text-sm text-destructive/80 mt-1">
              Hai <strong>{delayedOrders.length}</strong> {delayedOrders.length === 1 ? 'ordine' : 'ordini'} con data di consegna prevista già passata. Controlla la lista ordini per rimetterti in pari!
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-green-500/15 border-l-4 border-green-500 p-4 rounded-md shadow-sm flex items-start gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="relative">
            <CheckCircle2 className="w-6 h-6 text-green-500 relative z-10" />
            <div className="absolute inset-0 bg-green-400 rounded-full blur-md opacity-50 animate-pulse"></div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-green-500 flex items-center gap-2">
              Tutto sotto controllo! 🚀
            </h3>
            <p className="text-sm text-green-600/80 mt-1 font-medium">
              Nessun ordine in ritardo. Le stampanti ronzano felici e i clienti non aspettano. Ottimo lavoro boss!
            </p>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ordini Attivi</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">{activeOrders.length}</div>
            <p className="text-xs text-muted-foreground">in lavorazione o pronti</p>
          </CardContent>
        </Card>
        
        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fatturato Totale</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">€{totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">da tutti gli ordini</p>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Spese Totali (Operative)</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">€{totalExpenses.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">materiale escluso (incluso nei costi prod.)</p>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utile Netto Reale</CardTitle>
            <Euro className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">€{netProfit.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Fatturato - Spese - Costi Prod.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
