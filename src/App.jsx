import { useState, useEffect, useCallback, useRef } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import TeamSetup from './components/TeamSetup';
import MatchConfig from './components/MatchConfig';
import ScoreBoard from './components/ScoreBoard';
import Controls from './components/Controls';
import BallTimeline from './components/BallTimeline';
import InningsBreak from './components/InningsBreak';
import MatchResult from './components/MatchResult';
import MatchHistory from './components/MatchHistory';
import ScorePopup from './components/ScorePopup';
import ConfirmModal from './components/ConfirmModal';
import PlayerSelectModal from './components/PlayerSelectModal';
import ManageTeams from './components/ManageTeams';
import Auth from './components/Auth';
import { db } from './firebase';
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { nanoid } from 'nanoid';

/* ============================================
   App.jsx — Multi-screen cricket scorer
   Screens: dashboard → teamSetup → matchConfig
            → scoring → inningsBreak → scoring
            → matchResult
   ============================================ */

const LS_KEY = 'cricket_match_v2';
const LS_HIST = 'cricket_match_history';

function load(key, fallback) {
  try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : fallback; }
  catch { return fallback; }
}
function save(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

// Default initial stats for a player
const newBatStats = () => ({ runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false });
const newBowlStats = () => ({ runsConceded: 0, wickets: 0, ballsBowled: 0 });

const DEFAULT = {
  screen: 'dashboard',
  matchType: 'standard',
  teamA: '', teamB: '',
  teamAPlayers: [], teamBPlayers: [],
  totalOvers: 20, battingTeamKey: 'A',
  innings: 1, runs: 0, wickets: 0, balls: 0, extras: 0,
  striker: '', nonStriker: '', currentBowler: '', lastBowler: '',
  batsmanStats: {}, bowlerStats: {}, outBatsmen: [],
  history: [], ballLog: [],
  firstInningsData: null, matchResult: null,
  pendingSelections: [], // ['batsman'] or ['bowler'] or ['batsman','bowler']
  shareCode: null,
};

// Sound helper
function playSound(t) {
  try {
    const c = new (window.AudioContext || window.webkitAudioContext)();
    const o = c.createOscillator(); const g = c.createGain();
    o.connect(g); g.connect(c.destination); g.gain.value = 0.08;
    o.frequency.value = t === 'six' ? 880 : t === 'four' ? 660 : t === 'wicket' ? 220 : t === 'run' ? 520 : 400;
    o.type = t === 'four' ? 'triangle' : t === 'wicket' ? 'sawtooth' : 'sine';
    o.start(); o.stop(c.currentTime + 0.12);
  } catch {}
}

export default function App() {
  const [user, setUser] = useState(() => load('streetscore_user', null));
  const [m, setM] = useState(() => load(LS_KEY, { ...DEFAULT }));
  const [hist, setHist] = useState(() => load(LS_HIST, []));
  const [popup, setPopup] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [darkMode, setDarkMode] = useState(() => load('streetscore_dark', true));
  const [soundOn, setSoundOn] = useState(() => load('streetscore_sound', true));
  const [savedTeams, setSavedTeams] = useState(() => load('streetscore_teams', []));
  const [scoreAnim, setScoreAnim] = useState(false);

  // Persist
  useEffect(() => { save('streetscore_user', user); }, [user]);
  useEffect(() => { document.documentElement.classList.toggle('dark', darkMode); save('streetscore_dark', darkMode); }, [darkMode]);
  useEffect(() => { save('streetscore_sound', soundOn); }, [soundOn]);
  useEffect(() => { save(LS_KEY, m); }, [m]);
  useEffect(() => { save('streetscore_teams', savedTeams); }, [savedTeams]);

  // ---- Live Firestore Sync ----
  useEffect(() => {
    if (m.screen !== 'scoring' && m.screen !== 'inningsBreak') return;
    if (!m.shareCode) return;
    const liveData = {
      battingTeam: m.battingTeamKey === 'A' ? m.teamA : m.teamB,
      bowlingTeam: m.battingTeamKey === 'A' ? m.teamB : m.teamA,
      runs: m.runs, wickets: m.wickets, balls: m.balls,
      totalOvers: m.totalOvers, extras: m.extras, innings: m.innings,
      striker: m.striker, nonStriker: m.nonStriker, currentBowler: m.currentBowler,
      batsmanStats: m.batsmanStats, bowlerStats: m.bowlerStats,
      ballLog: m.ballLog, firstInningsData: m.firstInningsData || null,
      matchResult: m.matchResult || null,
      updatedAt: new Date(),
    };
    setDoc(doc(db, 'liveMatches', m.shareCode), liveData).catch(() => {});
  }, [m.runs, m.wickets, m.balls, m.innings, m.screen, m.shareCode]);

  const flash = useCallback(() => { setScoreAnim(true); setTimeout(() => setScoreAnim(false), 350); }, []);
  const showPop = useCallback((t, tp) => { setPopup({ text: t, type: tp }); setTimeout(() => setPopup(null), 650); }, []);

  // ---- Derived values ----
  const overs = Math.floor(m.balls / 6);
  const ballsInOver = m.balls % 6;
  const oversDisplay = `${overs}.${ballsInOver}`;
  const totalOversNum = overs + ballsInOver / 6;
  const runRate = totalOversNum > 0 ? (m.runs / totalOversNum).toFixed(2) : '0.00';
  const battingTeamName = m.battingTeamKey === 'A' ? m.teamA : m.teamB;
  const bowlingTeamName = m.battingTeamKey === 'A' ? m.teamB : m.teamA;
  const battingPlayers = m.battingTeamKey === 'A' ? m.teamAPlayers : m.teamBPlayers;
  const bowlingPlayers = m.battingTeamKey === 'A' ? m.teamBPlayers : m.teamAPlayers;
  const target = m.firstInningsData ? m.firstInningsData.runs + 1 : null;
  const runsNeeded = target ? target - m.runs : null;
  let requiredRR = null;
  if (m.innings === 2 && m.firstInningsData) {
    const ol = m.totalOvers - totalOversNum;
    requiredRR = ol > 0 && runsNeeded > 0 ? (runsNeeded / ol).toFixed(2) : '—';
  }

  // ---- Screen Transitions ----
  const goTo = (screen) => setM(p => ({ ...p, screen }));

  // Dashboard → Team Setup
  const startNewMatch = (type = 'standard') => {
    setM({ ...DEFAULT, screen: 'teamSetup', matchType: type });
  };
  const teamsReady = (data) => setM(p => ({
    ...p, screen: 'matchConfig',
    teamA: data.teamAName, teamB: data.teamBName,
    teamAPlayers: data.teamAPlayers, teamBPlayers: data.teamBPlayers,
  }));

  // Match Config → Scoring
  const configReady = (cfg) => {
    const bKey = cfg.battingFirst;
    const bPlayers = bKey === 'A' ? m.teamAPlayers : m.teamBPlayers;
    const bs = {}; bPlayers.forEach(p => { bs[p] = newBatStats(); });
    const blPlayers = bKey === 'A' ? m.teamBPlayers : m.teamAPlayers;
    const bw = {}; blPlayers.forEach(p => { bw[p] = newBowlStats(); });
    const shareCode = nanoid(6).toUpperCase();
    setM(p => ({
      ...p, screen: 'scoring', totalOvers: cfg.totalOvers,
      battingTeamKey: bKey, striker: cfg.striker, nonStriker: cfg.nonStriker,
      currentBowler: cfg.bowler, lastBowler: '',
      batsmanStats: bs, bowlerStats: bw, outBatsmen: [],
      runs: 0, wickets: 0, balls: 0, extras: 0,
      innings: 1, history: [], ballLog: [], pendingSelections: [],
      firstInningsData: null, matchResult: null,
      matchType: p.matchType,
      shareCode,
    }));
  };

  // ---- Scoring Logic ----
  const processBall = useCallback((type, runsToAdd = 0) => {
    setM(prev => {
      if (prev.pendingSelections.length > 0) return prev; // block while selecting
      const snap = JSON.stringify({
        runs: prev.runs, wickets: prev.wickets, balls: prev.balls, extras: prev.extras,
        striker: prev.striker, nonStriker: prev.nonStriker, currentBowler: prev.currentBowler,
        lastBowler: prev.lastBowler, batsmanStats: prev.batsmanStats, bowlerStats: prev.bowlerStats,
        outBatsmen: prev.outBatsmen,
      });

      let { runs, wickets, balls, extras, striker, nonStriker, currentBowler } = prev;
      const bs = JSON.parse(JSON.stringify(prev.batsmanStats));
      const bw = JSON.parse(JSON.stringify(prev.bowlerStats));
      let out = [...prev.outBatsmen];
      const isLegal = type !== 'wide' && type !== 'noball';
      const isWicket = type === 'wicket';
      const facing = striker;
      let pending = [];
      let label, ltype;

      // Update runs & stats
      if (type === 'run') {
        runs += runsToAdd; label = `${runsToAdd}`;
        ltype = runsToAdd === 0 ? 'dot' : runsToAdd >= 4 ? (runsToAdd === 6 ? 'six' : 'four') : 'run';
        if (bs[facing]) { bs[facing].runs += runsToAdd; if (runsToAdd === 4) bs[facing].fours++; if (runsToAdd === 6) bs[facing].sixes++; }
        if (bw[currentBowler]) bw[currentBowler].runsConceded += runsToAdd;
      } else if (isWicket) {
        wickets++; label = 'W'; ltype = 'wicket';
        if (bs[facing]) bs[facing].isOut = true;
        if (bw[currentBowler]) bw[currentBowler].wickets++;
        out.push(facing);
      } else { // wide or noball
        const isStreet = prev.matchType === 'street';
        const extraRuns = isStreet ? 0 : 1;
        runs += extraRuns + runsToAdd; 
        extras += extraRuns;

        label = type === 'wide' ? 'Wd' : 'Nb';
        if (runsToAdd > 0) label += `+${runsToAdd}`;
        else if (isStreet) label += '(0)'; // Visual cue in timeline

        ltype = type === 'wide' ? 'wide' : 'noball';
        if (bw[currentBowler]) bw[currentBowler].runsConceded += (extraRuns + runsToAdd);

        // Add bat runs if hit off a No Ball
        if (type === 'noball' && runsToAdd > 0 && bs[facing]) {
          bs[facing].runs += runsToAdd;
          if (runsToAdd === 4) bs[facing].fours++;
          if (runsToAdd === 6) bs[facing].sixes++;
        }
      }

      // Legal delivery: update ball counts
      if (isLegal) {
        balls += 1;
        if (bs[facing]) bs[facing].balls += 1;
        if (bw[currentBowler]) bw[currentBowler].ballsBowled += 1;
      }

      // Striker rotation for odd runs (not wicket, not extras)
      if (type === 'run' && runsToAdd % 2 === 1 && nonStriker !== '') {
        [striker, nonStriker] = [nonStriker, striker];
      }

      // Over complete? (after legal delivery)
      const overDone = isLegal && balls > 0 && balls % 6 === 0;
      if (overDone && !isWicket && nonStriker !== '') {
        [striker, nonStriker] = [nonStriker, striker]; // end-of-over swap
      }

      // Max wickets = batting team size (last man bats alone)
      const batPlayers = prev.battingTeamKey === 'A' ? prev.teamAPlayers : prev.teamBPlayers;
      const maxWickets = batPlayers.length;

      // Pending selections
      if (isWicket && wickets < maxWickets - 1) pending.push('batsman');
      if (overDone && balls < prev.totalOvers * 6) pending.push('bowler');

      // Check innings end conditions
      const maxBalls = prev.totalOvers * 6;
      const inningsOver = wickets >= maxWickets || balls >= maxBalls ||
        (prev.innings === 2 && prev.firstInningsData && runs >= prev.firstInningsData.runs + 1);

      if (isWicket) {
        if (wickets === maxWickets - 1) {
          striker = nonStriker;     // remaining partner takes strike alone
          nonStriker = '';          // no non-striker
        } else {
          striker = '';             // cleared until new batsman selected
        }
      }

      return {
        ...prev, runs, wickets, balls, extras, striker, nonStriker, currentBowler,
        batsmanStats: bs, bowlerStats: bw, outBatsmen: out,
        pendingSelections: inningsOver ? [] : pending,
        history: [...prev.history, { snap }],
        ballLog: [...prev.ballLog, { label, type: ltype }],
        // Auto-transition if innings over
        screen: inningsOver ? (prev.innings === 1 ? 'inningsBreak' : 'matchResult') : prev.screen,
        firstInningsData: inningsOver && prev.innings === 1 ? {
          team: prev.battingTeamKey === 'A' ? prev.teamA : prev.teamB,
          runs, wickets, balls, batsmanStats: bs, bowlerStats: bw,
        } : prev.firstInningsData,
        matchResult: inningsOver && prev.innings === 2 ? getResult(prev, runs, wickets) : prev.matchResult,
      };
    });
    flash();
    if (soundOn) playSound(type === 'run' && runsToAdd === 4 ? 'four' : type === 'run' && runsToAdd === 6 ? 'six' : type === 'wicket' ? 'wicket' : runsToAdd > 0 ? 'run' : 'dot');
    if (type === 'run' && runsToAdd === 4) showPop('FOUR!', 'four');
    if (type === 'run' && runsToAdd === 6) showPop('SIX!', 'six');
    if (type === 'wicket') showPop('OUT!', 'wicket');
  }, [soundOn, flash, showPop]);

  function getResult(prev, runs2, wk2) {
    const f = prev.firstInningsData;
    if (!f) return 'No result';
    const chasingTeam = prev.battingTeamKey === 'A' ? prev.teamA : prev.teamB; 
    const defendingTeam = prev.battingTeamKey === 'A' ? prev.teamB : prev.teamA; 
    const maxWk = prev.battingTeamKey === 'A' ? prev.teamAPlayers.length : prev.teamBPlayers.length;
    
    if (runs2 > f.runs) {
      const wksLeft = maxWk - wk2;
      return `${chasingTeam} won by ${wksLeft} wicket${wksLeft !== 1 ? 's' : ''}`;
    }
    if (runs2 < f.runs) return `${defendingTeam} won by ${f.runs - runs2} run${f.runs - runs2 !== 1 ? 's' : ''}`;
    return 'Match Tied!';
  }

  // ---- Player Selection Handlers ----
  const selectPlayer = useCallback((player) => {
    setM(prev => {
      const [current, ...rest] = prev.pendingSelections;
      if (current === 'batsman') {
        // New batsman becomes striker; if over also ended, swap for new over
        let newStriker = player;
        let newNonStriker = prev.nonStriker;
        if (rest.includes('bowler') && newNonStriker !== '') {
          // Over also ended — swap for end of over
          [newStriker, newNonStriker] = [newNonStriker, newStriker];
        }
        return { ...prev, striker: newStriker, nonStriker: newNonStriker, pendingSelections: rest };
      }
      if (current === 'bowler') {
        return { ...prev, currentBowler: player, lastBowler: prev.currentBowler, pendingSelections: rest };
      }
      return prev;
    });
  }, []);

  // ---- Undo ----
  const undo = useCallback(() => {
    setM(prev => {
      if (prev.history.length === 0) return prev;
      const last = prev.history[prev.history.length - 1];
      const s = JSON.parse(last.snap);
      return {
        ...prev, ...s,
        history: prev.history.slice(0, -1),
        ballLog: prev.ballLog.slice(0, -1),
        pendingSelections: [],
      };
    });
    flash();
  }, [flash]);

  // ---- Innings Break → 2nd Innings ----
  const start2ndInnings = useCallback((cfg) => {
    setM(prev => {
      const newBatKey = prev.battingTeamKey === 'A' ? 'B' : 'A';
      const bPlayers = newBatKey === 'A' ? prev.teamAPlayers : prev.teamBPlayers;
      const blPlayers = newBatKey === 'A' ? prev.teamBPlayers : prev.teamAPlayers;
      const bs = {}; bPlayers.forEach(p => { bs[p] = newBatStats(); });
      const bw = {}; blPlayers.forEach(p => { bw[p] = newBowlStats(); });
      return {
        ...prev, screen: 'scoring', innings: 2, battingTeamKey: newBatKey,
        runs: 0, wickets: 0, balls: 0, extras: 0,
        striker: cfg.striker, nonStriker: cfg.nonStriker, currentBowler: cfg.bowler,
        lastBowler: '', batsmanStats: bs, bowlerStats: bw, outBatsmen: [],
        history: [], ballLog: [], pendingSelections: [],
      };
    });
  }, []);

  // ---- Match Result → Save History ----
  useEffect(() => {
    if (m.screen === 'matchResult' && m.matchResult && !m._saved) {
      const entry = {
        id: Date.now(), date: new Date().toLocaleDateString(),
        teamA: m.teamA, teamB: m.teamB,
        firstInnings: m.firstInningsData ? { runs: m.firstInningsData.runs, wickets: m.firstInningsData.wickets, balls: m.firstInningsData.balls } : null,
        secondInnings: { runs: m.runs, wickets: m.wickets, balls: m.balls },
        result: m.matchResult,
      };
      
      const saveToFirebase = async () => {
        if (user && user.uid && !user.guest) {
          try {
            await addDoc(collection(db, 'matches'), {
              ...entry,
              userId: user.uid,
              createdAt: new Date()
            });
          } catch (e) {
            console.error("Error adding document: ", e);
          }
        }
      };

      saveToFirebase();

      const nh = [entry, ...hist].slice(0, 20);
      setHist(nh); save(LS_HIST, nh);
      setM(p => ({ ...p, _saved: true }));
    }
  }, [m.screen, m.matchResult, m._saved, hist, user]);

  // ---- Reset ----
  const reset = useCallback(() => { setM({ ...DEFAULT }); save(LS_KEY, { ...DEFAULT }); setConfirm(null); }, []);
  const clearHist = useCallback(() => { setHist([]); save(LS_HIST, []); setConfirm(null); }, []);

  // ---- Determine modal to show ----
  const currentPending = m.pendingSelections[0] || null;
  let modalProps = null;
  if (currentPending === 'batsman') {
    const excluded = [...m.outBatsmen, m.nonStriker, m.striker].filter(Boolean);
    modalProps = { title: '🏏 Select Next Batsman', subtitle: 'Who comes in to bat?', players: battingPlayers, excludeNames: excluded };
  } else if (currentPending === 'bowler') {
    modalProps = { title: '⚾ Select Next Bowler', subtitle: `Cannot re-bowl ${m.currentBowler}`, players: bowlingPlayers, excludeNames: [m.currentBowler] };
  }

  return (
    <div className="min-h-screen pb-10 transition-colors duration-300">
      {popup && <ScorePopup text={popup.text} type={popup.type} />}
      {confirm && <ConfirmModal message={confirm.message} onConfirm={confirm.onConfirm} onCancel={() => setConfirm(null)} />}
      {modalProps && <PlayerSelectModal {...modalProps} onSelect={selectPlayer} />}

      <div className="max-w-2xl mx-auto px-4 pt-4 sm:px-6">
        <Header darkMode={darkMode} toggleDarkMode={() => setDarkMode(d => !d)} soundOn={soundOn} toggleSound={() => setSoundOn(s => !s)} />

        {!user ? (
          <Auth onLogin={setUser} />
        ) : (
          <>
            {/* ===== DASHBOARD ===== */}
            {m.screen === 'dashboard' && (
              <Dashboard
                onNewMatch={startNewMatch}
                onManageTeams={() => goTo('manageTeams')}
                matchCount={hist.length}
                user={user}
                onLogout={() => { setUser(null); reset(); }}
              />
            )}
        
        {m.screen === 'manageTeams' && (
          <ManageTeams 
            savedTeams={savedTeams}
            onSaveTeams={setSavedTeams}
            onBack={() => goTo('dashboard')}
          />
        )}

        {/* ===== TEAM SETUP ===== */}
        {m.screen === 'teamSetup' && (
          <>
            <button onClick={() => goTo('dashboard')} className="text-sm font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-primary)] mb-4 cursor-pointer">← Back</button>
            <TeamSetup
              onStartMatch={teamsReady}
              initialTeams={{ teamAName: m.teamA, teamAPlayers: m.teamAPlayers, teamBName: m.teamB, teamBPlayers: m.teamBPlayers }}
              savedTeams={savedTeams}
            />
          </>
        )}

        {/* ===== MATCH CONFIG ===== */}
        {m.screen === 'matchConfig' && (
          <MatchConfig teamA={m.teamA} teamB={m.teamB} teamAPlayers={m.teamAPlayers} teamBPlayers={m.teamBPlayers}
            onStart={configReady} onBack={() => goTo('teamSetup')} />
        )}

        {/* ===== SCORING ===== */}
        {m.screen === 'scoring' && (
          <>
            <ScoreBoard
              battingTeam={battingTeamName} runs={m.runs} wickets={m.wickets} balls={m.balls}
              oversDisplay={oversDisplay} runRate={runRate} extras={m.extras}
              innings={m.innings} scoreAnimating={scoreAnim}
              firstInningsScore={m.firstInningsData?.runs}
              target={target} runsNeeded={runsNeeded} requiredRR={requiredRR}
              striker={m.striker} nonStriker={m.nonStriker} currentBowler={m.currentBowler}
              batsmanStats={m.batsmanStats} bowlerStats={m.bowlerStats}
              totalOvers={m.totalOvers}
              maxWickets={battingPlayers.length}
              liveId={m.liveId}
            />
            <Controls
              onAddRuns={(r) => processBall('run', r)} onWicket={() => processBall('wicket')}
              onRotateStrike={(isValidBall) => {
                if (!isValidBall) {
                  setM(prev => prev.nonStriker !== '' ? { ...prev, striker: prev.nonStriker, nonStriker: prev.striker } : prev);
                } else {
                  setM(prev => {
                    if (prev.pendingSelections.length > 0) return prev;
                    if (prev.nonStriker === '') return prev;
                    const snap = JSON.stringify({
                      runs: prev.runs, wickets: prev.wickets, balls: prev.balls, extras: prev.extras,
                      striker: prev.striker, nonStriker: prev.nonStriker, currentBowler: prev.currentBowler,
                      lastBowler: prev.lastBowler, batsmanStats: prev.batsmanStats, bowlerStats: prev.bowlerStats,
                      outBatsmen: prev.outBatsmen,
                    });
                    
                    let balls = prev.balls + 1;
                    const bs = JSON.parse(JSON.stringify(prev.batsmanStats));
                    const bw = JSON.parse(JSON.stringify(prev.bowlerStats));
                    
                    if (bs[prev.striker]) bs[prev.striker].balls += 1;
                    if (bw[prev.currentBowler]) bw[prev.currentBowler].ballsBowled += 1;

                    let striker = prev.nonStriker;
                    let nonStriker = prev.striker;
                    
                    let pending = [];
                    const overDone = balls > 0 && balls % 6 === 0;
                    if (overDone) {
                       [striker, nonStriker] = [nonStriker, striker]; // end-of-over swap back
                       if (balls < prev.totalOvers * 6) pending.push('bowler');
                    }
                    
                    const maxBalls = prev.totalOvers * 6;
                    const inningsOver = balls >= maxBalls || (prev.innings === 2 && prev.firstInningsData && prev.runs >= prev.firstInningsData.runs + 1);
                    
                    return {
                      ...prev, balls, striker, nonStriker, batsmanStats: bs, bowlerStats: bw,
                      pendingSelections: inningsOver ? [] : pending,
                      history: [...prev.history, { snap }],
                      ballLog: [...prev.ballLog, { label: '⇄', type: 'dot' }],
                      screen: inningsOver ? (prev.innings === 1 ? 'inningsBreak' : 'matchResult') : prev.screen,
                      firstInningsData: inningsOver && prev.innings === 1 ? {
                        team: prev.battingTeamKey === 'A' ? prev.teamA : prev.teamB,
                        runs: prev.runs, wickets: prev.wickets, balls, batsmanStats: bs, bowlerStats: bw,
                      } : prev.firstInningsData,
                      matchResult: inningsOver && prev.innings === 2 ? getResult(prev, prev.runs, prev.wickets) : prev.matchResult,
                    };
                  });
                  flash();
                }
              }}
              onUndo={undo}
              onReset={() => setConfirm({ message: 'Reset match? You will return to dashboard.', onConfirm: reset })}
              onEndInnings={() => setConfirm({
                message: m.innings === 1 ? `End 1st innings? ${battingTeamName}: ${m.runs}/${m.wickets}` : 'End match? This will save the result.',
                onConfirm: () => {
                  setConfirm(null);
                  if (m.innings === 1) {
                    setM(p => ({
                      ...p, screen: 'inningsBreak',
                      firstInningsData: { team: battingTeamName, runs: p.runs, wickets: p.wickets, balls: p.balls, batsmanStats: p.batsmanStats, bowlerStats: p.bowlerStats },
                    }));
                  } else {
                    const res = getResult(m, m.runs, m.wickets);
                    setM(p => ({ ...p, screen: 'matchResult', matchResult: res }));
                  }
                },
              })}
              canUndo={m.history.length > 0 && m.pendingSelections.length === 0}
              allOut={m.wickets >= battingPlayers.length}
            />

            {/* Share Score Link */}
            {m.shareCode && (
              <ShareCard shareCode={m.shareCode} />
            )}

            <BallTimeline ballLog={m.ballLog} />
          </>
        )}

        {/* ===== INNINGS BREAK ===== */}
        {m.screen === 'inningsBreak' && m.firstInningsData && (
          <InningsBreak
            firstInningsData={m.firstInningsData}
            battingTeam={m.battingTeamKey === 'A' ? m.teamB : m.teamA}
            bowlingTeam={m.battingTeamKey === 'A' ? m.teamA : m.teamB}
            battingPlayers={m.battingTeamKey === 'A' ? m.teamBPlayers : m.teamAPlayers}
            bowlingPlayers={m.battingTeamKey === 'A' ? m.teamAPlayers : m.teamBPlayers}
            onStart={start2ndInnings}
          />
        )}

        {/* ===== MATCH RESULT ===== */}
        {m.screen === 'matchResult' && (
          <MatchResult match={m} onNewMatch={startNewMatch} onDashboard={() => goTo('dashboard')} />
        )}

        {m.screen !== 'dashboard' && (
          <footer className="text-center py-6 text-[var(--color-text-muted)] text-xs">
            StreetScore © {new Date().getFullYear()}
          </footer>
        )}
          </>
        )}
      </div>
    </div>
  );
}

function ShareCard({ shareCode }) {
  const [copied, setCopied] = useState(false);
  const liveUrl = `${window.location.origin}/?live=${shareCode}`;

  const copy = () => {
    navigator.clipboard.writeText(liveUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="my-3 p-4 glass-card rounded-2xl border border-[var(--color-primary)]/20 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-[var(--color-accent-red)] rounded-full animate-pulse" />
          <span className="text-xs font-black uppercase tracking-wider text-[var(--color-text-secondary)]">Share Live Score</span>
        </div>
        <span className="text-lg font-black text-[var(--color-primary)] tracking-widest">{shareCode}</span>
      </div>
      <div className="flex items-center gap-2">
        <input
          readOnly
          value={liveUrl}
          className="flex-1 text-[10px] font-semibold px-3 py-2 rounded-xl bg-[var(--color-surface-dim)] border border-[var(--color-border)] text-[var(--color-text-muted)] outline-none truncate"
        />
        <button
          onClick={copy}
          className="px-4 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-[var(--color-primary)] to-indigo-500 text-white shadow-md hover:shadow-lg active:scale-95 transition-all cursor-pointer whitespace-nowrap"
        >
          {copied ? '✓ Copied!' : '📋 Copy'}
        </button>
      </div>
      <p className="text-[10px] text-[var(--color-text-muted)] text-center">Friends can view live score — they cannot change anything.</p>
    </div>
  );
}
