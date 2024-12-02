export interface Liquidation {
  symbol: string,
  time: number,
  price: string,
  size: number,
  side: 'LONG' | 'SHORT',
  exchange: string,
}
