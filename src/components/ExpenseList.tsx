import { Expense } from '../App';
import { Trash2, Users, Calendar } from 'lucide-react';

interface ExpenseListProps {
  expenses: Expense[];
  onDeleteExpense: (expenseId: string) => void;
}

export function ExpenseList({ expenses, onDeleteExpense }: ExpenseListProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      weekday: 'short',
    });
  };

  const groupExpensesByDate = () => {
    const grouped = new Map<string, Expense[]>();
    expenses.forEach((expense) => {
      if (!grouped.has(expense.expense_date)) {
        grouped.set(expense.expense_date, []);
      }
      grouped.get(expense.expense_date)!.push(expense);
    });
    return Array.from(grouped.entries()).sort((a, b) =>
      new Date(b[0]).getTime() - new Date(a[0]).getTime()
    );
  };

  const getDailyTotal = (dayExpenses: Expense[]) => {
    return dayExpenses.reduce((sum, exp) => sum + exp.total_amount, 0);
  };

  const handleDelete = (expenseId: string, description: string) => {
    if (window.confirm(`Are you sure you want to delete "${description}"?`)) {
      onDeleteExpense(expenseId);
    }
  };

  if (expenses.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="text-gray-400 mb-4">
          <Users className="w-16 h-16 mx-auto" />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No expenses yet</h3>
        <p className="text-gray-500">Add your first expense to get started!</p>
      </div>
    );
  }

  const groupedExpenses = groupExpensesByDate();

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Expenses by Day</h2>
      <div className="space-y-6">
        {groupedExpenses.map(([date, dayExpenses]) => (
          <div key={date} className="border-l-4 border-blue-500 pl-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  {formatDate(date)}
                </h3>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Daily Total</p>
                <p className="text-xl font-bold text-blue-600">
                  ${getDailyTotal(dayExpenses).toFixed(2)}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {dayExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {expense.description}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Paid by: <span className="font-medium text-gray-900">{expense.payer_name}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-600">
                          ${expense.total_amount.toFixed(2)}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDelete(expense.id, expense.description)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all"
                        aria-label="Delete expense"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-600 mb-2 font-medium uppercase">Split among:</p>
                    <div className="flex flex-wrap gap-2">
                      {expense.participants.map((participant) => (
                        <div
                          key={participant.id}
                          className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full text-xs font-medium"
                        >
                          {participant.name}: ${participant.amount_owed.toFixed(2)}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
