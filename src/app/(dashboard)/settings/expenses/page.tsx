import { createClient } from "@/lib/supabase/server"
import { NewExpenseDialog } from "@/components/settings/NewExpenseDialog"
import { DeleteButton } from "@/components/ui-custom/DeleteButton"
import { deleteExpense } from "@/app/actions/settings"

export default async function ExpensesPage() {
  const supabase = createClient()
  const { data: expenses } = await supabase.from('expenses').select('*').order('expense_date', { ascending: false })

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Registro Spese Operative</h2>
        <NewExpenseDialog />
      </div>
      
      <div className="bg-card rounded-md border shadow-sm p-4">
        {expenses && expenses.length > 0 ? (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b">
                <th className="pb-3">Data</th>
                <th className="pb-3">Categoria</th>
                <th className="pb-3">Descrizione</th>
                <th className="pb-3 text-right">Importo</th>
                <th className="pb-3 text-right">Azioni</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((e: any) => (
                <tr key={e.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="py-3 text-muted-foreground">{new Date(e.expense_date).toLocaleDateString('it-IT')}</td>
                  <td className="py-3 capitalize">
                    <span className="bg-muted px-2 py-1 rounded text-xs font-medium border border-border">
                      {e.category.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3">{e.title}</td>
                  <td className="py-3 text-right font-bold text-red-500">-€{e.amount}</td>
                  <td className="py-3 text-right">
                    <DeleteButton id={e.id} actionFn={deleteExpense} />
                  </td>
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
