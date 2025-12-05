import React from 'react';
import { Match, Team, ThemeConfig } from '../types';
import { Edit3, Save } from 'lucide-react';

interface MatchModalProps {
  match: Match;
  theme: ThemeConfig;
  isDarkMode: boolean;
  onClose: () => void;
  onUpdate: (matchId: string, teams: [Team, Team]) => void;
}

export const MatchModal: React.FC<MatchModalProps> = ({ match, theme, isDarkMode, onClose, onUpdate }) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newTeams: [Team, Team] = [
      { 
        name: formData.get('team1_name') as string, 
        score: formData.get('team1_score') as string,
        placeholder: match.teams[0].placeholder
      },
      { 
        name: formData.get('team2_name') as string, 
        score: formData.get('team2_score') as string,
        placeholder: match.teams[1].placeholder
      },
    ];
    onUpdate(match.id, newTeams);
  };

  // Editable only for first round matches to set initial names
  const isEditableNames = ['w1', 'w2', 'w3', 'w4'].includes(match.id);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className={`${theme.modalBg} border ${theme.headerBorder} w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200`}>
        <div className={`p-6 border-b ${theme.headerBorder} ${theme.headerBg} flex justify-between items-center`}>
          <div>
            <h3 className={`text-lg font-bold ${theme.textMain} flex items-center gap-2`}>
              <Edit3 size={18} className="text-purple-500" />
              录入数据
            </h3>
            <p className={`text-xs ${theme.textMuted} font-mono mt-1 uppercase`}>{match.name}</p>
          </div>
          <button
            onClick={onClose}
            className={`${theme.textMuted} hover:${theme.textMain} text-2xl leading-none px-2`}
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {match.teams.map((team, index) => (
            <div key={index} className="space-y-2">
              <label className={`text-xs font-medium ${theme.textMuted} uppercase tracking-wider`}>
                Team {index + 1}
              </label>
              <div className="flex gap-3">
                <input
                  name={`team${index + 1}_name`}
                  defaultValue={team.name === 'TBD' ? team.placeholder : team.name}
                  placeholder="选手姓名"
                  readOnly={!isEditableNames}
                  className={`flex-1 ${theme.inputBg} border ${theme.inputBorder} ${theme.textMain} rounded px-3 py-2 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all ${
                    !isEditableNames ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                />
                <input
                  name={`team${index + 1}_score`}
                  type="number"
                  min="0"
                  defaultValue={team.score}
                  placeholder="得分"
                  className={`w-24 ${theme.inputBg} border ${theme.inputBorder} ${theme.textMain} rounded px-3 py-2 font-mono text-center focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500`}
                  autoFocus={index === 0}
                />
              </div>
            </div>
          ))}

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 py-2.5 ${
                isDarkMode ? 'bg-zinc-800 text-zinc-300' : 'bg-slate-200 text-slate-700'
              } hover:opacity-80 rounded font-medium transition-colors`}
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded font-medium shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-colors flex items-center justify-center gap-2"
            >
              <Save size={18} /> 确认并更新
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};