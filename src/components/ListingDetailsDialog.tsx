import { useState } from 'react'
import { MarketplaceListing, UserRating } from '@/lib/types'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Download,
  Star,
  MapPin,
  Image,
  Calendar,
  Globe,
} from '@phosphor-icons/react'

interface ListingDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  listing: MarketplaceListing | null
  userRating?: UserRating
  onInstall: (listing: MarketplaceListing) => void
  onRate?: (rating: number) => void
}

export function ListingDetailsDialog({
  open,
  onOpenChange,
  listing,
  userRating,
  onInstall,
  onRate,
}: ListingDetailsDialogProps) {
  const [hoveredRating, setHoveredRating] = useState(0)

  if (!listing) return null

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const handleRatingClick = (rating: number) => {
    if (onRate) {
      onRate(rating)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="w-10 h-10 border-2 border-accent/20">
              <AvatarImage src={listing.author.avatarUrl} />
              <AvatarFallback>{listing.author.login[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-lg truncate">{listing.name}</div>
              <div className="text-sm text-muted-foreground font-normal">
                by {listing.author.login}
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-6 pr-4">
            <div className="flex gap-3">
              <div className="flex-1 bg-muted rounded-lg p-4">
                <div className="flex items-center gap-2 text-primary mb-1">
                  <MapPin className="w-5 h-5" />
                  <span className="text-2xl font-bold">{listing.sourceCount}</span>
                </div>
                <div className="text-xs text-muted-foreground">Custom Sources</div>
              </div>
              <div className="flex-1 bg-muted rounded-lg p-4">
                <div className="flex items-center gap-2 text-primary mb-1">
                  <Image className="w-5 h-5" />
                  <span className="text-2xl font-bold">{listing.mapCount}</span>
                </div>
                <div className="text-xs text-muted-foreground">Uploaded Maps</div>
              </div>
              <div className="flex-1 bg-muted rounded-lg p-4">
                <div className="flex items-center gap-2 text-primary mb-1">
                  <Download className="w-5 h-5" />
                  <span className="text-2xl font-bold">{listing.downloads}</span>
                </div>
                <div className="text-xs text-muted-foreground">Downloads</div>
              </div>
            </div>

            {listing.description && (
              <div>
                <h3 className="font-semibold text-sm mb-2">Description</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {listing.description}
                </p>
              </div>
            )}

            <Separator />

            {listing.tags.length > 0 && (
              <div>
                <h3 className="font-semibold text-sm mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {listing.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="font-semibold text-sm mb-3">Included Sources</h3>
              <div className="space-y-2">
                {listing.collection.customSources.length > 0 ? (
                  listing.collection.customSources.map((source) => (
                    <div
                      key={source.id}
                      className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg border border-border"
                    >
                      <Globe className="w-5 h-5 text-primary mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{source.name}</div>
                        <div className="text-xs text-muted-foreground truncate mt-0.5">
                          {source.type.toUpperCase()} • {source.url}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-muted-foreground text-center py-4">
                    No custom sources included
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-sm mb-3">Included Maps</h3>
              <div className="space-y-2">
                {listing.collection.uploadedMaps.length > 0 ? (
                  listing.collection.uploadedMaps.map((map) => (
                    <div
                      key={map.id}
                      className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg border border-border"
                    >
                      <Image className="w-5 h-5 text-primary mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{map.name}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {map.fileName}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-muted-foreground text-center py-4">
                    No uploaded maps included
                  </div>
                )}
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                Published {formatDate(listing.publishedAt)}
              </div>
              {listing.ratingCount > 0 && (
                <div>
                  {listing.ratingCount} {listing.ratingCount === 1 ? 'rating' : 'ratings'}
                </div>
              )}
            </div>

            {onRate && (
              <div>
                <h3 className="font-semibold text-sm mb-2">
                  {userRating ? 'Your Rating' : 'Rate This Collection'}
                </h3>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => handleRatingClick(rating)}
                      onMouseEnter={() => setHoveredRating(rating)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="transition-transform hover:scale-110"
                      aria-label={`Rate ${rating} star${rating !== 1 ? 's' : ''}`}
                    >
                      <Star
                        className="w-6 h-6"
                        weight={
                          rating <= (hoveredRating || userRating?.rating || 0)
                            ? 'fill'
                            : 'regular'
                        }
                        color={
                          rating <= (hoveredRating || userRating?.rating || 0)
                            ? 'oklch(0.72 0.15 80)'
                            : 'oklch(0.50 0.02 35)'
                        }
                      />
                    </button>
                  ))}
                  {userRating && (
                    <span className="ml-2 text-sm text-muted-foreground">
                      You rated {userRating.rating} stars
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button onClick={() => onInstall(listing)}>
            <Download className="w-4 h-4 mr-2" />
            Install Collection
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
