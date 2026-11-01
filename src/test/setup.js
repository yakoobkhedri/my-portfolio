import * as matchers from '@testing-library/jest-dom/matchers'
import { expect } from 'vitest'

// نادیده گرفتن هشدارهای act
const originalError = console.error
console.error = (...args) => {
  if (args[0]?.includes?.('not wrapped in act')) return
  originalError(...args)
}

// extend کردن expect با matcherهای jest-dom
expect.extend(matchers)

// Mock matchMedia برای MUI
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => { },
    removeListener: () => { },
    addEventListener: () => { },
    removeEventListener: () => { },
    dispatchEvent: () => { },
  }),
})