import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default async function OrdersPage() {
  const supabase = createClient()
  const { data: orders } = await supabase.from('orders').select('*, products(name)')

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Ordini</h1>
        <Button><Plus className="mr-2 h-4 w-4" /> Nuovo Ordine</Button>
      </div>
      
      <div className="bg-white rounded-md border shadow-sm p-4">
        {orders && orders.length > 0 ? (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b">
                <th className="pb-3">Cliente</th>
                <th className="pb-3">Prodotto</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Consegna Prevista</th>
                <th className="pb-3 text-right">Prezzo Finale</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order: any) => (
                <tr key={order.id} className="border-b last:border-0">
                  <td className="py-3 font-medium">{order.client_name}</td>
                  <td className="py-3">{order.products?.name || 'Prodotto Custom'}</td>
                  <td className="py-3">{order.status}</td>
                  <td className="py-3">{order.expected_delivery_date || '-'}</td>
                  <td className="py-3 text-right font-semibold">€{order.final_selling_price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-10 text-muted-foreground">Nessun ordine trovato.</div>
        )}
      </div>
    </div>
  )
}
