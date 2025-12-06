import { Discovery } from '@/lib/types'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Trash, MapPin, Calendar as CalendarIcon } from '@phosphor-icons/react'
import { formatArea, formatCoordinate } from '@/lib/geo-utils'
import { format } from 'date-fns'

interface DiscoveryManagerProps {
  discoveries: Discovery[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onDelete: (id: string) => void
  onSelect: (discovery: Discovery) => void
}

export function DiscoveryManager({ discoveries, open, onOpenChange, onDelete, onSelect }: DiscoveryManagerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold">My Discoveries</SheetTitle>
        </SheetHeader>

        <div className="mt-6">
          {discoveries.length === 0 ? (
            <div className="text-center py-12">
              <MapPin className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Discoveries Yet</h3>
              <p className="text-muted-foreground max-w-sm mx-auto">
                Start exploring the map and draw Areas of Interest to save your archaeological discoveries.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {discoveries.map((discovery) => (
                <Card key={discovery.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-4">
                    <button
                      onClick={() => onSelect(discovery)}
                      className="flex-1 text-left space-y-3"
                    >
                      <div>
                        <h3 className="font-semibold text-lg mb-1">{discovery.title}</h3>
                        {discovery.notes && (
                          <p className="text-sm text-muted-foreground line-clamp-2">{discovery.notes}</p>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {discovery.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{formatArea(discovery.area)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="w-3.5 h-3.5" />
                          <span>{format(discovery.createdAt, 'MMM d, yyyy')}</span>
                        </div>
                      </div>

                      <div className="text-xs font-mono text-muted-foreground">
                        {formatCoordinate(
                          (discovery.bounds.north + discovery.bounds.south) / 2,
                          (discovery.bounds.east + discovery.bounds.west) / 2
                        )}
                      </div>
                    </button>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(discovery.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
