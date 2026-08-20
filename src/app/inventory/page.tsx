import { createClient } from "@/lib/supabase/server"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function InventoryPage() {
  const supabase = createClient()
  const { data: materials } = await supabase.from('materials').select('*')
  const { data: products } = await supabase.from('products').select('*')
  const { data: extras } = await supabase.from('extras_catalog').select('*')

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Inventario</h1>
      
      <Tabs defaultValue="materials" className="w-full">
        <TabsList>
          <TabsTrigger value="materials">Bobine e Materiali</TabsTrigger>
          <TabsTrigger value="products">Prodotti Standard</TabsTrigger>
          <TabsTrigger value="extras">Catalogo Extra</TabsTrigger>
        </TabsList>
        <TabsContent value="materials" className="bg-white p-6 rounded-md border shadow-sm mt-4">
          <h2 className="text-xl font-semibold mb-4">Bobine (Filamento)</h2>
          {/* List materials here */}
          {materials?.map((m: any) => (
            <div key={m.id} className="flex justify-between py-2 border-b last:border-0">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: m.hex_code }}></div>
                <span>{m.brand} {m.material_type} - {m.color_name}</span>
              </div>
              <span className="font-mono text-sm">{m.current_stock_g}g / {m.spool_weight_g}g</span>
            </div>
          ))}
        </TabsContent>
        <TabsContent value="products" className="bg-white p-6 rounded-md border shadow-sm mt-4">
          <h2 className="text-xl font-semibold mb-4">Prodotti Base</h2>
          {products?.map((p: any) => (
             <div key={p.id} className="flex justify-between py-2 border-b last:border-0">
               <span>{p.name} ({p.type})</span>
               <span>€{p.base_selling_price}</span>
             </div>
          ))}
        </TabsContent>
        <TabsContent value="extras" className="bg-white p-6 rounded-md border shadow-sm mt-4">
          <h2 className="text-xl font-semibold mb-4">Catalogo Accessori Extra</h2>
          {extras?.map((e: any) => (
             <div key={e.id} className="flex justify-between py-2 border-b last:border-0">
               <span>{e.name}</span>
               <span>Costo: €{e.default_cost} / Prezzo: €{e.default_price}</span>
             </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
