import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { ArchaeologicalSite } from '@/lib/types'

interface MapProps {
  sites: ArchaeologicalSite[]
  onSiteClick: (site: ArchaeologicalSite) => void
  onBoundsDrawn: (bounds: { north: number; south: number; east: number; west: number }) => void
  drawMode: 'none' | 'rectangle'
  selectedSiteId?: string
}

const baseLayers = {
  street: {
    name: 'Street',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '© OpenStreetMap contributors'
  },
  satellite: {
    name: 'Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '© Esri'
  },
  terrain: {
    name: 'Terrain',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: '© OpenTopoMap'
  },
  lidar: {
    name: 'LiDAR',
    url: 'https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}.png',
    attribution: '© Stadia Maps © Stamen Design © OpenMapTiles'
  }
}

export function Map({ sites, onSiteClick, onBoundsDrawn, drawMode, selectedSiteId }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markersRef = useRef<{ [key: string]: L.Marker }>({})
  const rectangleRef = useRef<L.Rectangle | null>(null)
  const [currentLayer, setCurrentLayer] = useState<'street' | 'satellite' | 'terrain' | 'lidar'>('terrain')

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    const map = L.map(mapRef.current, {
      center: [13.4125, 103.8670],
      zoom: 3,
      zoomControl: false
    })

    L.control.zoom({ position: 'bottomright' }).addTo(map)

    const tileLayer = L.tileLayer(baseLayers[currentLayer].url, {
      attribution: baseLayers[currentLayer].attribution,
      maxZoom: 19
    })
    tileLayer.addTo(map)

    mapInstanceRef.current = map

    return () => {
      map.remove()
      mapInstanceRef.current = null
    }
  }, [])

  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map) return

    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer)
      }
    })

    L.tileLayer(baseLayers[currentLayer].url, {
      attribution: baseLayers[currentLayer].attribution,
      maxZoom: 19
    }).addTo(map)
  }, [currentLayer])

  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map) return

    Object.values(markersRef.current).forEach((marker) => marker.remove())
    markersRef.current = {}

    const siteIcon = (type: string, isSelected: boolean) => {
      const icons = {
        settlement: '🏛️',
        burial: '⚰️',
        monument: '🗿',
        temple: '🛕',
        fortress: '🏰',
        artifact: '🏺'
      }
      
      return L.divIcon({
        className: 'custom-marker',
        html: `<div style="
          font-size: 24px;
          text-align: center;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
          transform: scale(${isSelected ? 1.3 : 1});
          transition: transform 0.2s;
        ">${icons[type as keyof typeof icons] || '📍'}</div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      })
    }

    sites.forEach((site) => {
      const marker = L.marker([site.lat, site.lng], {
        icon: siteIcon(site.type, site.id === selectedSiteId)
      })

      marker.bindTooltip(site.name, {
        permanent: false,
        direction: 'top',
        className: 'custom-tooltip'
      })

      marker.on('click', () => {
        onSiteClick(site)
      })

      marker.addTo(map)
      markersRef.current[site.id] = marker
    })
  }, [sites, onSiteClick, selectedSiteId])

  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map) return

    if (drawMode === 'rectangle') {
      map.getContainer().style.cursor = 'crosshair'

      let startLatLng: L.LatLng | null = null

      const onMouseDown = (e: L.LeafletMouseEvent) => {
        startLatLng = e.latlng
        if (rectangleRef.current) {
          rectangleRef.current.remove()
        }
      }

      const onMouseMove = (e: L.LeafletMouseEvent) => {
        if (!startLatLng) return

        if (rectangleRef.current) {
          rectangleRef.current.remove()
        }

        const bounds = L.latLngBounds(startLatLng, e.latlng)
        rectangleRef.current = L.rectangle(bounds, {
          color: 'oklch(0.45 0.12 35)',
          weight: 2,
          fillColor: 'oklch(0.72 0.15 80)',
          fillOpacity: 0.2
        }).addTo(map)
      }

      const onMouseUp = (e: L.LeafletMouseEvent) => {
        if (!startLatLng) return

        const bounds = L.latLngBounds(startLatLng, e.latlng)
        const boundsObj = {
          north: bounds.getNorth(),
          south: bounds.getSouth(),
          east: bounds.getEast(),
          west: bounds.getWest()
        }

        onBoundsDrawn(boundsObj)
        
        if (rectangleRef.current) {
          rectangleRef.current.remove()
          rectangleRef.current = null
        }

        startLatLng = null
        map.getContainer().style.cursor = ''
      }

      map.on('mousedown', onMouseDown)
      map.on('mousemove', onMouseMove)
      map.on('mouseup', onMouseUp)

      return () => {
        map.off('mousedown', onMouseDown)
        map.off('mousemove', onMouseMove)
        map.off('mouseup', onMouseUp)
        map.getContainer().style.cursor = ''
        if (rectangleRef.current) {
          rectangleRef.current.remove()
          rectangleRef.current = null
        }
      }
    } else {
      map.getContainer().style.cursor = ''
    }
  }, [drawMode, onBoundsDrawn])

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full" />
      
      <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-2">
        <div className="bg-card rounded-lg shadow-lg overflow-hidden border border-border">
          {Object.entries(baseLayers).map(([key, layer]) => (
            <button
              key={key}
              onClick={() => setCurrentLayer(key as typeof currentLayer)}
              className={`px-4 py-2 text-sm font-medium transition-colors w-full text-left ${
                currentLayer === key
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card hover:bg-muted'
              }`}
            >
              {layer.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
