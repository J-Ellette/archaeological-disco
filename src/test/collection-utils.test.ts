import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  exportCollection,
  downloadCollectionAsJSON,
  importCollectionFromFile,
  validateCollection,
  mergeCollections
} from '../lib/collection-utils'
import { MapCollection, CustomMapSource, UploadedMap } from '../lib/types'
import { createMockFile } from './utils'

// Mock DOM methods
const mockCreateElement = vi.fn()
const mockAppendChild = vi.fn()
const mockRemoveChild = vi.fn()
const mockClick = vi.fn()
const mockCreateObjectURL = vi.fn()
const mockRevokeObjectURL = vi.fn()

beforeEach(() => {
  vi.clearAllMocks()
  
  // Mock DOM methods
  document.createElement = mockCreateElement.mockReturnValue({
    href: '',
    download: '',
    click: mockClick
  })
  document.body.appendChild = mockAppendChild
  document.body.removeChild = mockRemoveChild
  
  // Mock URL methods
  URL.createObjectURL = mockCreateObjectURL.mockReturnValue('mock-blob-url')
  URL.revokeObjectURL = mockRevokeObjectURL
})

const mockCustomSource: CustomMapSource = {
  id: 'source-1',
  name: 'Test Source',
  type: 'tile',
  url: 'https://example.com/{z}/{x}/{y}.png',
  attribution: 'Test Attribution',
  maxZoom: 18,
  createdAt: Date.now()
}

const mockUploadedMap: UploadedMap = {
  id: 'map-1',
  name: 'Test Map',
  fileName: 'test-map.png',
  dataUrl: 'data:image/png;base64,test',
  bounds: {
    north: 51.51,
    south: 51.50,
    east: -0.12,
    west: -0.13
  },
  createdAt: Date.now()
}

