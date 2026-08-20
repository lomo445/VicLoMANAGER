import { createClient } from "@/lib/supabase/server"

export default async function SettingsPage() {
  const supabase = createClient()
  const { data: locations } = await supabase.from('locations').select('*, printers(*)')

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Postazioni e Stampanti 3D</h2>
      
      {locations?.map((loc: any) => (
        <div key={loc.id} className="mb-6 p-4 border rounded-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg">{loc.name}</h3>
            <span className="text-sm text-gray-500">Costo Elettricità: €{loc.electricity_cost_kwh} / kWh</span>
          </div>
          
          <h4 className="text-sm font-semibold mb-2">Macchine:</h4>
          <div className="space-y-2">
            {loc.printers?.map((p: any) => (
              <div key={p.id} className="flex justify-between items-center bg-gray-50 p-2 rounded text-sm">
                <span>{p.model_name}</span>
                <span>{p.power_consumption_w} W | Stato: {p.status}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
