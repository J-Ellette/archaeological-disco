import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { CustomMapSource, UploadedMap } from '@/lib/types'
import { exportCollection, downloadCollectionAsJSON } from '@/lib/collection-utils'
import { DownloadSimple, Package } from '@phosphor-icons/react'

interface ExportCollectionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  customSources: CustomMapSource[]
  uploadedMaps: UploadedMap[]
}

export function ExportCollectionDialog({
  open,
  onOpenChange,
  customSources,
  uploadedMaps
}: ExportCollectionDialogProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const handleExport = () => {
    if (!name.trim()) {
      return
    }

    const collection = exportCollection(
      name.trim(),
      customSources,
      uploadedMaps,
      description.trim() || undefined
    )

    downloadCollectionAsJSON(collection)
    
    setName('')
    setDescription('')
    onOpenChange(false)
  }

  const totalItems = customSources.length + uploadedMaps.length

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Export Map Collection
          </DialogTitle>
          <DialogDescription>
            Export your custom map sources and uploaded maps as a reusable collection
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-muted rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Custom Sources:</span>
              <span className="font-semibold">{customSources.length}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Uploaded Maps:</span>
              <span className="font-semibold">{uploadedMaps.length}</span>
            </div>
            <div className="pt-2 border-t border-border flex items-center justify-between">
              <span className="font-medium">Total Items:</span>
              <span className="font-bold text-lg">{totalItems}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="collection-name">Collection Name *</Label>
            <Input
              id="collection-name"
              placeholder="e.g., My Archaeological Sites"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="collection-description">Description (optional)</Label>
            <Textarea
              id="collection-description"
              placeholder="Describe what's included in this collection..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {totalItems === 0 && (
            <div className="text-sm text-muted-foreground bg-accent/10 rounded-lg p-3">
              No custom sources or uploaded maps to export. Add some layers first.
            </div>
          )}
        </div>

        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleExport}
            disabled={!name.trim() || totalItems === 0}
          >
            <DownloadSimple className="w-4 h-4" />
            <span className="ml-2">Export as JSON</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
