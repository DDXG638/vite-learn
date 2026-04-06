/**
 * 格式化价格，保留两位小数
 */
export function formatPrice(price: number): string {
  return `¥${price.toFixed(2)}`
}

/**
 * 格式化日期
 */
export function formatDate(date: Date | string | number): string {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
