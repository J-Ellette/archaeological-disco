import { useState, useRef } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { UploadedMap } from '@/lib/types'
import { Upload, Image } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface UploadMapDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpload: (map: Omit<UploadedMap, 'id' | 'createdAt'>) => void
}

export function UploadMapDialog({ open, onOpenChange, onUpload }: UploadMapDialogProps) {
  const [name, setName] = useState('')
  const [fileName, setFileName] = useState('')
  const [dataUrl, setDataUrl] = useState('')
  const [north, setNorth] = useState('')
  const [south, setSouth] = useState('')
  const [east, setEast] = useState('')
  const [west, setWest] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const result = event.target?.result as string
      setDataUrl(result)
      setFileName(file.name)
      if (!name) {
        setName(file.name.replace(/\.[^/.]+$/, ''))
      }
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = () => {
    if (!name.trim() || !dataUrl || !north || !south || !east || !west) {
      toast.error('Please fill in all fields')
      return
    }

    const northNum = parseFloat(north)
    const southNum = parseFloat(south)
    const eastNum = parseFloat(east)
    const westNum = parseFloat(west)

    if (isNaN(northNum) || isNaN(southNum) || isNaN(eastNum) || isNaN(westNum)) {
      toast.error('Coordinates must be valid numbers')
      return
    }

    if (northNum <= southNum) {
      toast.error('North coordinate must be greater than south')
      return
    }

    if (eastNum <= westNum) {
      toast.error('East coordinate must be greater than west')
      return
    }

    onUpload({
      name: name.trim(),
      fileName,
      dataUrl,
      bounds: {
        north: northNum,
        south: southNum,
        east: eastNum,
        west: westNum
      }
    })

    setName('')
    setFileName('')
    setDataUrl('')
    setNorth('')
    setSouth('')
    setEast('')
    setWest('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Upload Map Image</DialogTitle>
          <DialogDescription>
            Upload a georeferenced map image and specify its geographic bounds
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="map-name">Map Name</Label>
            <Input
              id="map-name"
              placeholder="Historical Map 1850"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="map-file">Image File</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                {fileName || 'Choose Image'}
              </Button>
              <input
                ref={fileInputRef}
                id="map-file"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
              />
            </div>
            {dataUrl && (
              <div className="relative w-full h-32 bg-muted rounded-md overflow-hidden border border-border">
                <img
                  src={dataUrl}
                  alt="Preview"
                  className="w-full h-full object-contain"
                />
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Supported formats: JPG, PNG, GIF (max 10MB)
            </p>
          </div>

          <div className="grid gap-2">
            <Label className="text-sm font-medium">Geographic Bounds</Label>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="north" className="text-xs text-muted-foreground">
                  North Latitude
                </Label>
                <Input
                  id="north"
                  type="number"
                  step="any"
                  placeholder="51.5074"
                  value={north}
                  onChange={(e) => setNorth(e.target.value)}
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="south" className="text-xs text-muted-foreground">
                  South Latitude
                </Label>
                <Input
                  id="south"
                  type="number"
                  step="any"
                  placeholder="51.5074"
                  value={south}
                  onChange={(e) => setSouth(e.target.value)}
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="east" className="text-xs text-muted-foreground">
                  East Longitude
                </Label>
                <Input
                  id="east"
                  type="number"
                  step="any"
                  placeholder="-0.1278"
                  value={east}
                  onChange={(e) => setEast(e.target.value)}
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="west" className="text-xs text-muted-foreground">
                  West Longitude
                </Label>
                <Input
                  id="west"
                  type="number"
                  step="any"
                  placeholder="-0.1278"
                  value={west}
                  onChange={(e) => setWest(e.target.value)}
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Specify the corners of your map in decimal degrees
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!name.trim() || !dataUrl || !north || !south || !east || !west}
          >
            <Image className="w-4 h-4 mr-2" />
            Upload Map
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
