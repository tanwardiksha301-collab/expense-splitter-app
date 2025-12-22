import { Expense } from '../App';
import { Calculator, TrendingDown } from 'lucide-react';

interface SummaryProps {
  expenses: Expense[];
}

export function Summary({ expenses }: SummaryProps) {
  const calculateBalances = () => {
    const balances = new Map<string, { name: string; paid: number; owes: number }>();

    expenses.forEach((expense) => {
      const payer = expense.paid_by;
      const payerName = expense.payer_name;

      const existing = balances.get(payer) || {
        name: payerName,
        paid: 0,
        owes: 0,
      };

      existing.paid += expense.total_amount;

      balances.set(payer, existing);

      expense.participants.forEach((participant) => {
        const participantExisting = balances.get(participant.id) || {
          name: participant.name,
          paid: 0,
          owes: 0,
        };
        participantExisting.owes += participant.amount_owed;
        balances.set(participant.id, participantExisting);
      });
    });

    return Array.from(balances.values())
      .map((item) => ({
        ...item,
        net: item.paid - item.owes,
      }))
      .sort((a, b) => b.net - a.net);
  };

  const balances = calculateBalances();
  const totalPaid = balances.reduce((sum, item) => sum + item.paid, 0);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
      <div className="flex items-center gap-2 mb-6">
        <Calculator className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">Settlement Summary</h2>
      </div>

      {balances.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          No expenses to summarize yet
        </p>
      ) : (
        <>
          <div className="space-y-3 mb-6">
            {balances.map((item) => (
              <div
                key={item.name}
                className={`p-4 rounded-lg border-l-4 ${
                  item.net > 0
                    ? 'bg-green-50 border-l-green-500'
                    : item.net < 0
                      ? 'bg-red-50 border-l-red-500'
                      : 'bg-gray-50 border-l-gray-500'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold text-gray-900">{item.name}</span>
                  <span
                    className={`font-bold text-lg ${
                      item.net > 0
                        ? 'text-green-600'
                        : item.net < 0
                          ? 'text-red-600'
                          : 'text-gray-600'
                    }`}
                  >
                    {item.net > 0 ? '+' : ''} ${item.net.toFixed(2)}
                  </span>
                </div>
                <div className="text-xs text-gray-600 space-y-0.5">
                  <p>Paid: <span className="font-semibold text-gray-900">${item.paid.toFixed(2)}</span></p>
                  <p>Owes: <span className="font-semibold text-gray-900">${item.owes.toFixed(2)}</span></p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t-2 border-gray-200 mb-4">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-900">Total Expenses</span>
              <span className="text-2xl font-bold text-blue-600">
                ${totalPaid.toFixed(2)}
              </span>
            </div>
          </div>

          {balances.some((item) => item.net !== 0) && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <TrendingDown className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-gray-900 mb-1">Settlement Needed</p>
                  <p className="text-gray-600">Positive amounts are owed to the person, negative amounts they owe to others.</p>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
