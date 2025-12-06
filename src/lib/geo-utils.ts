export function calculateAreaFromBounds(bounds: {
  north: number
  south: number
  east: number
  west: number
}): number {
  const R = 6371
  const dLat = toRadians(bounds.north - bounds.south)
  const dLon = toRadians(bounds.east - bounds.west)
  const avgLat = toRadians((bounds.north + bounds.south) / 2)
  
  const area = R * R * Math.abs(dLat * dLon * Math.cos(avgLat))
  
  return Math.round(area * 100) / 100
}

export function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180)
}

export function formatArea(areaSqKm: number): string {
  if (areaSqKm < 1) {
    return `${(areaSqKm * 1000000).toFixed(0)} m²`
  }
  return `${areaSqKm.toFixed(2)} km²`
}

export function formatCoordinate(lat: number, lng: number): string {
  const latDir = lat >= 0 ? 'N' : 'S'
  const lngDir = lng >= 0 ? 'E' : 'W'
  return `${Math.abs(lat).toFixed(4)}°${latDir}, ${Math.abs(lng).toFixed(4)}°${lngDir}`
}
