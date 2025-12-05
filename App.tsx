import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Trophy,
  RotateCcw,
  Share2,
  ZoomIn,
  ZoomOut,
  Sun,
  Moon,
  ChevronDown,
  ChevronUp,
  Info,
} from 'lucide-react';
import { Match, Team, ThemeConfig } from './types';
import { INITIAL_MATCHES, MATCH_POSITIONS } from './constants';
import { MatchCard } from './components/MatchCard';
import { Connector } from './components/Connector';
import { MatchModal } from './components/MatchModal';

export default function App() {
  // --- State ---
  const [matches, setMatches] = useState<Match[]>(INITIAL_MATCHES);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [scale, setScale] = useState(0.85); // Start with a slightly zoomed out view
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isTipsExpanded, setIsTipsExpanded] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);

  // --- Effects ---
  useEffect(() => {
    const savedData = localStorage.getItem('tennis_bracket_data_v1');
    if (savedData) {
      try {
        setMatches(JSON.parse(savedData));
      } catch (e) {
        console.error("Failed to load saved data", e);
      }
    }
    
    // Initial centering logic could go here
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    // Simple center approximation
    setPosition({ x: (windowWidth - 1400 * 0.85) / 2, y: (windowHeight - 900 * 0.85) / 2 });

  }, []);

  useEffect(() => {
    localStorage.setItem('tennis_bracket_data_v1', JSON.stringify(matches));
  }, [matches]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // --- Theme ---
  const theme: ThemeConfig = {
    appBg: isDarkMode ? 'bg-zinc-950' : 'bg-slate-100',
    textMain: isDarkMode ? 'text-white' : 'text-slate-900',
    textMuted: isDarkMode ? 'text-zinc-500' : 'text-slate-500',
    textMutedLight: isDarkMode ? 'text-zinc-400' : 'text-slate-600',

    headerBg: isDarkMode ? 'bg-zinc-950/80' : 'bg-white/80',
    headerBorder: isDarkMode ? 'border-zinc-800' : 'border-slate-200',

    cardBg: isDarkMode ? 'bg-zinc-900' : 'bg-white',
    cardBorder: isDarkMode ? 'border-zinc-800' : 'border-slate-300',
    cardBorderActive: 'border-purple-500',
    cardShadowActive: 'shadow-[0_0_15px_rgba(168,85,247,0.3)]',
    cardHeaderBg: isDarkMode ? 'bg-zinc-950' : 'bg-slate-50',
    cardHover: isDarkMode ? 'group-hover:bg-purple-500/5' : 'group-hover:bg-purple-500/5',

    connectorColor: isDarkMode ? '#3f3f46' : '#cbd5e1', // zinc-700 vs slate-300

    btnHover: isDarkMode ? 'hover:bg-zinc-800' : 'hover:bg-slate-200',
    btnText: isDarkMode ? 'text-zinc-400' : 'text-slate-600',

    modalBg: isDarkMode ? 'bg-zinc-900' : 'bg-white',
    inputBg: isDarkMode ? 'bg-zinc-950' : 'bg-slate-50',
    inputBorder: isDarkMode ? 'border-zinc-800' : 'border-slate-300',

    tipsBg: isDarkMode ? 'bg-zinc-900/90' : 'bg-white/90',
    tipsBorder: isDarkMode ? 'border-zinc-800' : 'border-slate-200',
  };

  // --- Core Logic ---
  const handleUpdateMatch = useCallback((matchId: string, newTeams: [Team, Team]) => {
    // 1. Update the current match
    let updatedMatches = matches.map((m) => {
      if (m.id === matchId) {
        return { ...m, teams: newTeams };
      }
      return m;
    });

    const currentMatch = updatedMatches.find((m) => m.id === matchId);
    if (!currentMatch) return;

    const score1 = parseInt(currentMatch.teams[0].score || '-1');
    const score2 = parseInt(currentMatch.teams[1].score || '-1');

    // 2. Progression Logic
    if (!isNaN(score1) && !isNaN(score2) && score1 !== score2) {
      const winnerIndex = score1 > score2 ? 0 : 1;
      const loserIndex = score1 > score2 ? 1 : 0;

      const winnerName = currentMatch.teams[winnerIndex].name;
      const loserName = currentMatch.teams[loserIndex].name;

      // Advance Winner
      if (currentMatch.nextWin) {
        const nextWinMatchIndex = updatedMatches.findIndex((m) => m.id === currentMatch.nextWin);
        if (nextWinMatchIndex !== -1) {
          const nextMatch = updatedMatches[nextWinMatchIndex];
          let targetSlot = 0;

          // Mapping logic for winner slots
          if (['w1', 'w3', 'w5', 'w7', 'l1', 'l2', 'l3', 'l5'].includes(matchId)) targetSlot = 0;
          if (['w2', 'w4', 'w6', 'l4', 'l6'].includes(matchId)) targetSlot = 1;

          const newNextTeams = [...nextMatch.teams] as [Team, Team];
          newNextTeams[targetSlot] = { ...newNextTeams[targetSlot], name: winnerName };
          
          const newNextMatch = { ...nextMatch, teams: newNextTeams };
          updatedMatches[nextWinMatchIndex] = newNextMatch;
        }
      }

      // Advance Loser (Drop to Losers Bracket)
      if (currentMatch.nextLose) {
        const nextLoseMatchIndex = updatedMatches.findIndex((m) => m.id === currentMatch.nextLose);
        if (nextLoseMatchIndex !== -1) {
          const nextMatch = updatedMatches[nextLoseMatchIndex];
          let targetSlot = 0;

          // Mapping logic for loser slots
          if (['w1', 'w3'].includes(matchId)) targetSlot = 0;
          if (['w2', 'w4', 'w5', 'w6', 'w7'].includes(matchId)) targetSlot = 1;
          
          const newNextTeams = [...nextMatch.teams] as [Team, Team];
          newNextTeams[targetSlot] = { ...newNextTeams[targetSlot], name: loserName };
          
          const newNextMatch = { ...nextMatch, teams: newNextTeams };
          updatedMatches[nextLoseMatchIndex] = newNextMatch;
        }
      }
    }

    setMatches(updatedMatches);
    setSelectedMatch(null);
  }, [matches]);

  const resetBracket = () => {
    if (window.confirm('确定要重置所有数据吗？这将无法撤销。')) {
      setMatches(INITIAL_MATCHES);
      localStorage.removeItem('tennis_bracket_data_v1');
    }
  };

  // --- Interaction Handlers ---
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      setScale((s) => Math.min(Math.max(s * delta, 0.4), 3));
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).id === 'canvas-bg') {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  // --- Render ---
  return (
    <div className={`w-full h-screen ${theme.appBg} ${theme.textMain} flex flex-col overflow-hidden font-sans selection:bg-purple-500 selection:text-white transition-colors duration-300`}>
      {/* Top Header */}
      <header className={`h-16 border-b ${theme.headerBorder} flex items-center justify-between px-6 ${theme.headerBg} backdrop-blur-md z-20 relative transition-colors duration-300`}>
        <div className="flex items-center gap-3">
          <div className="bg-purple-600 p-2 rounded-lg shadow-[0_0_15px_rgba(168,85,247,0.5)]">
            <Trophy size={20} className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight leading-none">
              TENNIS DUO <span className="text-purple-500">PRO</span>
            </h1>
            <p className={`text-[10px] ${theme.textMuted} tracking-wider`}>
              DOUBLE ELIMINATION BRACKET
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded ${theme.btnHover} ${theme.textMain} transition-colors mr-2`}
            title={isDarkMode ? '切换到浅色模式' : '切换到深色模式'}
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <div className={`w-px h-4 ${isDarkMode ? 'bg-zinc-800' : 'bg-slate-300'} mx-1`}></div>

          <button onClick={() => setScale((s) => s - 0.1)} className={`p-2 rounded ${theme.btnHover} ${theme.btnText}`}>
            <ZoomOut size={18} />
          </button>
          <span className={`text-xs font-mono min-w-[3ch] text-center ${theme.textMuted}`}>
            {Math.round(scale * 100)}%
          </span>
          <button onClick={() => setScale((s) => s + 0.1)} className={`p-2 rounded ${theme.btnHover} ${theme.btnText}`}>
            <ZoomIn size={18} />
          </button>

          <div className={`w-px h-4 ${isDarkMode ? 'bg-zinc-800' : 'bg-slate-300'} mx-2`}></div>

          <button
            onClick={resetBracket}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-500/10 rounded border border-transparent hover:border-red-500/50 transition-all"
          >
            <RotateCcw size={14} /> 重置
          </button>
          <button
            onClick={() => alert('请使用截图工具保存图片。即将支持导出功能！')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium ${
              isDarkMode ? 'bg-zinc-100 text-zinc-900 hover:bg-white' : 'bg-slate-800 text-white hover:bg-slate-700'
            } rounded shadow-lg transition-all`}
          >
            <Share2 size={14} /> 导出
          </button>
        </div>
      </header>

      {/* Main Canvas Area */}
      <div
        className={`flex-1 relative overflow-hidden cursor-grab active:cursor-grabbing ${theme.appBg}`}
        id="canvas-bg"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        ref={containerRef}
      >
        {/* Background Grid Pattern */}
        <div
          className="absolute inset-0 opacity-5 pointer-events-none transition-colors duration-300"
          style={{
            backgroundSize: `${40 * scale}px ${40 * scale}px`,
            backgroundImage: isDarkMode
              ? 'linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px)'
              : 'linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)',
            transform: `translate(${position.x}px, ${position.y}px)`,
          }}
        />

        {/* Scalable Container */}
        <div
          className="absolute origin-top-left transition-transform duration-75 ease-linear will-change-transform"
          style={{ transform: `translate(${position.x}px, ${position.y}px) scale(${scale})` }}
        >
          {/* SVG Connector Layer */}
          <svg className="absolute top-0 left-0 w-[2000px] h-[1000px] pointer-events-none overflow-visible">
            {/* Winners Bracket Lines */}
            <Connector start={MATCH_POSITIONS.w1} end={MATCH_POSITIONS.w5} color={theme.connectorColor} />
            <Connector start={MATCH_POSITIONS.w2} end={MATCH_POSITIONS.w5} color={theme.connectorColor} />
            <Connector start={MATCH_POSITIONS.w3} end={MATCH_POSITIONS.w6} color={theme.connectorColor} />
            <Connector start={MATCH_POSITIONS.w4} end={MATCH_POSITIONS.w6} color={theme.connectorColor} />
            <Connector start={MATCH_POSITIONS.w5} end={MATCH_POSITIONS.w7} color={theme.connectorColor} />
            <Connector start={MATCH_POSITIONS.w6} end={MATCH_POSITIONS.w7} color={theme.connectorColor} />
            
            {/* Losers Bracket Lines */}
            <Connector start={MATCH_POSITIONS.l1} end={MATCH_POSITIONS.l3} color={theme.connectorColor} />
            <Connector start={MATCH_POSITIONS.l2} end={MATCH_POSITIONS.l4} color={theme.connectorColor} />
            <Connector start={MATCH_POSITIONS.l3} end={MATCH_POSITIONS.l5} color={theme.connectorColor} />
            <Connector start={MATCH_POSITIONS.l4} end={MATCH_POSITIONS.l5} color={theme.connectorColor} />
            <Connector start={MATCH_POSITIONS.l5} end={MATCH_POSITIONS.l6} color={theme.connectorColor} />
            
            {/* Drop Downs from Winners to Losers */}
            {/* Note: In a real dynamic SVG, these would be complex paths. Here we use logical connections implicit in positioning or manual paths if needed, but for simplicity we focus on the tree structure flow. */}
            
            {/* Finals */}
            <Connector start={MATCH_POSITIONS.w7} end={MATCH_POSITIONS.gf} color={theme.connectorColor} />
            <Connector start={MATCH_POSITIONS.l6} end={MATCH_POSITIONS.gf} color={theme.connectorColor} />
          </svg>

          {/* Labels */}
          <div
            className={`absolute ${isDarkMode ? 'text-zinc-700' : 'text-slate-300'} font-black text-4xl opacity-20 pointer-events-none tracking-widest`}
            style={{ top: 20, left: 50 }}
          >
            WINNERS BRACKET
          </div>
          <div
            className={`absolute ${isDarkMode ? 'text-zinc-700' : 'text-slate-300'} font-black text-4xl opacity-20 pointer-events-none tracking-widest`}
            style={{ top: 570, left: 50 }}
          >
            LOSERS BRACKET
          </div>
          <div
            className="absolute text-purple-700 font-black text-4xl opacity-15 pointer-events-none tracking-widest"
            style={{ top: 300, left: 1300 }}
          >
            FINALS
          </div>

          {/* Match Nodes */}
          {matches.map((m) => {
            const pos = MATCH_POSITIONS[m.id];
            if (!pos) return null;
            return (
              <MatchCard
                key={m.id}
                match={m}
                theme={theme}
                style={{ left: pos.x, top: pos.y }}
                onClick={setSelectedMatch}
              />
            );
          })}
        </div>

        {/* Info/Help Panel */}
        <div
          className={`absolute bottom-6 left-6 ${theme.tipsBg} backdrop-blur border ${theme.tipsBorder} rounded-lg shadow-2xl transition-all duration-300 overflow-hidden z-10 w-80`}
        >
          <div
            className={`flex items-center justify-between p-3 cursor-pointer ${theme.headerBg} border-b ${
              isTipsExpanded ? theme.tipsBorder : 'border-transparent'
            }`}
            onClick={() => setIsTipsExpanded(!isTipsExpanded)}
          >
            <div className="flex items-center gap-2 text-purple-500 font-bold text-sm">
              <Info size={16} />
              <span>操作提示</span>
            </div>
            <button className={`${theme.textMuted} hover:${theme.textMain}`}>
              {isTipsExpanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
            </button>
          </div>

          <div
            className={`transition-all duration-300 ease-in-out ${
              isTipsExpanded ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className={`p-4 pt-2 text-xs ${theme.textMutedLight} leading-relaxed`}>
              <ul className="space-y-1.5 list-disc list-inside">
                <li>点击卡片录入比分 (第一轮支持修改名字)。</li>
                <li>拖拽空白处移动视图，滚轮缩放。</li>
                <li>比分录入后，系统自动晋级胜者/败者。</li>
                <li>点击右上角重置可清空所有进度。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {selectedMatch && (
        <MatchModal
          match={selectedMatch}
          theme={theme}
          isDarkMode={isDarkMode}
          onClose={() => setSelectedMatch(null)}
          onUpdate={handleUpdateMatch}
        />
      )}
    </div>
  );
}