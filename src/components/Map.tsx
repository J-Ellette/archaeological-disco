import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { ArchaeologicalSite, CustomMapSource, UploadedMap } from '@/lib/types'

interface MapProps {
  sites: ArchaeologicalSite[]
  onSiteClick: (site: ArchaeologicalSite) => void
  onBoundsDrawn: (bounds: { north: number; south: number; east: number; west: number }) => void
  drawMode: 'none' | 'rectangle'
  selectedSiteId?: string
  customSources: CustomMapSource[]
  uploadedMaps: UploadedMap[]
}

const baseLayers: Record<string, { name: string; url: string; attribution: string; maxZoom?: number; minZoom?: number }> = {
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

export function Map({ sites, onSiteClick, onBoundsDrawn, drawMode, selectedSiteId, customSources, uploadedMaps }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markersRef = useRef<{ [key: string]: L.Marker }>({})
  const rectangleRef = useRef<L.Rectangle | null>(null)
  const imageOverlaysRef = useRef<{ [key: string]: L.ImageOverlay }>({})
  const [currentLayer, setCurrentLayer] = useState<string>('terrain')
  const [activeOverlays, setActiveOverlays] = useState<Set<string>>(new Set())

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

    const baseLayersArray = Object.entries(baseLayers).map(([key, value]) => ({ id: key, ...value }))
    const allLayers = [...baseLayersArray, ...customSources]
    const selectedSource = allLayers.find(layer => layer.id === currentLayer)

    if (selectedSource && selectedSource.url) {
      L.tileLayer(selectedSource.url, {
        attribution: selectedSource.attribution || '',
        maxZoom: selectedSource.maxZoom || 19,
        minZoom: selectedSource.minZoom || 0
      }).addTo(map)
    }
  }, [currentLayer, customSources])

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
      return () => {
        // Cleanup function for when not in rectangle mode
      }
    }
  }, [drawMode, onBoundsDrawn])

  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map) return

    Object.values(imageOverlaysRef.current).forEach((overlay) => overlay.remove())
    imageOverlaysRef.current = {}

    uploadedMaps.forEach((uploadedMap) => {
      if (activeOverlays.has(uploadedMap.id)) {
        const bounds = L.latLngBounds(
          [uploadedMap.bounds.south, uploadedMap.bounds.west],
          [uploadedMap.bounds.north, uploadedMap.bounds.east]
        )
        
        const overlay = L.imageOverlay(uploadedMap.dataUrl, bounds, {
          opacity: 0.7,
          interactive: true
        })
        
        overlay.addTo(map)
        imageOverlaysRef.current[uploadedMap.id] = overlay
      }
    })
  }, [uploadedMaps, activeOverlays])

  const toggleOverlay = (mapId: string) => {
    setActiveOverlays((current) => {
      const newSet = new Set(current)
      if (newSet.has(mapId)) {
        newSet.delete(mapId)
      } else {
        newSet.add(mapId)
      }
      return newSet
    })
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full" />
      
      <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-2">
        <div className="bg-card rounded-lg shadow-lg overflow-hidden border border-border">
          {Object.entries(baseLayers).map(([key, layer]) => (
            <button
              key={key}
              onClick={() => setCurrentLayer(key)}
              className={`px-4 py-2 text-sm font-medium transition-colors w-full text-left ${
                currentLayer === key
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card hover:bg-muted'
              }`}
            >
              {layer.name}
            </button>
          ))}
          {customSources.map((source) => (
            <button
              key={source.id}
              onClick={() => setCurrentLayer(source.id)}
              className={`px-4 py-2 text-sm font-medium transition-colors w-full text-left ${
                currentLayer === source.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card hover:bg-muted'
              }`}
            >
              {source.name}
            </button>
          ))}
        </div>

        {uploadedMaps.length > 0 && (
          <div className="bg-card rounded-lg shadow-lg border border-border p-3">
            <div className="text-xs font-semibold text-muted-foreground mb-2 px-1">Overlays</div>
            <div className="space-y-1.5">
              {uploadedMaps.map((map) => (
                <button
                  key={map.id}
                  onClick={() => toggleOverlay(map.id)}
                  className={`px-3 py-1.5 text-xs font-medium transition-colors w-full text-left rounded ${
                    activeOverlays.has(map.id)
                      ? 'bg-accent text-accent-foreground'
                      : 'hover:bg-muted'
                  }`}
                >
                  {map.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
