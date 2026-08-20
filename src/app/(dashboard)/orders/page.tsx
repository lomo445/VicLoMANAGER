import { createClient } from "@/lib/supabase/server"
import { NewOrderDialog } from "@/components/orders/NewOrderDialog"
import { AlertTriangle } from "lucide-react"
import { DeleteButton } from "@/components/ui-custom/DeleteButton"
import { deleteOrder } from "@/app/actions/order"
import { StatusSelect } from "@/components/orders/StatusSelect"

export default async function OrdersPage() {
  const supabase = createClient()
  const { data: orders } = await supabase.from('orders').select('*, order_items(*, products(name))').order('created_at', { ascending: false })
  const { data: products } = await supabase.from('products').select('*, materials(*)')
  const { data: extrasCatalog } = await supabase.from('extras_catalog').select('*')
  
  const { data: printers } = await supabase.from('printers').select('*, locations(*)')
  
  // Calcolo medie
  let avgKw = 0.2
  let avgKwhCost = 0.35
  
  if (printers && printers.length > 0) {
    const totalWatts = printers.reduce((acc, p) => acc + (p.power_consumption_w || 0), 0)
    avgKw = (totalWatts / printers.length) / 1000
    
    // Solo le locations connesse a stampanti attive
    const locations = printers.map(p => p.locations).filter(l => l !== null)
    if (locations.length > 0) {
      const totalKwhCost = locations.reduce((acc, l) => acc + (l.electricity_cost_kwh || 0), 0)
      avgKwhCost = totalKwhCost / locations.length
    }
  }

  const today = new Date()
  today.setHours(0,0,0,0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Ordini</h1>
        <NewOrderDialog 
          products={products || []} 
          extrasCatalog={extrasCatalog || []} 
          avgKw={avgKw} 
          avgKwhCost={avgKwhCost} 
        />
      </div>
      
      <div className="bg-card rounded-md border shadow-sm p-4 overflow-x-auto">
        {orders && orders.length > 0 ? (
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="border-b">
                <th className="pb-3 px-2">Cliente</th>
                <th className="pb-3 px-2">Prodotti (Qtà)</th>
                <th className="pb-3 px-2">Data Inserimento</th>
                <th className="pb-3 px-2">Consegna Prevista</th>
                <th className="pb-3 px-2">Status</th>
                <th className="pb-3 px-2 text-right">Prezzo Finale</th>
                <th className="pb-3 px-2 text-right">Azioni</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order: any) => {
                const isDelayed = order.status !== 'consegnato' && order.expected_delivery_date && new Date(order.expected_delivery_date) < today
                
                return (
                  <tr key={order.id} className={`border-b last:border-0 hover:bg-muted/50 transition-colors ${isDelayed ? 'bg-destructive/5' : ''}`}>
                    <td className="py-3 px-2 font-medium">{order.client_name}</td>
                    <td className="py-3 px-2">
                      <div className="flex flex-col gap-1">
                        {order.order_items && order.order_items.length > 0 ? (
                          order.order_items.map((item: any) => (
                            <span key={item.id} className="text-xs bg-muted px-2 py-1 rounded-md border border-border inline-block w-max">
                              {item.quantity}x {item.products?.name || 'Prodotto eliminato'}
                            </span>
                          ))
                        ) : (
                          <span className="text-muted-foreground italic">Prodotto non specificato</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-2 text-muted-foreground">{order.commission_date || new Date(order.created_at).toISOString().split('T')[0]}</td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        {order.expected_delivery_date || '-'}
                        {isDelayed && <span className="flex items-center gap-1 text-[10px] uppercase font-bold bg-destructive text-destructive-foreground px-1.5 py-0.5 rounded-sm"><AlertTriangle className="w-3 h-3"/> Ritardo</span>}
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <StatusSelect id={order.id} currentStatus={order.status} />
                    </td>
                    <td className="py-3 px-2 text-right font-semibold text-green-500">€{order.final_selling_price}</td>
                    <td className="py-3 px-2 text-right">
                      <DeleteButton id={order.id} actionFn={deleteOrder} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-10 text-muted-foreground">Nessun ordine trovato.</div>
        )}
      </div>
    </div>
  )
}
