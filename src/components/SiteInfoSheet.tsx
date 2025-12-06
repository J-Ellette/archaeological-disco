import { ArchaeologicalSite } from '@/lib/types'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { MapPin, Calendar, Compass } from '@phosphor-icons/react'
import { formatCoordinate } from '@/lib/geo-utils'

interface SiteInfoSheetProps {
  site: ArchaeologicalSite | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const typeLabels: Record<string, string> = {
  settlement: 'Settlement',
  burial: 'Burial Site',
  monument: 'Monument',
  temple: 'Temple',
  fortress: 'Fortress',
  artifact: 'Artifact Location'
}

const significanceColors: Record<string, string> = {
  high: 'bg-accent text-accent-foreground',
  medium: 'bg-secondary text-secondary-foreground',
  low: 'bg-muted text-muted-foreground'
}

export function SiteInfoSheet({ site, open, onOpenChange }: SiteInfoSheetProps) {
  if (!site) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold">{site.name}</SheetTitle>
          <SheetDescription className="flex gap-2 flex-wrap pt-2">
            <Badge variant="outline">{typeLabels[site.type]}</Badge>
            <Badge className={significanceColors[site.significance]}>
              {site.significance.toUpperCase()} SIGNIFICANCE
            </Badge>
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-2">
              Description
            </h3>
            <p className="site-description">{site.description}</p>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <div className="text-sm font-medium text-muted-foreground">Period</div>
                <div className="text-base font-semibold">{site.period}</div>
              </div>
            </div>

            {site.discovered && (
              <div className="flex items-start gap-3">
                <Compass className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Discovered</div>
                  <div className="text-base font-semibold">{site.discovered}</div>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <div className="text-sm font-medium text-muted-foreground">Coordinates</div>
                <div className="text-base font-mono">{formatCoordinate(site.lat, site.lng)}</div>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
