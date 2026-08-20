import { createClient } from "@/lib/supabase/server"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { NewMaterialDialog } from "@/components/inventory/NewMaterialDialog"
import { NewProductDialog } from "@/components/inventory/NewProductDialog"
import { NewExtraDialog } from "@/components/inventory/NewExtraDialog"

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
        <TabsContent value="materials" className="bg-card p-6 rounded-md border shadow-sm mt-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Bobine (Filamento)</h2>
            <NewMaterialDialog />
          </div>
          {materials?.map((m: any) => (
            <div key={m.id} className="flex justify-between py-2 border-b last:border-0">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: m.hex_code }}></div>
                <span>{m.brand} {m.material_type} - {m.color_name}</span>
              </div>
              <span className="font-mono text-sm">{m.current_stock_g}g / {m.spool_weight_g}g</span>
            </div>
          ))}
          {materials?.length === 0 && <p className="text-muted-foreground text-sm">Nessuna bobina presente.</p>}
        </TabsContent>
        <TabsContent value="products" className="bg-card p-6 rounded-md border shadow-sm mt-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Prodotti Base</h2>
            <NewProductDialog />
          </div>
          {products?.map((p: any) => (
             <div key={p.id} className="flex justify-between py-2 border-b last:border-0">
               <span>{p.name} ({p.type})</span>
               <span>€{p.base_selling_price}</span>
             </div>
          ))}
          {products?.length === 0 && <p className="text-muted-foreground text-sm">Nessun prodotto base inserito.</p>}
        </TabsContent>
        <TabsContent value="extras" className="bg-card p-6 rounded-md border shadow-sm mt-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Catalogo Accessori Extra</h2>
            <NewExtraDialog />
          </div>
          {extras?.map((e: any) => (
             <div key={e.id} className="flex justify-between py-2 border-b last:border-0">
               <span>{e.name}</span>
               <span className="text-sm text-muted-foreground">Costo: €{e.default_cost} / Prezzo al cliente: €{e.default_price}</span>
             </div>
          ))}
          {extras?.length === 0 && <p className="text-muted-foreground text-sm">Nessun extra nel catalogo.</p>}
        </TabsContent>
      </Tabs>
    </div>
  )
}
