import { createClient } from "@/lib/supabase/server"
import { NewOrderDialog } from "@/components/orders/NewOrderDialog"

export default async function OrdersPage() {
  const supabase = createClient()
  const { data: orders } = await supabase.from('orders').select('*, order_items(*, products(name))').order('created_at', { ascending: false })
  const { data: products } = await supabase.from('products').select('*')
  const { data: extrasCatalog } = await supabase.from('extras_catalog').select('*')

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Ordini</h1>
        <NewOrderDialog products={products || []} extrasCatalog={extrasCatalog || []} />
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
              </tr>
            </thead>
            <tbody>
              {orders.map((order: any) => (
                <tr key={order.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
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
                  <td className="py-3 px-2">{order.expected_delivery_date || '-'}</td>
                  <td className="py-3 px-2 capitalize">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold
                      ${order.status === 'consegnato' ? 'bg-green-500/20 text-green-500' : 
                        order.status === 'da_stampare' ? 'bg-muted text-muted-foreground' : 
                        order.status === 'pronto' ? 'bg-blue-500/20 text-blue-500' : 
                        'bg-yellow-500/20 text-yellow-500'
                      }`}>
                      {order.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-right font-semibold text-green-500">€{order.final_selling_price}</td>
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
