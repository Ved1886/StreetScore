import { useState } from 'react';

/* ============================================
   TeamSetup.jsx — Full-screen team creation
   Users name their teams, add player names,
   and then start the match.
   ============================================ */

// Minimum players per team to start a match
const MIN_PLAYERS = 2;
const MAX_PLAYERS = 99;

export default function TeamSetup({ onStartMatch, initialTeams, savedTeams }) {
  // Team A state
  const [teamAName, setTeamAName] = useState(initialTeams?.teamAName || '');
  const [teamAPlayers, setTeamAPlayers] = useState(initialTeams?.teamAPlayers || []);
  const [teamAInput, setTeamAInput] = useState('');

  // Team B state
  const [teamBName, setTeamBName] = useState(initialTeams?.teamBName || '');
  const [teamBPlayers, setTeamBPlayers] = useState(initialTeams?.teamBPlayers || []);
  const [teamBInput, setTeamBInput] = useState('');

  // Error message
  const [error, setError] = useState('');

  // --- Add player to a team ---
  const addPlayer = (team) => {
    const input = team === 'A' ? teamAInput.trim() : teamBInput.trim();
    if (!input) return;

    const players = team === 'A' ? teamAPlayers : teamBPlayers;

    // Validation
    if (players.length >= MAX_PLAYERS) {
      setError(`Maximum ${MAX_PLAYERS} players per team!`);
      setTimeout(() => setError(''), 2500);
      return;
    }
    if (players.some(p => p.toLowerCase() === input.toLowerCase())) {
      setError('Player already in team!');
      setTimeout(() => setError(''), 2500);
      return;
    }

    if (team === 'A') {
      setTeamAPlayers([...teamAPlayers, input]);
      setTeamAInput('');
    } else {
      setTeamBPlayers([...teamBPlayers, input]);
      setTeamBInput('');
    }
    setError('');
  };

  // --- Remove player from a team ---
  const removePlayer = (team, index) => {
    if (team === 'A') {
      setTeamAPlayers(teamAPlayers.filter((_, i) => i !== index));
    } else {
      setTeamBPlayers(teamBPlayers.filter((_, i) => i !== index));
    }
  };

  // --- Handle Enter key for adding player ---
  const handleKeyDown = (e, team) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addPlayer(team);
    }
  };

  // --- Validate and start match ---
  const handleStart = () => {
    if (!teamAName.trim()) {
      setError('Please enter Team A name');
      setTimeout(() => setError(''), 2500);
      return;
    }
    if (!teamBName.trim()) {
      setError('Please enter Team B name');
      setTimeout(() => setError(''), 2500);
      return;
    }
    if (teamAPlayers.length < MIN_PLAYERS) {
      setError(`Team A needs at least ${MIN_PLAYERS} players`);
      setTimeout(() => setError(''), 2500);
      return;
    }
    if (teamBPlayers.length < MIN_PLAYERS) {
      setError(`Team B needs at least ${MIN_PLAYERS} players`);
      setTimeout(() => setError(''), 2500);
      return;
    }

    onStartMatch({
      teamAName: teamAName.trim(),
      teamAPlayers,
      teamBName: teamBName.trim(),
      teamBPlayers,
    });
  };

  const canStart = teamAName.trim() && teamBName.trim() &&
                   teamAPlayers.length >= MIN_PLAYERS &&
                   teamBPlayers.length >= MIN_PLAYERS;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Title */}
        <div className="text-center mb-8 animate-fade-in-up">
          <img src="/logo.png" alt="Logo" className="w-16 h-16 mx-auto mb-4 rounded-2xl shadow-lg border border-[var(--color-border)] object-cover" />
          <h1 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] bg-clip-text text-transparent mb-2"
              style={{ fontFamily: 'var(--font-display)' }}>
            StreetScore
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Set up your teams and players to get started
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-[var(--color-accent-red)]/10 border border-[var(--color-accent-red)]/30 text-[var(--color-accent-red)] text-sm font-semibold text-center animate-badge-pop">
            ⚠️ {error}
          </div>
        )}

        {/* Two team cards side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Team A Card */}
          <TeamCard
            teamLabel="Team A"
            savedTeams={savedTeams}
            teamColor="from-[var(--color-primary)] to-[var(--color-primary-light)]"
            teamAccent="var(--color-primary)"
            badgeBg="bg-[var(--color-primary)]/10"
            teamName={teamAName}
            setTeamName={setTeamAName}
            players={teamAPlayers}
            setPlayers={setTeamAPlayers}
            playerInput={teamAInput}
            setPlayerInput={setTeamAInput}
            onAddPlayer={() => addPlayer('A')}
            onRemovePlayer={(i) => removePlayer('A', i)}
            onKeyDown={(e) => handleKeyDown(e, 'A')}
            icon="🏏"
          />

          {/* VS Divider (mobile) */}
          <div className="flex items-center justify-center md:hidden">
            <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center text-sm font-black text-[var(--color-primary)]">
              VS
            </div>
          </div>

          {/* Team B Card */}
          <TeamCard
            teamLabel="Team B"
            savedTeams={savedTeams}
            teamColor="from-[var(--color-accent-green)] to-[var(--color-accent-green-light)]"
            teamAccent="var(--color-accent-green)"
            badgeBg="bg-[var(--color-accent-green)]/10"
            teamName={teamBName}
            setTeamName={setTeamBName}
            players={teamBPlayers}
            setPlayers={setTeamBPlayers}
            playerInput={teamBInput}
            setPlayerInput={setTeamBInput}
            onAddPlayer={() => addPlayer('B')}
            onRemovePlayer={(i) => removePlayer('B', i)}
            onKeyDown={(e) => handleKeyDown(e, 'B')}
            icon="🏆"
          />
        </div>

        {/* Start Match Button */}
        <button
          id="btn-start-match"
          onClick={handleStart}
          disabled={!canStart}
          className={`w-full py-4 rounded-2xl text-lg font-bold transition-all duration-300 cursor-pointer ${
            canStart
              ? 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] text-white shadow-lg hover:shadow-xl hover:-translate-y-1 active:scale-[0.98]'
              : 'bg-[var(--color-surface-dim)] text-[var(--color-text-muted)] border-2 border-[var(--color-border)] cursor-not-allowed'
          }`}
        >
          {canStart ? '🏏 Start Match' : `Add at least ${MIN_PLAYERS} players to each team`}
        </button>

        {/* Quick Info */}
        <p className="text-center text-xs text-[var(--color-text-muted)] mt-4">
          {MIN_PLAYERS}–{MAX_PLAYERS} players per team • Press Enter to add player
        </p>
      </div>
    </div>
  );
}

