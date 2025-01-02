interface Analysis {
  isValid: boolean;
  impact: 'positive' | 'negative';
  importance: number;
  summary: string;
}

export interface NewsInfo {
  id: string;
  text: string;
  originalPostUrl: string;
  analysis: Analysis;
  date: number;
}
