import { Expense } from '../App';
import { Trash2, Users } from 'lucide-react';

interface ExpenseListProps {
  expenses: Expense[];
  onDeleteExpense: (expenseId: string) => void;
}

export function ExpenseList({ expenses, onDeleteExpense }: ExpenseListProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
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

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Expenses</h2>
      <div className="space-y-4">
        {expenses.map((expense) => (
          <div
            key={expense.id}
            className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {expense.description}
                </h3>
                <p className="text-sm text-gray-500">{formatDate(expense.created_at)}</p>
              </div>
              <div className="flex items-center gap-4">
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
              <p className="text-sm text-gray-600 mb-2 font-medium">Split between:</p>
              <div className="flex flex-wrap gap-2">
                {expense.participants.map((participant) => (
                  <div
                    key={participant.id}
                    className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium"
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
  );
}
