import numeral from 'numeral'

export const getFormattedBigNumber = (val: number): string => {
  return numeral(val).format('$0.0a').toUpperCase()
}
