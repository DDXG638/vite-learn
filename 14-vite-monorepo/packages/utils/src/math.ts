/**
 * 加法运算
 */
export function add(a: number, b: number): number {
  return a + b
}

/**
 * 乘法运算
 */
export function multiply(a: number, b: number): number {
  return a * b
}

/**
 * 限制数值在指定范围内
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/**
 * 生成指定范围内的随机整数
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * 减法运算 (新增)
 */
export function subtract(a: number, b: number): number {
  return a - b
}
