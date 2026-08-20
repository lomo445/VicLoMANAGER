import { createClient } from "@/lib/supabase/server"
import { NewMaterialDialog } from "@/components/inventory/NewMaterialDialog"
import { NewProductDialog } from "@/components/inventory/NewProductDialog"
import { EditProductDialog } from "@/components/inventory/EditProductDialog"
import { NewExtraDialog } from "@/components/inventory/NewExtraDialog"
import { DeleteButton } from "@/components/ui-custom/DeleteButton"
import { EditMaterialDialog } from "@/components/inventory/EditMaterialDialog"
import { EditExtraDialog } from "@/components/inventory/EditExtraDialog"
import { deleteMaterial, deleteProduct, deleteExtra } from "@/app/actions/inventory"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function InventoryPage() {
  const supabase = createClient()
  
  const { data: materials } = await supabase.from('materials').select('*')
  const { data: products } = await supabase.from('products').select('*, materials(brand, material_type)')
  const { data: extras } = await supabase.from('extras_catalog').select('*')

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground">Inventario & Prodotti</h1>
      </div>

      <Tabs defaultValue="products" className="w-full">
        <TabsList className="w-full bg-muted border border-border">
          <TabsTrigger value="products" className="flex-1">Catalogo Prodotti</TabsTrigger>
          <TabsTrigger value="materials" className="flex-1">Tipi Materiale</TabsTrigger>
          <TabsTrigger value="extras" className="flex-1">Lavorazioni Extra</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="mt-6">
          <div className="flex justify-end mb-4">
            <NewProductDialog materials={materials || []} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products?.map(p => (
              <div key={p.id} className="border border-border p-4 rounded-xl shadow-sm flex flex-col gap-2 bg-card">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg text-card-foreground">{p.name}</h3>
                  <div className="flex gap-1">
                    <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">{p.type}</span>
                    <EditProductDialog product={p} materials={materials || []} /><DeleteButton id={p.id} actionFn={deleteProduct} />
                  </div>
                </div>
                <div className="text-sm text-muted-foreground flex flex-col gap-1 mt-2">
                  <span>Peso Base: <strong className="text-foreground">{p.base_weight_g} g</strong></span>
                  <span>Tempo Stampa: <strong className="text-foreground">{p.base_print_time_minutes} min</strong></span>
                  <span>Prezzo Pubblico: <strong className="text-green-600 font-bold">€{p.base_selling_price}</strong></span>
                  {p.materials && <span className="text-xs mt-1 bg-muted p-1 rounded inline-block border border-border">Mat: {p.materials.brand} {p.materials.material_type}</span>}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="materials" className="mt-6">
          <div className="flex justify-end mb-4">
            <NewMaterialDialog />
          </div>
          <div className="bg-card border border-border rounded-md shadow-sm overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted text-muted-foreground border-b border-border">
                <tr>
                  <th className="p-3">Marca</th>
                  <th className="p-3">Tipo Materiale</th>
                  <th className="p-3">Costo/Kg</th>
                  <th className="p-3 text-right">Azioni</th>
                </tr>
              </thead>
              <tbody>
                {materials?.map(m => (
                  <tr key={m.id} className="border-b border-border last:border-0">
                    <td className="p-3 font-medium text-foreground">{m.brand}</td>
                    <td className="p-3 text-foreground">{m.material_type}</td>
                    <td className="p-3 text-foreground font-bold">€{m.cost_per_kg}</td>
                    <td className="p-3 text-right">
                      <div className="flex justify-end gap-1"><EditMaterialDialog material={m} /><DeleteButton id={m.id} actionFn={deleteMaterial} /></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="extras" className="mt-6">
          <div className="flex justify-end mb-4">
            <NewExtraDialog />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {extras?.map(e => (
              <div key={e.id} className="bg-card border border-border p-4 rounded-md shadow-sm">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-foreground">{e.name}</h4>
                  <div className="flex justify-end gap-1"><EditExtraDialog extra={e} /><DeleteButton id={e.id} actionFn={deleteExtra} /></div>
                </div>
                <div className="mt-2 text-sm flex justify-between text-muted-foreground">
                  <span>Costo: €{e.default_cost}</span>
                  
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

      </Tabs>
    </div>
  )
}
