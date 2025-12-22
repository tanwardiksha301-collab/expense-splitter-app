import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Participant } from '../App';
import { UserPlus, Trash2 } from 'lucide-react';

interface ParticipantManagerProps {
  participants: Participant[];
  onParticipantsUpdated: () => void;
}

export function ParticipantManager({
  participants,
  onParticipantsUpdated,
}: ParticipantManagerProps) {
  const [newName, setNewName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddParticipant = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newName.trim()) {
      alert('Please enter a name');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('participants')
        .insert({ name: newName.trim() });

      if (error) throw error;

      setNewName('');
      onParticipantsUpdated();
    } catch (error) {
      console.error('Error adding participant:', error);
      alert('Failed to add participant. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteParticipant = async (participantId: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove ${name}?`)) {
      try {
        const { error } = await supabase
          .from('participants')
          .delete()
          .eq('id', participantId);

        if (error) throw error;

        onParticipantsUpdated();
      } catch (error) {
        console.error('Error deleting participant:', error);
        alert('Failed to delete participant. They may have expenses associated with them.');
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <UserPlus className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">Participants</h2>
      </div>

      <form onSubmit={handleAddParticipant} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Enter name"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg whitespace-nowrap"
          >
            {loading ? 'Adding...' : 'Add'}
          </button>
        </div>
      </form>

      {participants.length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-4 bg-gray-50 rounded-lg">
          No participants yet. Add your first one above!
        </p>
      ) : (
        <div className="space-y-2">
          {participants.map((participant) => (
            <div
              key={participant.id}
              className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all"
            >
              <span className="font-medium text-gray-900">{participant.name}</span>
              <button
                onClick={() => handleDeleteParticipant(participant.id, participant.name)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all"
                aria-label="Delete participant"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
