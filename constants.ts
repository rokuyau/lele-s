import { Match, Position } from './types';

export const INITIAL_MATCHES: Match[] = [
  // --- Winners Bracket Round 1 (R1) ---
  { id: 'w1', name: 'R1-A', nextWin: 'w5', nextLose: 'l1', teams: [{ name: '组合 A', score: '' }, { name: '组合 B', score: '' }] },
  { id: 'w2', name: 'R1-B', nextWin: 'w5', nextLose: 'l1', teams: [{ name: '组合 C', score: '' }, { name: '组合 D', score: '' }] },
  { id: 'w3', name: 'R1-C', nextWin: 'w6', nextLose: 'l2', teams: [{ name: '组合 E', score: '' }, { name: '组合 F', score: '' }] },
  { id: 'w4', name: 'R1-D', nextWin: 'w6', nextLose: 'l2', teams: [{ name: '组合 G', score: '' }, { name: '组合 H', score: '' }] },

  // --- Losers Bracket Round 1 (L1) ---
  { id: 'l1', name: 'L-R1-A', nextWin: 'l3', nextLose: null, teams: [{ name: 'TBD', score: '', placeholder: 'W1败者' }, { name: 'TBD', score: '', placeholder: 'W2败者' }] },
  { id: 'l2', name: 'L-R1-B', nextWin: 'l4', nextLose: null, teams: [{ name: 'TBD', score: '', placeholder: 'W3败者' }, { name: 'TBD', score: '', placeholder: 'W4败者' }] },

  // --- Winners Bracket Semi-Finals (W-Semi) ---
  { id: 'w5', name: 'W-Semi-A', nextWin: 'w7', nextLose: 'l4', teams: [{ name: 'TBD', score: '', placeholder: 'W1胜者' }, { name: 'TBD', score: '', placeholder: 'W2胜者' }] },
  { id: 'w6', name: 'W-Semi-B', nextWin: 'w7', nextLose: 'l3', teams: [{ name: 'TBD', score: '', placeholder: 'W3胜者' }, { name: 'TBD', score: '', placeholder: 'W4胜者' }] },

  // --- Losers Bracket Round 2 (L2) ---
  { id: 'l3', name: 'L-R2-A', nextWin: 'l5', nextLose: null, teams: [{ name: 'TBD', score: '', placeholder: 'L1胜者' }, { name: 'TBD', score: '', placeholder: 'W6败者' }] },
  { id: 'l4', name: 'L-R2-B', nextWin: 'l5', nextLose: null, teams: [{ name: 'TBD', score: '', placeholder: 'L2胜者' }, { name: 'TBD', score: '', placeholder: 'W5败者' }] },

  // --- Losers Bracket Semi-Final (L-Semi) ---
  { id: 'l5', name: 'L-Semi', nextWin: 'l6', nextLose: null, teams: [{ name: 'TBD', score: '', placeholder: 'L3胜者' }, { name: 'TBD', score: '', placeholder: 'L4胜者' }] },

  // --- Winners Bracket Final (W-Final) ---
  { id: 'w7', name: 'W-Final', nextWin: 'gf', nextLose: 'l6', teams: [{ name: 'TBD', score: '', placeholder: 'W5胜者' }, { name: 'TBD', score: '', placeholder: 'W6胜者' }] },

  // --- Losers Bracket Final (L-Final) ---
  { id: 'l6', name: 'L-Final', nextWin: 'gf', nextLose: null, teams: [{ name: 'TBD', score: '', placeholder: 'L5胜者' }, { name: 'TBD', score: '', placeholder: 'W7败者' }] },

  // --- Grand Final (GF) ---
  { id: 'gf', name: 'Grand Final', nextWin: null, nextLose: null, teams: [{ name: 'TBD', score: '', placeholder: '胜者组冠军' }, { name: 'TBD', score: '', placeholder: '败者组冠军' }] },
];

export const MATCH_POSITIONS: Record<string, Position> = {
  w1: { x: 50, y: 50 },
  w2: { x: 50, y: 180 },
  w3: { x: 50, y: 350 },
  w4: { x: 50, y: 480 },
  w5: { x: 300, y: 115 },
  w6: { x: 300, y: 415 },
  l1: { x: 300, y: 600 },
  l2: { x: 300, y: 730 },
  w7: { x: 550, y: 265 },
  l3: { x: 550, y: 550 },
  l4: { x: 550, y: 680 },
  l5: { x: 800, y: 615 },
  l6: { x: 1050, y: 450 },
  gf: { x: 1300, y: 350 },
};