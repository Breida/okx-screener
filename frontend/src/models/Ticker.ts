export interface Ticker {
  'exchange': string,
  'coin': string,
  'symbol': string,
  'price': number,
  'changePercent': number,
  'volume': number,
  'quoteVolume': number,
  'founding': number,
  'NART_1m': number,
  'NART_5m': number,
  points5min: string[],
  points1min: string[],
}