/* ============================================
   TeamCard — Reusable team creation card
   ============================================ */
function TeamCard({
  teamLabel,
  teamColor,
  teamAccent,
  badgeBg,
  teamName,
  setTeamName,
  players,
  setPlayers,
  playerInput,
  setPlayerInput,
  onAddPlayer,
  onRemovePlayer,
  onKeyDown,
  icon,
  savedTeams,
}) {
  const handleSavedTeamSelect = (e) => {
    const t = savedTeams.find(t => t.id.toString() === e.target.value);
    if (t) {
      setTeamName(t.name);
      setPlayers(t.players);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-5 animate-fade-in-up">
      {/* Team Header */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">{icon}</span>
        <h3 className={`text-sm font-bold uppercase tracking-wider bg-gradient-to-r ${teamColor} bg-clip-text text-transparent`}>
          {teamLabel}
        </h3>
        <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full ${badgeBg}`} style={{ color: teamAccent }}>
          {players.length}/{MAX_PLAYERS}
        </span>
      </div>

      {/* Select Saved Team */}
      <select
        onChange={handleSavedTeamSelect}
        className="w-full bg-[var(--color-surface-dim)] border border-[var(--color-border)] rounded-xl px-4 py-2 cursor-pointer mb-5 text-sm font-semibold text-[var(--color-text)] focus:border-[var(--color-primary)] shadow-sm"
      >
        <option value="">{savedTeams && savedTeams.length > 0 ? 'Load from Saved Teams...' : 'No Saved Teams (Create in Dashboard)'}</option>
        {savedTeams && savedTeams.map(t => (
          <option key={t.id} value={t.id}>{t.name} ({t.players.length} players)</option>
        ))}
      </select>

      {/* Team Name Input */}
      <input
        type="text"
        value={teamName}
        onChange={(e) => setTeamName(e.target.value)}
        placeholder={`Enter ${teamLabel} name...`}
        className="w-full bg-[var(--color-surface-dim)] border-2 border-[var(--color-border)] rounded-xl px-4 py-3 text-base font-bold text-[var(--color-text)] transition-all duration-200 focus:border-[color:var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 placeholder:text-[var(--color-text-muted)] placeholder:font-normal mb-3"
        style={{ borderColor: teamName ? teamAccent : undefined }}
      />

      {/* Add Player Input */}
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={playerInput}
          onChange={(e) => setPlayerInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Player name..."
          className="flex-1 bg-[var(--color-surface-dim)] border-2 border-[var(--color-border)] rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--color-text)] transition-all duration-200 focus:border-[color:var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 placeholder:text-[var(--color-text-muted)]"
        />
        <button
          onClick={onAddPlayer}
          disabled={!playerInput.trim() || players.length >= MAX_PLAYERS}
          className={`px-4 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer ${
            playerInput.trim() && players.length < MAX_PLAYERS
              ? `bg-gradient-to-r ${teamColor} text-white hover:-translate-y-0.5 active:scale-95`
              : 'bg-[var(--color-surface-dim)] text-[var(--color-text-muted)] cursor-not-allowed border-2 border-[var(--color-border)]'
          }`}
        >
          + Add
        </button>
      </div>

      {/* Players List */}
      <div className="space-y-1.5 max-h-64 overflow-y-auto">
        {players.length === 0 ? (
          <p className="text-center py-4 text-xs text-[var(--color-text-muted)] italic">
            No players added yet
          </p>
        ) : (
          players.map((player, index) => (
            <div
              key={index}
              className="flex items-center justify-between px-3 py-2 rounded-xl bg-[var(--color-surface-dim)] border border-[var(--color-border)] group hover:border-[color:var(--color-primary)] transition-all duration-200 animate-fade-in-up"
            >
              <div className="flex items-center gap-2.5">
                {/* Player number badge */}
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white bg-gradient-to-br ${teamColor}`}
                >
                  {index + 1}
                </span>
                <span className="text-sm font-semibold text-[var(--color-text)]">
                  {player}
                </span>
              </div>
              <button
                onClick={() => onRemovePlayer(index)}
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs text-[var(--color-text-muted)] hover:text-[var(--color-accent-red)] hover:bg-[var(--color-accent-red)]/10 transition-all duration-200 opacity-0 group-hover:opacity-100 cursor-pointer"
                title="Remove player"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
