/**
 * 格式化日期
 * @param date Date 对象或日期字符串
 * @param format 格式化模板，默认为 'YYYY-MM-DD'
 */
export function formatDate(date: Date | string, format: string = 'YYYY-MM-DD'): string {
  const d = typeof date === 'string' ? new Date(date) : date

  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')

  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

/**
 * 格式化货币
 * @param amount 金额
 * @param currency 货币符号，默认为 '$'
 * @param decimals 小数位数，默认为 2
 */
export function formatCurrency(
  amount: number,
  currency: string = '$',
  decimals: number = 2
): string {
  return `${currency}${amount.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
}
