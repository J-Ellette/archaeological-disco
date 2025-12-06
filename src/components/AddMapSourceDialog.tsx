import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CustomMapSource } from '@/lib/types'
import { Plus } from '@phosphor-icons/react'

interface AddMapSourceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (source: Omit<CustomMapSource, 'id' | 'createdAt'>) => void
}

export function AddMapSourceDialog({ open, onOpenChange, onAdd }: AddMapSourceDialogProps) {
  const [name, setName] = useState('')
  const [type, setType] = useState<'tile' | 'wms' | 'image'>('tile')
  const [url, setUrl] = useState('')
  const [attribution, setAttribution] = useState('')
  const [maxZoom, setMaxZoom] = useState('19')
  const [minZoom, setMinZoom] = useState('0')

  const handleSubmit = () => {
    if (!name.trim() || !url.trim()) return

    onAdd({
      name: name.trim(),
      type,
      url: url.trim(),
      attribution: attribution.trim() || undefined,
      maxZoom: parseInt(maxZoom) || 19,
      minZoom: parseInt(minZoom) || 0
    })

    setName('')
    setUrl('')
    setAttribution('')
    setMaxZoom('19')
    setMinZoom('0')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Custom Map Source</DialogTitle>
          <DialogDescription>
            Add a tile server, WMS service, or image overlay to use as a map layer
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="source-name">Name</Label>
            <Input
              id="source-name"
              placeholder="My Custom Map"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="source-type">Type</Label>
            <Select value={type} onValueChange={(value) => setType(value as typeof type)}>
              <SelectTrigger id="source-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tile">Tile Server (XYZ)</SelectItem>
                <SelectItem value="wms">WMS Service</SelectItem>
                <SelectItem value="image">Image Overlay</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="source-url">URL</Label>
            <Input
              id="source-url"
              placeholder={
                type === 'tile'
                  ? 'https://example.com/{z}/{x}/{y}.png'
                  : type === 'wms'
                  ? 'https://example.com/wms?service=WMS&request=GetMap&layers=...'
                  : 'https://example.com/image.png'
              }
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              {type === 'tile' && 'Use {z}, {x}, {y} placeholders for tile coordinates'}
              {type === 'wms' && 'Full WMS GetMap request URL'}
              {type === 'image' && 'Direct link to georeferenced image'}
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="source-attribution">Attribution (optional)</Label>
            <Input
              id="source-attribution"
              placeholder="© Map Provider"
              value={attribution}
              onChange={(e) => setAttribution(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="min-zoom">Min Zoom</Label>
              <Input
                id="min-zoom"
                type="number"
                min="0"
                max="22"
                value={minZoom}
                onChange={(e) => setMinZoom(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="max-zoom">Max Zoom</Label>
              <Input
                id="max-zoom"
                type="number"
                min="0"
                max="22"
                value={maxZoom}
                onChange={(e) => setMaxZoom(e.target.value)}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!name.trim() || !url.trim()}>
            <Plus className="w-4 h-4 mr-2" />
            Add Source
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
