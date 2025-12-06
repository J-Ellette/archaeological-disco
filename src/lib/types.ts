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
