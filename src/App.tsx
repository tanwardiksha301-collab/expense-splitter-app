import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { ExpenseForm } from './components/ExpenseForm';
import { ExpenseList } from './components/ExpenseList';
import { Summary } from './components/Summary';
import { ParticipantManager } from './components/ParticipantManager';
import { Receipt } from 'lucide-react';

export interface Participant {
  id: string;
  name: string;
}

export interface Expense {
  id: string;
  description: string;
  total_amount: number;
  expense_date: string;
  created_at: string;
  paid_by: string;
  payer_name: string;
  participants: Array<{
    id: string;
    name: string;
    amount_owed: number;
  }>;
}

function App() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    await Promise.all([loadExpenses(), loadParticipants()]);
    setLoading(false);
  }

  async function loadParticipants() {
    const { data, error } = await supabase
      .from('participants')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error loading participants:', error);
      return;
    }

    setParticipants(data || []);
  }

  async function loadExpenses() {
    const { data: expensesData, error } = await supabase
      .from('expenses')
      .select('*, participants!paid_by(name)')
      .order('expense_date', { ascending: false });

    if (error) {
      console.error('Error loading expenses:', error);
      return;
    }

    const expensesWithParticipants = await Promise.all(
      (expensesData || []).map(async (expense) => {
        const { data: expenseParticipants } = await supabase
          .from('expense_participants')
          .select(`
            amount_owed,
            participant_id,
            participants (
              id,
              name
            )
          `)
          .eq('expense_id', expense.id);

        return {
          ...expense,
          payer_name: (expense.participants as any)?.name || 'Unknown',
          participants: (expenseParticipants || []).map((ep: any) => ({
            id: ep.participants.id,
            name: ep.participants.name,
            amount_owed: ep.amount_owed,
          })),
        };
      })
    );

    setExpenses(expensesWithParticipants);
  }

  async function handleExpenseAdded() {
    await loadExpenses();
  }

  async function handleDeleteExpense(expenseId: string) {
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', expenseId);

    if (error) {
      console.error('Error deleting expense:', error);
      return;
    }

    await loadExpenses();
  }

  async function handleParticipantsUpdated() {
    await loadParticipants();
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-blue-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Receipt className="w-10 h-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Smart Expense Splitter</h1>
          </div>
          <p className="text-gray-600">Split bills easily with friends and family</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <ExpenseForm
              participants={participants}
              onExpenseAdded={handleExpenseAdded}
            />
            <ExpenseList
              expenses={expenses}
              onDeleteExpense={handleDeleteExpense}
            />
          </div>

          <div className="space-y-6">
            <ParticipantManager
              participants={participants}
              onParticipantsUpdated={handleParticipantsUpdated}
            />
            <Summary expenses={expenses} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
