/* ManageTeams.jsx */
import { useState } from 'react';

export default function ManageTeams({ savedTeams, onSaveTeams, onBack }) {
  const [teamName, setTeamName] = useState('');
  const [players, setPlayers] = useState([]);
  const [playerInput, setPlayerInput] = useState('');
  const [error, setError] = useState('');
  const [editingTeamId, setEditingTeamId] = useState(null);

  const addPlayer = () => {
    const val = playerInput.trim();
    if (!val) return;
    if (players.some(p => p.toLowerCase() === val.toLowerCase())) {
      setError('Player already in this team!');
      setTimeout(() => setError(''), 2500);
      return;
    }
    setPlayers([...players, val]);
    setPlayerInput('');
    setError('');
  };

  const removePlayer = (idx) => {
    setPlayers(players.filter((_, i) => i !== idx));
  };

  const saveTeam = () => {
    if (!teamName.trim()) {
      setError('Team needs a name!');
      setTimeout(() => setError(''), 2500);
      return;
    }
    if (players.length < 2) {
      setError('Add at least 2 players to save team!');
      setTimeout(() => setError(''), 2500);
      return;
    }
    if (!editingTeamId && savedTeams.some(t => t.name.toLowerCase() === teamName.trim().toLowerCase())) {
       setError('A team with this name already exists!');
       setTimeout(() => setError(''), 2500);
       return;
    }
    
    if (editingTeamId) {
      onSaveTeams(savedTeams.map(t => t.id === editingTeamId ? { ...t, name: teamName.trim(), players } : t));
      setEditingTeamId(null);
    } else {
      const newTeam = { id: Date.now(), name: teamName.trim(), players };
      onSaveTeams([...savedTeams, newTeam]);
    }
    
    // reset form
    setTeamName('');
    setPlayers([]);
  };

  const cancelEdit = () => {
    setEditingTeamId(null);
    setTeamName('');
    setPlayers([]);
    setError('');
  };

  const editTeam = (id) => {
    const t = savedTeams.find(x => x.id === id);
    if (!t) return;
    setTeamName(t.name);
    setPlayers([...t.players]);
    setEditingTeamId(id);
    setError('');
  };

  const deleteSavedTeam = (id) => {
    onSaveTeams(savedTeams.filter(t => t.id !== id));
  };

  return (
    <div className="min-h-screen flex flex-col p-4 sm:p-6 animate-fade-in-up">
      <div className="flex items-center mb-8">
        <button onClick={onBack} className="text-[var(--color-primary)] font-bold text-lg mr-4">← Back</button>
        <h2 className="text-2xl font-black bg-gradient-to-r from-[var(--color-primary)] to-purple-500 bg-clip-text text-transparent">Manage Teams</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto w-full">
        
        {/* CREATE/EDIT TEAM SECTION */}
        <div className="glass-card p-6 rounded-[24px]">
          <h3 className="text-lg font-bold mb-4 text-[var(--color-text)]">
            {editingTeamId ? 'Edit Team' : 'Create New Team'}
          </h3>
          {error && <div className="text-xs bg-red-500/10 text-red-400 p-2 rounded-lg mb-4 text-center">{error}</div>}
          
          <input
            value={teamName} onChange={e => setTeamName(e.target.value)}
            placeholder="Team Name"
            className="w-full bg-[var(--color-surface-dim)] border-2 border-[var(--color-border)] rounded-xl px-4 py-3 mb-4 text-base font-bold text-[var(--color-text)] focus:border-[var(--color-primary)]"
          />
          
          <div className="flex gap-2 mb-4">
            <input
              value={playerInput} onChange={e => setPlayerInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addPlayer()}
              placeholder="Player Name"
              className="flex-1 bg-[var(--color-surface-dim)] border-2 border-[var(--color-border)] rounded-xl px-4 py-3 text-sm text-[var(--color-text)] focus:border-[var(--color-primary)]"
            />
            <button onClick={addPlayer} className="bg-[var(--color-primary)] text-white px-5 rounded-xl font-bold hover:opacity-90 transition-all">+ Add</button>
          </div>

          <div className="border border-[var(--color-border)] rounded-xl p-3 max-h-48 overflow-y-auto mb-4 bg-[var(--color-surface-dim)]">
             {players.length === 0 ? <p className="text-xs text-[var(--color-text-muted)] text-center">No players added. You can add 11+ players.</p> : null}
             {players.map((p, i) => (
               <div key={i} className="flex justify-between p-2 hover:bg-[var(--color-border)]/50 rounded-lg group">
                 <span className="text-sm font-bold text-[var(--color-text)]">{i+1}. {p}</span>
                 <button onClick={() => removePlayer(i)} className="text-red-400 text-xs hidden group-hover:block px-2">✕</button>
               </div>
             ))}
          </div>

          <div className="flex gap-3">
            <button onClick={saveTeam} className="flex-1 py-4 rounded-xl text-lg font-bold bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg hover:-translate-y-1 transition-all">
              {editingTeamId ? 'Update Team 🔄' : 'Save Team 💾'}
            </button>
            {editingTeamId && (
              <button onClick={cancelEdit} className="px-6 py-4 rounded-xl text-lg font-bold bg-[var(--color-surface-dim)] border border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-primary)] transition-all">
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* SAVED TEAMS SECTION */}
        <div className="glass-card p-6 rounded-[24px]">
          <h3 className="text-lg font-bold mb-4 text-[var(--color-text)]">Saved Teams ({savedTeams.length})</h3>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {savedTeams.length === 0 ? <p className="text-sm text-[var(--color-text-muted)] italic">No saved teams yet.</p> : null}
            {savedTeams.map(team => (
              <div key={team.id} className="border border-[var(--color-border)] bg-[var(--color-surface-dim)] p-4 rounded-xl relative group">
                 <h4 className="font-black text-[var(--color-primary)] text-lg mb-1">{team.name}</h4>
                 <p className="text-xs text-[var(--color-text-muted)] mb-3">{team.players.length} Players</p>
                 <div className="flex flex-wrap gap-1">
                   {team.players.map((p, i) => (
                     <span key={i} className="text-[10px] bg-[var(--bg-card)] px-2 py-1 rounded border border-[var(--color-border)]">{p}</span>
                   ))}
                 </div>
                 <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                   <button onClick={() => editTeam(team.id)} className="text-xs font-bold text-blue-500 bg-blue-500/10 px-3 py-1 rounded shadow-sm">Edit</button>
                   <button onClick={() => deleteSavedTeam(team.id)} className="text-xs font-bold text-red-500 bg-red-500/10 px-3 py-1 rounded shadow-sm">Delete</button>
                 </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
