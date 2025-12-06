import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Map } from '@/components/Map'
import { SiteInfoSheet } from '@/components/SiteInfoSheet'
import { DiscoveryManager } from '@/components/DiscoveryManager'
import { SaveDiscoveryDialog } from '@/components/SaveDiscoveryDialog'
import { MapLayersSheet } from '@/components/MapLayersSheet'
import { AddMapSourceDialog } from '@/components/AddMapSourceDialog'
import { UploadMapDialog } from '@/components/UploadMapDialog'
import { ExportCollectionDialog } from '@/components/ExportCollectionDialog'
import { ImportCollectionDialog } from '@/components/ImportCollectionDialog'
import { Button } from '@/components/ui/button'
import { Toaster, toast } from 'sonner'
import { ArchaeologicalSite, Discovery, CustomMapSource, UploadedMap, MapCollection } from '@/lib/types'
import { archaeologicalSites } from '@/lib/archaeological-sites'
import { calculateAreaFromBounds } from '@/lib/geo-utils'
import { mergeCollections } from '@/lib/collection-utils'
import {
  CursorClick,
  FolderOpen,
  List,
  X,
  Stack
} from '@phosphor-icons/react'

function App() {
  const [discoveries, setDiscoveries] = useKV<Discovery[]>('discoveries', [])
  const [customSources, setCustomSources] = useKV<CustomMapSource[]>('custom-sources', [])
  const [uploadedMaps, setUploadedMaps] = useKV<UploadedMap[]>('uploaded-maps', [])
  const [selectedSite, setSelectedSite] = useState<ArchaeologicalSite | null>(null)
  const [siteSheetOpen, setSiteSheetOpen] = useState(false)
  const [discoveryManagerOpen, setDiscoveryManagerOpen] = useState(false)
  const [mapLayersOpen, setMapLayersOpen] = useState(false)
  const [addSourceDialogOpen, setAddSourceDialogOpen] = useState(false)
  const [uploadMapDialogOpen, setUploadMapDialogOpen] = useState(false)
  const [exportCollectionOpen, setExportCollectionOpen] = useState(false)
  const [importCollectionOpen, setImportCollectionOpen] = useState(false)
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [drawMode, setDrawMode] = useState<'none' | 'rectangle'>('none')
  const [pendingBounds, setPendingBounds] = useState<{
    north: number
    south: number
    east: number
    west: number
  } | null>(null)
  const [sitesVisible, setSitesVisible] = useState(true)

  const handleSiteClick = (site: ArchaeologicalSite) => {
    setSelectedSite(site)
    setSiteSheetOpen(true)
  }

  const handleBoundsDrawn = (bounds: { north: number; south: number; east: number; west: number }) => {
    setPendingBounds(bounds)
    setSaveDialogOpen(true)
    setDrawMode('none')
  }

  const handleSaveDiscovery = (data: { title: string; notes: string; tags: string[] }) => {
    if (!pendingBounds) return

    const area = calculateAreaFromBounds(pendingBounds)
    const now = Date.now()

    const newDiscovery: Discovery = {
      id: `discovery-${now}`,
      title: data.title,
      notes: data.notes,
      tags: data.tags,
      bounds: pendingBounds,
      area,
      createdAt: now,
      updatedAt: now
    }

    setDiscoveries((current) => [...(current || []), newDiscovery])
    setPendingBounds(null)
    setSaveDialogOpen(false)
    toast.success('Discovery saved successfully!')
  }

  const handleDeleteDiscovery = (id: string) => {
    setDiscoveries((current) => (current || []).filter((d) => d.id !== id))
    toast.success('Discovery deleted')
  }

  const handleSelectDiscovery = (discovery: Discovery) => {
    toast.info(`Viewing: ${discovery.title}`)
    setDiscoveryManagerOpen(false)
  }

  const toggleDrawMode = () => {
    setDrawMode((current) => (current === 'none' ? 'rectangle' : 'none'))
  }

  const handleAddSource = (source: Omit<CustomMapSource, 'id' | 'createdAt'>) => {
    const newSource: CustomMapSource = {
      ...source,
      id: `source-${Date.now()}`,
      createdAt: Date.now()
    }
    setCustomSources((current) => [...(current || []), newSource])
    toast.success('Map source added successfully!')
  }

  const handleUploadMap = (map: Omit<UploadedMap, 'id' | 'createdAt'>) => {
    const newMap: UploadedMap = {
      ...map,
      id: `map-${Date.now()}`,
      createdAt: Date.now()
    }
    setUploadedMaps((current) => [...(current || []), newMap])
    toast.success('Map uploaded successfully!')
  }

  const handleDeleteSource = (id: string) => {
    setCustomSources((current) => (current || []).filter((s) => s.id !== id))
    toast.success('Map source deleted')
  }

  const handleDeleteUpload = (id: string) => {
    setUploadedMaps((current) => (current || []).filter((m) => m.id !== id))
    toast.success('Map deleted')
  }

  const handleImportCollection = (
    collection: MapCollection,
    options: { skipDuplicates: boolean; renameConflicts: boolean }
  ) => {
    const result = mergeCollections(
      customSources || [],
      uploadedMaps || [],
      collection,
      options
    )

    setCustomSources(() => result.sources)
    setUploadedMaps(() => result.maps)

    const { stats } = result
    const messages: string[] = []
    if (stats.sourcesAdded > 0) messages.push(`${stats.sourcesAdded} source(s)`)
    if (stats.mapsAdded > 0) messages.push(`${stats.mapsAdded} map(s)`)
    
    if (messages.length > 0) {
      toast.success(`Imported ${messages.join(' and ')}`)
    }

    if (stats.sourcesSkipped > 0 || stats.mapsSkipped > 0) {
      toast.info(`Skipped ${stats.sourcesSkipped + stats.mapsSkipped} duplicate(s)`)
    }
  }

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      <Toaster position="top-center" />

      <header className="bg-card border-b border-border px-4 py-3 flex items-center justify-between gap-4 z-10 shadow-sm">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Archaeological Discovery Explorer</h1>
          <p className="text-xs text-muted-foreground">Explore ancient sites and discover new features</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={sitesVisible ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSitesVisible(!sitesVisible)}
            className="hidden sm:flex"
          >
            <List className="w-4 h-4" />
            <span className="ml-2">{sitesVisible ? 'Hide' : 'Show'} Sites</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setMapLayersOpen(true)}
          >
            <Stack className="w-4 h-4" />
            <span className="ml-2 hidden sm:inline">Layers</span>
            {((customSources && customSources.length > 0) || (uploadedMaps && uploadedMaps.length > 0)) && (
              <span className="ml-1.5 bg-accent text-accent-foreground rounded-full px-1.5 py-0.5 text-xs font-semibold">
                {(customSources?.length || 0) + (uploadedMaps?.length || 0)}
              </span>
            )}
          </Button>

          <Button
            variant={drawMode === 'rectangle' ? 'default' : 'outline'}
            size="sm"
            onClick={toggleDrawMode}
          >
            {drawMode === 'rectangle' ? (
              <>
                <X className="w-4 h-4" />
                <span className="ml-2">Cancel</span>
              </>
            ) : (
              <>
                <CursorClick className="w-4 h-4" />
                <span className="ml-2">Draw AOI</span>
              </>
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setDiscoveryManagerOpen(true)}
          >
            <FolderOpen className="w-4 h-4" />
            <span className="ml-2 hidden sm:inline">Discoveries</span>
            {(discoveries && discoveries.length > 0) && (
              <span className="ml-1.5 bg-accent text-accent-foreground rounded-full px-1.5 py-0.5 text-xs font-semibold">
                {discoveries.length}
              </span>
            )}
          </Button>
        </div>
      </header>

      <main className="flex-1 relative">
        <Map
          sites={sitesVisible ? archaeologicalSites : []}
          onSiteClick={handleSiteClick}
          onBoundsDrawn={handleBoundsDrawn}
          drawMode={drawMode}
          selectedSiteId={selectedSite?.id}
          customSources={customSources || []}
          uploadedMaps={uploadedMaps || []}
        />
      </main>

      <SiteInfoSheet
        site={selectedSite}
        open={siteSheetOpen}
        onOpenChange={setSiteSheetOpen}
      />

      <DiscoveryManager
        discoveries={discoveries || []}
        open={discoveryManagerOpen}
        onOpenChange={setDiscoveryManagerOpen}
        onDelete={handleDeleteDiscovery}
        onSelect={handleSelectDiscovery}
      />

      <SaveDiscoveryDialog
        open={saveDialogOpen}
        onOpenChange={setSaveDialogOpen}
        onSave={handleSaveDiscovery}
        area={pendingBounds ? calculateAreaFromBounds(pendingBounds) : 0}
      />

      <MapLayersSheet
        open={mapLayersOpen}
        onOpenChange={setMapLayersOpen}
        customSources={customSources || []}
        uploadedMaps={uploadedMaps || []}
        onDeleteSource={handleDeleteSource}
        onDeleteUpload={handleDeleteUpload}
        onAddSourceClick={() => {
          setMapLayersOpen(false)
          setAddSourceDialogOpen(true)
        }}
        onUploadMapClick={() => {
          setMapLayersOpen(false)
          setUploadMapDialogOpen(true)
        }}
        onExportCollectionClick={() => {
          setMapLayersOpen(false)
          setExportCollectionOpen(true)
        }}
        onImportCollectionClick={() => {
          setMapLayersOpen(false)
          setImportCollectionOpen(true)
        }}
      />

      <AddMapSourceDialog
        open={addSourceDialogOpen}
        onOpenChange={setAddSourceDialogOpen}
        onAdd={handleAddSource}
      />

      <UploadMapDialog
        open={uploadMapDialogOpen}
        onOpenChange={setUploadMapDialogOpen}
        onUpload={handleUploadMap}
      />

      <ExportCollectionDialog
        open={exportCollectionOpen}
        onOpenChange={setExportCollectionOpen}
        customSources={customSources || []}
        uploadedMaps={uploadedMaps || []}
      />

      <ImportCollectionDialog
        open={importCollectionOpen}
        onOpenChange={setImportCollectionOpen}
        onImport={handleImportCollection}
      />
    </div>
  )
}

export default App