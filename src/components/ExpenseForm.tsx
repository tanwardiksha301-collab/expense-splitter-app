import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Participant } from '../App';
import { PlusCircle, DollarSign } from 'lucide-react';

interface ExpenseFormProps {
  participants: Participant[];
  onExpenseAdded: () => void;
}

export function ExpenseForm({ participants, onExpenseAdded }: ExpenseFormProps) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedParticipants, setSelectedParticipants] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  const toggleParticipant = (participantId: string) => {
    const newSelected = new Set(selectedParticipants);
    if (newSelected.has(participantId)) {
      newSelected.delete(participantId);
    } else {
      newSelected.add(participantId);
    }
    setSelectedParticipants(newSelected);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!description.trim() || !amount || selectedParticipants.size === 0) {
      alert('Please fill in all fields and select at least one participant');
      return;
    }

    const totalAmount = parseFloat(amount);
    if (isNaN(totalAmount) || totalAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    setLoading(true);

    try {
      const { data: expense, error: expenseError } = await supabase
        .from('expenses')
        .insert({
          description: description.trim(),
          total_amount: totalAmount,
        })
        .select()
        .single();

      if (expenseError) throw expenseError;

      const amountPerPerson = totalAmount / selectedParticipants.size;

      const expenseParticipants = Array.from(selectedParticipants).map(
        (participantId) => ({
          expense_id: expense.id,
          participant_id: participantId,
          amount_owed: parseFloat(amountPerPerson.toFixed(2)),
        })
      );

      const { error: participantsError } = await supabase
        .from('expense_participants')
        .insert(expenseParticipants);

      if (participantsError) throw participantsError;

      setDescription('');
      setAmount('');
      setSelectedParticipants(new Set());
      onExpenseAdded();
    } catch (error) {
      console.error('Error adding expense:', error);
      alert('Failed to add expense. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <PlusCircle className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">Add New Expense</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            What's this expense for?
          </label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., Dinner at restaurant"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
            Total Amount
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Split between ({selectedParticipants.size} selected)
          </label>
          {participants.length === 0 ? (
            <p className="text-gray-500 text-sm bg-gray-50 p-4 rounded-lg">
              No participants yet. Add participants in the right panel to get started.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {participants.map((participant) => (
                <button
                  key={participant.id}
                  type="button"
                  onClick={() => toggleParticipant(participant.id)}
                  className={`px-4 py-3 rounded-lg font-medium transition-all ${
                    selectedParticipants.has(participant.id)
                      ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {participant.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || participants.length === 0}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
        >
          {loading ? 'Adding...' : 'Add Expense'}
        </button>
      </form>
    </div>
  );
}
