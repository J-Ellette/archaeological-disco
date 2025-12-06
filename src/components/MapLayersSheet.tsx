import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { CustomMapSource, UploadedMap } from '@/lib/types'
import {
  Trash,
  Plus,
  Upload,
  Globe,
  Image as ImageIcon,
  Stack
} from '@phosphor-icons/react'

interface MapLayersSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  customSources: CustomMapSource[]
  uploadedMaps: UploadedMap[]
  onDeleteSource: (id: string) => void
  onDeleteUpload: (id: string) => void
  onAddSourceClick: () => void
  onUploadMapClick: () => void
}

export function MapLayersSheet({
  open,
  onOpenChange,
  customSources,
  uploadedMaps,
  onDeleteSource,
  onDeleteUpload,
  onAddSourceClick,
  onUploadMapClick
}: MapLayersSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Map Layers</SheetTitle>
          <SheetDescription>
            Manage custom map sources and uploaded map overlays
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-2 mt-6">
          <Button onClick={onAddSourceClick} variant="outline" className="w-full justify-start">
            <Plus className="w-4 h-4 mr-2" />
            Add Custom Map Source
          </Button>
          <Button onClick={onUploadMapClick} variant="outline" className="w-full justify-start">
            <Upload className="w-4 h-4 mr-2" />
            Upload Map Image
          </Button>
        </div>

        <Separator className="my-6" />

        <ScrollArea className="h-[calc(100vh-280px)]">
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Globe className="w-5 h-5 text-muted-foreground" />
                <h3 className="font-semibold text-sm">Custom Map Sources</h3>
                <span className="text-xs text-muted-foreground ml-auto">
                  {customSources.length}
                </span>
              </div>

              {customSources.length === 0 ? (
                <div className="text-sm text-muted-foreground text-center py-8 bg-muted/30 rounded-md">
                  No custom sources added yet
                </div>
              ) : (
                <div className="space-y-2">
                  {customSources.map((source) => (
                    <div
                      key={source.id}
                      className="flex items-start gap-3 p-3 rounded-md border border-border bg-card hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Stack className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          <span className="font-medium text-sm truncate">{source.name}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 truncate">
                          {source.url}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-xs px-1.5 py-0.5 bg-muted rounded-sm font-mono">
                            {source.type.toUpperCase()}
                          </span>
                          {source.attribution && (
                            <span className="text-xs text-muted-foreground truncate">
                              {source.attribution}
                            </span>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteSource(source.id)}
                        className="h-8 w-8 p-0 flex-shrink-0"
                      >
                        <Trash className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Separator />

            <div>
              <div className="flex items-center gap-2 mb-3">
                <ImageIcon className="w-5 h-5 text-muted-foreground" />
                <h3 className="font-semibold text-sm">Uploaded Map Images</h3>
                <span className="text-xs text-muted-foreground ml-auto">
                  {uploadedMaps.length}
                </span>
              </div>

              {uploadedMaps.length === 0 ? (
                <div className="text-sm text-muted-foreground text-center py-8 bg-muted/30 rounded-md">
                  No maps uploaded yet
                </div>
              ) : (
                <div className="space-y-2">
                  {uploadedMaps.map((map) => (
                    <div
                      key={map.id}
                      className="flex items-start gap-3 p-3 rounded-md border border-border bg-card hover:bg-accent/50 transition-colors"
                    >
                      <div className="w-16 h-16 rounded overflow-hidden border border-border flex-shrink-0 bg-muted">
                        <img
                          src={map.dataUrl}
                          alt={map.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="font-medium text-sm block truncate">{map.name}</span>
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">
                          {map.fileName}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {map.bounds.north.toFixed(4)}, {map.bounds.west.toFixed(4)} →{' '}
                          {map.bounds.south.toFixed(4)}, {map.bounds.east.toFixed(4)}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteUpload(map.id)}
                        className="h-8 w-8 p-0 flex-shrink-0"
                      >
                        <Trash className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
