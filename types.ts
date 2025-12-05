export interface Team {
  name: string;
  score: string;
  placeholder?: string;
}

export interface Match {
  id: string;
  name: string;
  nextWin: string | null;
  nextLose: string | null;
  teams: [Team, Team];
}

export interface Position {
  x: number;
  y: number;
}

export interface ThemeConfig {
  appBg: string;
  textMain: string;
  textMuted: string;
  textMutedLight: string;
  headerBg: string;
  headerBorder: string;
  cardBg: string;
  cardBorder: string;
  cardBorderActive: string;
  cardShadowActive: string;
  cardHeaderBg: string;
  cardHover: string;
  connectorColor: string;
  btnHover: string;
  btnText: string;
  modalBg: string;
  inputBg: string;
  inputBorder: string;
  tipsBg: string;
  tipsBorder: string;
}