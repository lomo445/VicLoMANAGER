import { createClient } from "@/lib/supabase/server"
import { NewLocationDialog } from "@/components/settings/NewLocationDialog"
import { NewPrinterDialog } from "@/components/settings/NewPrinterDialog"

export default async function SettingsPage() {
  const supabase = createClient()
  const { data: locations } = await supabase.from('locations').select('*, printers(*)')

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Postazioni e Stampanti 3D</h2>
        <div className="flex gap-2">
          <NewLocationDialog />
          <NewPrinterDialog locations={locations || []} />
        </div>
      </div>
      
      {locations?.map((loc: any) => (
        <div key={loc.id} className="mb-6 p-4 border rounded-md shadow-sm bg-white">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg">{loc.name}</h3>
            <span className="text-sm text-gray-500 font-medium">Costo Elettricità: €{loc.electricity_cost_kwh} / kWh</span>
          </div>
          
          <h4 className="text-sm font-semibold mb-2">Macchine collegate:</h4>
          {loc.printers && loc.printers.length > 0 ? (
            <div className="space-y-2">
              {loc.printers.map((p: any) => (
                <div key={p.id} className="flex justify-between items-center bg-gray-50 p-2 px-3 border rounded text-sm">
                  <span className="font-medium">{p.model_name}</span>
                  <div className="flex gap-4">
                    <span className="text-orange-600 font-mono">{p.power_consumption_w} W</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${p.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {p.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Nessuna stampante in questa postazione.</p>
          )}
        </div>
      ))}

      {locations?.length === 0 && (
        <div className="text-center py-10 text-muted-foreground">
          Nessuna sede configurata. Aggiungi la tua prima sede e le stampanti.
        </div>
      )}
    </div>
  )
}
