import { useState, useMemo } from 'react'
import { MarketplaceListing } from '@/lib/types'
import { searchListings, sortListings, getPopularTags } from '@/lib/marketplace-utils'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  MagnifyingGlass,
  Download,
  Star,
  MapPin,
  Image,
  X,
  Sparkle,
  TrendUp,
  Clock,
} from '@phosphor-icons/react'

interface MarketplaceSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  listings: MarketplaceListing[]
  onInstall: (listing: MarketplaceListing) => void
  onViewDetails: (listing: MarketplaceListing) => void
}

export function MarketplaceSheet({
  open,
  onOpenChange,
  listings,
  onInstall,
  onViewDetails,
}: MarketplaceSheetProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'rating' | 'downloads'>('popular')
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const popularTags = useMemo(() => getPopularTags(listings), [listings])

  const filteredListings = useMemo(() => {
    const searched = searchListings(listings, searchQuery, {
      tags: selectedTags.length > 0 ? selectedTags : undefined,
    })
    return sortListings(searched, sortBy)
  }, [listings, searchQuery, selectedTags, sortBy])

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedTags([])
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Sparkle className="w-5 h-5 text-accent" weight="fill" />
            Collection Marketplace
          </SheetTitle>
          <SheetDescription>
            Browse and install map collections shared by other users
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search collections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">
                  <div className="flex items-center gap-2">
                    <TrendUp className="w-4 h-4" />
                    Popular
                  </div>
                </SelectItem>
                <SelectItem value="newest">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Newest
                  </div>
                </SelectItem>
                <SelectItem value="rating">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    Rating
                  </div>
                </SelectItem>
                <SelectItem value="downloads">
                  <div className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Downloads
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {popularTags.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Popular Tags</div>
                {selectedTags.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="h-7 text-xs">
                    Clear filters
                  </Button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                    className="cursor-pointer hover:bg-accent/10 transition-colors"
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <Separator />

          <ScrollArea className="h-[calc(100vh-340px)]">
            {filteredListings.length === 0 ? (
              <div className="text-center py-12">
                <Sparkle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <div className="text-sm text-muted-foreground">
                  {listings.length === 0
                    ? 'No collections published yet. Be the first!'
                    : 'No collections match your search.'}
                </div>
              </div>
            ) : (
              <div className="space-y-4 pr-4">
                {filteredListings.map((listing) => (
                  <div
                    key={listing.id}
                    className="border border-border rounded-lg p-4 hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="w-10 h-10 border-2 border-accent/20">
                        <AvatarImage src={listing.author.avatarUrl} />
                        <AvatarFallback>{listing.author.login[0].toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-base truncate">{listing.name}</h3>
                            <div className="text-xs text-muted-foreground">
                              by {listing.author.login}
                            </div>
                          </div>
                          {listing.rating > 0 && (
                            <div className="flex items-center gap-1 text-accent">
                              <Star weight="fill" className="w-4 h-4" />
                              <span className="text-sm font-medium">
                                {listing.rating.toFixed(1)}
                              </span>
                            </div>
                          )}
                        </div>

                        {listing.description && (
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                            {listing.description}
                          </p>
                        )}

                        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {listing.sourceCount} sources
                          </div>
                          <div className="flex items-center gap-1">
                            <Image className="w-4 h-4" />
                            {listing.mapCount} maps
                          </div>
                          <div className="flex items-center gap-1">
                            <Download className="w-4 h-4" />
                            {listing.downloads}
                          </div>
                        </div>

                        {listing.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {listing.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {listing.tags.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{listing.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}

                        <div className="flex gap-2 mt-4">
                          <Button
                            size="sm"
                            onClick={() => onInstall(listing)}
                            className="flex-1"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Install
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onViewDetails(listing)}
                          >
                            Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  )
}
