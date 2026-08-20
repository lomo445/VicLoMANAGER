import { createClient } from "@/lib/supabase/server"

export default async function ExpensesPage() {
  const supabase = createClient()
  const { data: expenses } = await supabase.from('expenses').select('*').order('expense_date', { ascending: false })

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Registro Spese Operative</h2>
      
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b">
            <th className="pb-3">Data</th>
            <th className="pb-3">Categoria</th>
            <th className="pb-3">Descrizione</th>
            <th className="pb-3 text-right">Importo</th>
          </tr>
        </thead>
        <tbody>
          {expenses?.map((e: any) => (
            <tr key={e.id} className="border-b last:border-0">
              <td className="py-3">{e.expense_date}</td>
              <td className="py-3 capitalize">{e.category.replace('_', ' ')}</td>
              <td className="py-3">{e.title}</td>
              <td className="py-3 text-right font-semibold text-red-600">€{e.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
