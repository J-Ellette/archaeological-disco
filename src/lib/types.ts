export interface ArchaeologicalSite {
  id: string
  name: string
  type: 'settlement' | 'burial' | 'monument' | 'temple' | 'fortress' | 'artifact'
  period: string
  description: string
  lat: number
  lng: number
  discovered?: string
  significance: 'high' | 'medium' | 'low'
}

export interface Discovery {
  id: string
  title: string
  notes: string
  tags: string[]
  bounds: {
    north: number
    south: number
    east: number
    west: number
  }
  area: number
  createdAt: number
  updatedAt: number
}

export interface MapLayer {
  id: string
  name: string
  type: 'base' | 'overlay'
  enabled: boolean
  opacity: number
  url?: string
}

export type DrawMode = 'none' | 'rectangle' | 'polygon' | 'marker'

export interface CustomMapSource {
  id: string
  name: string
  type: 'tile' | 'wms' | 'image'
  url: string
  attribution?: string
  maxZoom?: number
  minZoom?: number
  bounds?: {
    north: number
    south: number
    east: number
    west: number
  }
  createdAt: number
}

export interface UploadedMap {
  id: string
  name: string
  fileName: string
  dataUrl: string
  bounds: {
    north: number
    south: number
    east: number
    west: number
  }
  createdAt: number
}

export interface MapCollection {
  id: string
  name: string
  description?: string
  customSources: CustomMapSource[]
  uploadedMaps: UploadedMap[]
  createdAt: number
  exportedAt: number
  version: string
}

export interface MarketplaceListing {
  id: string
  collectionId: string
  name: string
  description?: string
  author: {
    login: string
    avatarUrl: string
  }
  tags: string[]
  sourceCount: number
  mapCount: number
  downloads: number
  rating: number
  ratingCount: number
  publishedAt: number
  updatedAt: number
  collection: MapCollection
}

export interface UserRating {
  listingId: string
  userId: string
  rating: number
  createdAt: number
}
