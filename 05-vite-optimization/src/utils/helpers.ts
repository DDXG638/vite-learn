export function formatDate(): string {
  return new Date().toLocaleDateString()
}

export function debounce(fn: Function, delay = 300): Function {
  let timer: ReturnType<typeof setTimeout> | null = null
  return function (...args: any[]) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

export function throttle(fn: Function, delay = 300): Function {
  let timer: ReturnType<typeof setTimeout> | null = null
  return function (...args: any[]) {
    if (!timer) {
      fn(...args)
      timer = setTimeout(() => (timer = null), delay)
    }
  }
}