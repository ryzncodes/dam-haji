import '@testing-library/jest-dom'
import { expect, afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'
import React from 'react'

// Make React available globally
global.React = React

// Extend Vitest's expect with Jest DOM matchers
expect.extend(matchers)

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock requestAnimationFrame
global.requestAnimationFrame = vi.fn().mockImplementation(callback => {
  return setTimeout(callback, 0)
})

// Mock cancelAnimationFrame
global.cancelAnimationFrame = vi.fn().mockImplementation(id => {
  clearTimeout(id)
})

// Cleanup after each test
afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})