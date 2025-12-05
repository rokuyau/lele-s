import React from 'react';
import { Position } from '../types';

interface ConnectorProps {
  start: Position;
  end: Position;
  color: string;
}

export const Connector: React.FC<ConnectorProps> = ({ start, end, color }) => {
  // Hardcoded dimensions based on card size (w-48 = 192px)
  const CARD_WIDTH = 192;
  const CARD_HEIGHT_HALF = 45; // Approximate center of the card vertically

  const x1 = start.x + CARD_WIDTH;
  const y1 = start.y + CARD_HEIGHT_HALF;
  const x2 = end.x;
  const y2 = end.y + CARD_HEIGHT_HALF;

  const c1x = x1 + (x2 - x1) / 2;
  const c2x = x1 + (x2 - x1) / 2;

  return (
    <path
      d={`M ${x1} ${y1} C ${c1x} ${y1}, ${c2x} ${y2}, ${x2} ${y2}`}
      stroke={color}
      strokeWidth="2"
      fill="none"
      className="transition-colors duration-300"
    />
  );
};