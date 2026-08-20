import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"
import { Package, TrendingUp, AlertCircle, Euro } from "lucide-react"

export default async function DashboardPage() {
  const supabase = createClient()
  
  // Example fetching (we will need real data later, for now just base queries)
  const { data: orders } = await supabase.from('orders').select('*')
  const { data: expenses } = await supabase.from('expenses').select('amount')
  
  const activeOrders = orders?.filter(o => o.status !== 'consegnato') || []
  
  const totalRevenue = orders?.reduce((acc, order) => acc + Number(order.final_selling_price || 0), 0) || 0
  const totalExpenses = expenses?.reduce((acc, exp) => acc + Number(exp.amount || 0), 0) || 0
  const totalProductionCost = orders?.reduce((acc, order) => acc + Number(order.calculated_production_cost || 0), 0) || 0
  
  const netProfit = totalRevenue - totalExpenses - totalProductionCost

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ordini Attivi</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeOrders.length}</div>
            <p className="text-xs text-muted-foreground">in lavorazione o pronti</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fatturato Totale</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">da tutti gli ordini</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Spese Totali (Operative)</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{totalExpenses.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">materiale escluso (incluso nei costi prod.)</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utile Netto Reale</CardTitle>
            <Euro className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{netProfit.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Fatturato - Spese - Costi Prod.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
