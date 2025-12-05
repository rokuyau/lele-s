import React from 'react';
import { Match, ThemeConfig } from '../types';

interface MatchCardProps {
  match: Match;
  style: React.CSSProperties;
  theme: ThemeConfig;
  onClick: (match: Match) => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match, style, theme, onClick }) => {
  const isCompleted = match.teams[0].score !== '' && match.teams[1].score !== '';
  const score1 = parseInt(match.teams[0].score || '-1', 10);
  const score2 = parseInt(match.teams[1].score || '-1', 10);
  const winnerIdx = isCompleted ? (score1 > score2 ? 0 : 1) : -1;

  return (
    <div
      className={`absolute w-48 ${theme.cardBg} border ${
        isCompleted ? `${theme.cardBorderActive} ${theme.cardShadowActive}` : theme.cardBorder
      } rounded-lg p-0 overflow-hidden select-none transition-all duration-300 hover:scale-105 cursor-pointer group shadow-sm`}
      style={style}
      onClick={(e) => {
        e.stopPropagation();
        onClick(match);
      }}
    >
      <div
        className={`${theme.cardHeaderBg} px-2 py-1 text-[10px] ${theme.textMuted} flex justify-between border-b ${theme.cardBorder} transition-colors duration-300`}
      >
        <span className="font-mono tracking-widest uppercase">{match.id}</span>
        {isCompleted && <span className="text-purple-500 font-bold">已结束</span>}
      </div>

      {match.teams.map((team, idx) => (
        <div
          key={idx}
          className={`flex justify-between items-center px-3 py-2 transition-colors duration-300 ${
            idx === 0 ? `border-b ${theme.cardBorder}` : ''
          } ${isCompleted && idx === winnerIdx ? 'bg-purple-500/10' : ''}`}
        >
          <div className="flex flex-col truncate pr-2">
            <span
              className={`text-xs font-medium truncate transition-colors duration-300 ${
                team.name === 'TBD'
                  ? `${theme.textMuted} italic`
                  : isCompleted && idx === winnerIdx
                  ? 'text-purple-600 dark:text-purple-300 font-bold'
                  : theme.textMain
              }`}
            >
              {team.name === 'TBD' ? team.placeholder : team.name}
            </span>
          </div>
          <span
            className={`font-mono text-sm font-bold w-6 text-right transition-colors duration-300 ${
              isCompleted && idx === winnerIdx
                ? 'text-purple-600 dark:text-purple-400'
                : theme.textMuted
            }`}
          >
            {team.score}
          </span>
        </div>
      ))}

      <div
        className={`absolute inset-0 bg-transparent ${theme.cardHover} transition-colors pointer-events-none`}
      ></div>
    </div>
  );
};