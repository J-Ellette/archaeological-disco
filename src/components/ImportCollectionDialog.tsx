import { useState, useRef } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { MapCollection } from '@/lib/types'
import { importCollectionFromFile } from '@/lib/collection-utils'
import { UploadSimple, FileJs, CheckCircle, Warning } from '@phosphor-icons/react'

interface ImportCollectionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImport: (collection: MapCollection, options: { skipDuplicates: boolean; renameConflicts: boolean }) => void
}

export function ImportCollectionDialog({
  open,
  onOpenChange,
  onImport
}: ImportCollectionDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [collection, setCollection] = useState<MapCollection | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [skipDuplicates, setSkipDuplicates] = useState(true)
  const [renameConflicts, setRenameConflicts] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setSelectedFile(file)
    setError(null)
    setIsLoading(true)

    try {
      const importedCollection = await importCollectionFromFile(file)
      setCollection(importedCollection)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import collection')
      setCollection(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleImport = () => {
    if (!collection) return

    onImport(collection, { skipDuplicates, renameConflicts })
    handleClose()
  }

  const handleClose = () => {
    setSelectedFile(null)
    setCollection(null)
    setError(null)
    setIsLoading(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    onOpenChange(false)
  }

  const totalItems = collection
    ? collection.customSources.length + collection.uploadedMaps.length
    : 0

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UploadSimple className="w-5 h-5" />
            Import Map Collection
          </DialogTitle>
          <DialogDescription>
            Import a previously exported collection of custom sources and maps
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Select Collection File</Label>
            <div className="flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleFileSelect}
                className="hidden"
                id="collection-file-input"
                title="Select collection file"
              />
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => fileInputRef.current?.click()}
              >
                <FileJs className="w-4 h-4" />
                <span className="ml-2">
                  {selectedFile ? selectedFile.name : 'Choose JSON file...'}
                </span>
              </Button>
            </div>
          </div>

          {isLoading && (
            <div className="text-sm text-muted-foreground bg-muted rounded-lg p-3">
              Loading collection...
            </div>
          )}

          {error && (
            <div className="flex items-start gap-2 text-sm text-destructive bg-destructive/10 rounded-lg p-3">
              <Warning className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {collection && !error && (
            <div className="space-y-4">
              <div className="flex items-start gap-2 text-sm text-primary bg-primary/10 rounded-lg p-3">
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Collection loaded successfully</span>
              </div>

              <div className="bg-muted rounded-lg p-4 space-y-3">
                <div>
                  <div className="font-semibold">{collection.name}</div>
                  {collection.description && (
                    <div className="text-sm text-muted-foreground mt-1">
                      {collection.description}
                    </div>
                  )}
                </div>
                
                <div className="pt-2 border-t border-border space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Custom Sources:</span>
                    <span className="font-semibold">{collection.customSources.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Uploaded Maps:</span>
                    <span className="font-semibold">{collection.uploadedMaps.length}</span>
                  </div>
                  <div className="pt-2 border-t border-border flex items-center justify-between">
                    <span className="font-medium">Total Items:</span>
                    <span className="font-bold text-lg">{totalItems}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="skip-duplicates">Skip Duplicates</Label>
                    <div className="text-xs text-muted-foreground">
                      Don't import items that already exist
                    </div>
                  </div>
                  <Switch
                    id="skip-duplicates"
                    checked={skipDuplicates}
                    onCheckedChange={setSkipDuplicates}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="rename-conflicts">Rename Conflicts</Label>
                    <div className="text-xs text-muted-foreground">
                      Add "(imported)" to conflicting names
                    </div>
                  </div>
                  <Switch
                    id="rename-conflicts"
                    checked={renameConflicts}
                    onCheckedChange={setRenameConflicts}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleImport}
            disabled={!collection || isLoading}
          >
            <UploadSimple className="w-4 h-4" />
            <span className="ml-2">Import Collection</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
