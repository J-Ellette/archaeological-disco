import { useState } from 'react'
import { MapCollection } from '@/lib/types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { X, Tag, Upload } from '@phosphor-icons/react'

interface PublishCollectionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  customSourcesCount: number
  uploadedMapsCount: number
  onPublish: (data: { name: string; description: string; tags: string[] }) => void
}

export function PublishCollectionDialog({
  open,
  onOpenChange,
  customSourcesCount,
  uploadedMapsCount,
  onPublish,
}: PublishCollectionDialogProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')

  const handleSubmit = () => {
    if (!name.trim()) return

    onPublish({
      name: name.trim(),
      description: description.trim(),
      tags,
    })

    setName('')
    setDescription('')
    setTags([])
    setTagInput('')
  }

  const addTag = () => {
    const trimmed = tagInput.trim().toLowerCase()
    if (trimmed && !tags.includes(trimmed) && tags.length < 10) {
      setTags([...tags, trimmed])
      setTagInput('')
    }
  }

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

  const canPublish = name.trim() && (customSourcesCount > 0 || uploadedMapsCount > 0)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-primary" />
            Publish to Marketplace
          </DialogTitle>
          <DialogDescription>
            Share your map collection with other users. Include custom sources and uploaded maps.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex gap-4">
            <div className="flex-1 bg-muted rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-primary">{customSourcesCount}</div>
              <div className="text-xs text-muted-foreground mt-1">Custom Sources</div>
            </div>
            <div className="flex-1 bg-muted rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-primary">{uploadedMapsCount}</div>
              <div className="text-xs text-muted-foreground mt-1">Uploaded Maps</div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="collection-name">Collection Name *</Label>
            <Input
              id="collection-name"
              placeholder="e.g., Ancient Roman Sites"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={100}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="collection-description">Description</Label>
            <Textarea
              id="collection-description"
              placeholder="Describe what's included in this collection..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              maxLength={500}
            />
            <div className="text-xs text-muted-foreground text-right">
              {description.length}/500
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="collection-tags">Tags (up to 10)</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="collection-tags"
                  placeholder="e.g., historical, lidar, terrain"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagInputKeyDown}
                  disabled={tags.length >= 10}
                  className="pl-9"
                  maxLength={20}
                />
              </div>
              <Button
                type="button"
                onClick={addTag}
                disabled={!tagInput.trim() || tags.length >= 10}
                size="sm"
              >
                Add
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1.5">
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="hover:text-destructive transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {!canPublish && (
            <div className="bg-muted border border-border rounded-lg p-3 text-sm text-muted-foreground">
              You need at least one custom source or uploaded map to publish a collection.
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!canPublish}>
            <Upload className="w-4 h-4 mr-2" />
            Publish Collection
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
