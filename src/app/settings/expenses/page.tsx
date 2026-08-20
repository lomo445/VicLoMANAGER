import { createClient } from "@/lib/supabase/server"
import { NewExpenseDialog } from "@/components/settings/NewExpenseDialog"

export default async function ExpensesPage() {
  const supabase = createClient()
  const { data: expenses } = await supabase.from('expenses').select('*').order('expense_date', { ascending: false })

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Registro Spese Operative</h2>
        <NewExpenseDialog />
      </div>
      
      <div className="bg-white rounded-md border shadow-sm p-4">
        {expenses && expenses.length > 0 ? (
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
              {expenses.map((e: any) => (
                <tr key={e.id} className="border-b last:border-0">
                  <td className="py-3 text-gray-500">{new Date(e.expense_date).toLocaleDateString('it-IT')}</td>
                  <td className="py-3 capitalize">
                    <span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium">
                      {e.category.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3">{e.title}</td>
                  <td className="py-3 text-right font-bold text-red-600">-€{e.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-10 text-muted-foreground">Nessuna spesa registrata.</div>
        )}
      </div>
    </div>
  )
}
