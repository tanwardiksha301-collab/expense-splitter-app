import { Expense } from '../App';
import { Calculator } from 'lucide-react';

interface SummaryProps {
  expenses: Expense[];
}

export function Summary({ expenses }: SummaryProps) {
  const calculateTotals = () => {
    const totals = new Map<string, { name: string; total: number }>();

    expenses.forEach((expense) => {
      expense.participants.forEach((participant) => {
        const existing = totals.get(participant.id) || {
          name: participant.name,
          total: 0,
        };
        totals.set(participant.id, {
          name: participant.name,
          total: existing.total + participant.amount_owed,
        });
      });
    });

    return Array.from(totals.values()).sort((a, b) => b.total - a.total);
  };

  const totals = calculateTotals();
  const grandTotal = totals.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
      <div className="flex items-center gap-2 mb-6">
        <Calculator className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">Summary</h2>
      </div>

      {totals.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          No expenses to summarize yet
        </p>
      ) : (
        <>
          <div className="space-y-3 mb-6">
            {totals.map((item) => (
              <div
                key={item.name}
                className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg"
              >
                <span className="font-medium text-gray-900">{item.name}</span>
                <span className="font-bold text-blue-600 text-lg">
                  ${item.total.toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t-2 border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-gray-900">Total</span>
              <span className="text-2xl font-bold text-gray-900">
                ${grandTotal.toFixed(2)}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
