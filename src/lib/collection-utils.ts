import { MapCollection, CustomMapSource, UploadedMap } from './types'

const COLLECTION_VERSION = '1.0.0'

export function exportCollection(
  name: string,
  customSources: CustomMapSource[],
  uploadedMaps: UploadedMap[],
  description?: string
): MapCollection {
  const now = Date.now()
  
  return {
    id: `collection-${now}`,
    name,
    description,
    customSources,
    uploadedMaps,
    createdAt: now,
    exportedAt: now,
    version: COLLECTION_VERSION
  }
}

export function downloadCollectionAsJSON(collection: MapCollection): void {
  const json = JSON.stringify(collection, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = `${sanitizeFilename(collection.name)}-collection.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export async function importCollectionFromFile(file: File): Promise<MapCollection> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const json = e.target?.result as string
        const collection = JSON.parse(json) as MapCollection
        
        if (!validateCollection(collection)) {
          reject(new Error('Invalid collection format'))
          return
        }
        
        resolve(collection)
      } catch (error) {
        reject(new Error('Failed to parse collection file'))
      }
    }
    
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsText(file)
  })
}

export function validateCollection(data: any): data is MapCollection {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof data.id === 'string' &&
    typeof data.name === 'string' &&
    typeof data.version === 'string' &&
    Array.isArray(data.customSources) &&
    Array.isArray(data.uploadedMaps) &&
    typeof data.createdAt === 'number' &&
    typeof data.exportedAt === 'number'
  )
}

export function mergeCollections(
  existingSources: CustomMapSource[],
  existingMaps: UploadedMap[],
  importedCollection: MapCollection,
  options: {
    skipDuplicates?: boolean
    renameConflicts?: boolean
  } = {}
): {
  sources: CustomMapSource[]
  maps: UploadedMap[]
  stats: {
    sourcesAdded: number
    sourcesSkipped: number
    mapsAdded: number
    mapsSkipped: number
  }
} {
  const { skipDuplicates = true, renameConflicts = true } = options
  
  const stats = {
    sourcesAdded: 0,
    sourcesSkipped: 0,
    mapsAdded: 0,
    mapsSkipped: 0
  }
  
  const newSources = [...existingSources]
  const newMaps = [...existingMaps]
  
  for (const source of importedCollection.customSources) {
    const duplicate = existingSources.find(s => s.url === source.url)
    
    if (duplicate && skipDuplicates) {
      stats.sourcesSkipped++
      continue
    }
    
    const newSource = {
      ...source,
      id: `source-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: renameConflicts && duplicate ? `${source.name} (imported)` : source.name
    }
    
    newSources.push(newSource)
    stats.sourcesAdded++
  }
  
  for (const map of importedCollection.uploadedMaps) {
    const duplicate = existingMaps.find(m => m.fileName === map.fileName)
    
    if (duplicate && skipDuplicates) {
      stats.mapsSkipped++
      continue
    }
    
    const newMap = {
      ...map,
      id: `map-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: renameConflicts && duplicate ? `${map.name} (imported)` : map.name
    }
    
    newMaps.push(newMap)
    stats.mapsAdded++
  }
  
  return {
    sources: newSources,
    maps: newMaps,
    stats
  }
}

function sanitizeFilename(filename: string): string {
  return filename
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50)
}
