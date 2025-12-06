import { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { vi } from 'vitest'

// Custom render function that includes any providers
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, options)

// Mock data for testing
export const mockArchaeologicalSite = {
  id: 'test-site-1',
  name: 'Test Archaeological Site',
  type: 'Settlement',
  period: 'Roman',
  coordinates: [51.5074, -0.1278] as [number, number],
  description: 'A test archaeological site for unit testing',
  discoveredDate: '2024-01-01',
  significance: 'High',
  notes: 'This is a test site used for automated testing'
}

export const mockDiscovery = {
  id: 'test-discovery-1',
  siteId: 'test-site-1',
  artifactType: 'Pottery',
  coordinates: [51.5075, -0.1279] as [number, number],
  description: 'Test pottery fragment',
  discoveredDate: '2024-01-15',
  condition: 'Good',
  notes: 'Test discovery for unit testing'
}

export const mockCollection = {
  sites: [mockArchaeologicalSite],
  discoveries: [mockDiscovery],
  exportDate: '2024-01-20'
}

// Helper function to create mock localStorage
export const createMockLocalStorage = () => {
  const store = new Map<string, string>()
  
  return {
    getItem: vi.fn((key: string) => store.get(key) || null),
    setItem: vi.fn((key: string, value: string) => {
      store.set(key, value)
    }),
    removeItem: vi.fn((key: string) => {
      store.delete(key)
    }),
    clear: vi.fn(() => {
      store.clear()
    }),
    length: store.size,
    key: vi.fn((index: number) => Array.from(store.keys())[index] || null)
  }
}

// Helper to mock file reading
export const createMockFile = (content: string, filename: string, type = 'application/json') => {
  const blob = new Blob([content], { type })
  const file = new File([blob], filename, { type })
  return file
}

// Re-export everything from testing library
export * from '@testing-library/react'
export { customRender as render }
export { vi } from 'vitest'