describe('collection-utils', () => {
  describe('exportCollection', () => {
    it('should create a collection with all required fields', () => {
      const name = 'Test Collection'
      const description = 'A test collection'
      const customSources = [mockCustomSource]
      const uploadedMaps = [mockUploadedMap]
      
      const collection = exportCollection(name, customSources, uploadedMaps, description)
      
      expect(collection).toHaveProperty('id')
      expect(collection.name).toBe(name)
      expect(collection.description).toBe(description)
      expect(collection.customSources).toEqual(customSources)
      expect(collection.uploadedMaps).toEqual(uploadedMaps)
      expect(collection.version).toBe('1.0.0')
      expect(collection.createdAt).toBeTypeOf('number')
      expect(collection.exportedAt).toBeTypeOf('number')
      expect(collection.createdAt).toBe(collection.exportedAt)
    })

    it('should handle collections without description', () => {
      const collection = exportCollection('Test', [], [])
      
      expect(collection.description).toBeUndefined()
      expect(collection.name).toBe('Test')
    })

    it('should generate unique IDs', () => {
      // Mock Date.now to return different values for each call
      let counter = 0
      vi.spyOn(Date, 'now').mockImplementation(() => {
        return 1000000 + counter++
      })
      
      const collection1 = exportCollection('Test 1', [], [])
      const collection2 = exportCollection('Test 2', [], [])
      
      expect(collection1.id).not.toBe(collection2.id)
      
      vi.restoreAllMocks()
    })
  })

  describe('downloadCollectionAsJSON', () => {
    it('should create and trigger a download', () => {
      const collection = exportCollection('Test Collection', [mockCustomSource], [mockUploadedMap])
      
      downloadCollectionAsJSON(collection)
      
      // Verify blob creation
      expect(mockCreateObjectURL).toHaveBeenCalledWith(expect.any(Blob))
      
      // Verify link creation and setup
      expect(mockCreateElement).toHaveBeenCalledWith('a')
      expect(mockAppendChild).toHaveBeenCalled()
      expect(mockClick).toHaveBeenCalled()
      expect(mockRemoveChild).toHaveBeenCalled()
      expect(mockRevokeObjectURL).toHaveBeenCalled()
    })

    it('should sanitize filename', () => {
      const collection = exportCollection('Test Collection With Special Characters!@#', [], [])
      
      downloadCollectionAsJSON(collection)
      
      // The filename should be sanitized
      const linkElement = mockCreateElement.mock.results[0].value
      expect(linkElement.download).toBe('test-collection-with-special-characters-collection.json')
    })
  })

  describe('importCollectionFromFile', () => {
    it('should import a valid collection file', async () => {
      const collection = exportCollection('Test', [mockCustomSource], [mockUploadedMap])
      const json = JSON.stringify(collection)
      const file = createMockFile(json, 'test-collection.json')
      
      const imported = await importCollectionFromFile(file)
      
      expect(imported).toEqual(collection)
    })

    it('should reject invalid JSON', async () => {
      const file = createMockFile('invalid json', 'test.json')
      
      await expect(importCollectionFromFile(file)).rejects.toThrow('Failed to parse collection file')
    })

    it('should reject invalid collection format', async () => {
      const invalidCollection = { invalid: 'data' }
      const json = JSON.stringify(invalidCollection)
      const file = createMockFile(json, 'test.json')
      
      await expect(importCollectionFromFile(file)).rejects.toThrow('Invalid collection format')
    })
  })

  describe('validateCollection', () => {
    const validCollection: MapCollection = {
      id: 'test-id',
      name: 'Test Collection',
      customSources: [],
      uploadedMaps: [],
      createdAt: Date.now(),
      exportedAt: Date.now(),
      version: '1.0.0'
    }

    it('should validate correct collection', () => {
      expect(validateCollection(validCollection)).toBe(true)
    })

    it('should reject collection missing required fields', () => {
      expect(validateCollection({})).toBe(false)
      expect(validateCollection({ ...validCollection, id: undefined })).toBe(false)
      expect(validateCollection({ ...validCollection, name: undefined })).toBe(false)
      expect(validateCollection({ ...validCollection, customSources: undefined })).toBe(false)
      expect(validateCollection({ ...validCollection, uploadedMaps: undefined })).toBe(false)
    })

    it('should reject collection with wrong field types', () => {
      expect(validateCollection({ ...validCollection, id: 123 })).toBe(false)
      expect(validateCollection({ ...validCollection, name: 123 })).toBe(false)
      expect(validateCollection({ ...validCollection, customSources: 'not-array' })).toBe(false)
      expect(validateCollection({ ...validCollection, uploadedMaps: 'not-array' })).toBe(false)
      expect(validateCollection({ ...validCollection, createdAt: 'not-number' })).toBe(false)
    })

    it('should handle null and undefined input', () => {
      expect(validateCollection(null)).toBe(false)
      expect(validateCollection(undefined)).toBe(false)
    })
  })

  describe('mergeCollections', () => {
    const existingSource: CustomMapSource = {
      id: 'existing-source',
      name: 'Existing Source',
      type: 'tile',
      url: 'https://existing.com/{z}/{x}/{y}.png',
      attribution: 'Existing',
      maxZoom: 18,
      createdAt: Date.now()
    }

    const existingMap: UploadedMap = {
      id: 'existing-map',
      name: 'Existing Map',
      fileName: 'existing.png',
      dataUrl: 'data:image/png;base64,existing',
      bounds: {
        north: 52.0,
        south: 51.0,
        east: 0.0,
        west: -1.0
      },
      createdAt: Date.now()
    }

    const importedCollection: MapCollection = {
      id: 'imported-collection',
      name: 'Imported Collection',
      customSources: [mockCustomSource],
      uploadedMaps: [mockUploadedMap],
      createdAt: Date.now(),
      exportedAt: Date.now(),
      version: '1.0.0'
    }

    it('should merge collections without conflicts', () => {
      const result = mergeCollections(
        [existingSource],
        [existingMap],
        importedCollection
      )
      
      expect(result.sources).toHaveLength(2)
      expect(result.maps).toHaveLength(2)
      expect(result.stats.sourcesAdded).toBe(1)
      expect(result.stats.mapsAdded).toBe(1)
      expect(result.stats.sourcesSkipped).toBe(0)
      expect(result.stats.mapsSkipped).toBe(0)
    })

    it('should skip duplicates when skipDuplicates is true', () => {
      const duplicateCollection: MapCollection = {
        ...importedCollection,
        customSources: [{
          ...mockCustomSource,
          url: existingSource.url // Same URL = duplicate
        }],
        uploadedMaps: [{
          ...mockUploadedMap,
          fileName: existingMap.fileName // Same filename = duplicate
        }]
      }
      
      const result = mergeCollections(
        [existingSource],
        [existingMap],
        duplicateCollection,
        { skipDuplicates: true }
      )
      
      expect(result.sources).toHaveLength(1)
      expect(result.maps).toHaveLength(1)
      expect(result.stats.sourcesSkipped).toBe(1)
      expect(result.stats.mapsSkipped).toBe(1)
    })

    it('should rename conflicts when renameConflicts is true', () => {
      const duplicateCollection: MapCollection = {
        ...importedCollection,
        customSources: [{
          ...mockCustomSource,
          url: existingSource.url // Same URL but different name
        }]
      }
      
      const result = mergeCollections(
        [existingSource],
        [],
        duplicateCollection,
        { skipDuplicates: false, renameConflicts: true }
      )
      
      expect(result.sources).toHaveLength(2)
      expect(result.sources[1].name).toBe('Test Source (imported)')
    })

    it('should generate new IDs for imported items', () => {
      const result = mergeCollections(
        [],
        [],
        importedCollection
      )
      
      expect(result.sources[0].id).not.toBe(mockCustomSource.id)
      expect(result.maps[0].id).not.toBe(mockUploadedMap.id)
      expect(result.sources[0].id).toMatch(/^source-/)
      expect(result.maps[0].id).toMatch(/^map-/)
    })
  })
})