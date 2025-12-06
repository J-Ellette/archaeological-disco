import { MarketplaceListing, MapCollection, UserRating } from './types'

export async function createMarketplaceListing(
  collection: MapCollection,
  author: { login: string; avatarUrl: string },
  tags: string[]
): Promise<MarketplaceListing> {
  const now = Date.now()
  
  return {
    id: `listing-${now}-${Math.random().toString(36).substr(2, 9)}`,
    collectionId: collection.id,
    name: collection.name,
    description: collection.description,
    author,
    tags,
    sourceCount: collection.customSources.length,
    mapCount: collection.uploadedMaps.length,
    downloads: 0,
    rating: 0,
    ratingCount: 0,
    publishedAt: now,
    updatedAt: now,
    collection
  }
}

export function calculateAverageRating(ratings: UserRating[]): { average: number; count: number } {
  if (ratings.length === 0) {
    return { average: 0, count: 0 }
  }
  
  const sum = ratings.reduce((acc, r) => acc + r.rating, 0)
  return {
    average: sum / ratings.length,
    count: ratings.length
  }
}

export function searchListings(
  listings: MarketplaceListing[],
  query: string,
  filters?: {
    tags?: string[]
    minRating?: number
    hasCustomSources?: boolean
    hasUploadedMaps?: boolean
  }
): MarketplaceListing[] {
  let results = [...listings]
  
  if (query.trim()) {
    const lowerQuery = query.toLowerCase()
    results = results.filter(
      (listing) =>
        listing.name.toLowerCase().includes(lowerQuery) ||
        listing.description?.toLowerCase().includes(lowerQuery) ||
        listing.author.login.toLowerCase().includes(lowerQuery)
    )
  }
  
  if (filters?.tags && filters.tags.length > 0) {
    results = results.filter((listing) =>
      filters.tags!.some((tag) => listing.tags.includes(tag))
    )
  }
  
  if (filters?.minRating) {
    results = results.filter((listing) => listing.rating >= filters.minRating!)
  }
  
  if (filters?.hasCustomSources) {
    results = results.filter((listing) => listing.sourceCount > 0)
  }
  
  if (filters?.hasUploadedMaps) {
    results = results.filter((listing) => listing.mapCount > 0)
  }
  
  return results
}

export function sortListings(
  listings: MarketplaceListing[],
  sortBy: 'newest' | 'popular' | 'rating' | 'downloads'
): MarketplaceListing[] {
  const sorted = [...listings]
  
  switch (sortBy) {
    case 'newest':
      return sorted.sort((a, b) => b.publishedAt - a.publishedAt)
    case 'popular':
      return sorted.sort((a, b) => b.downloads - a.downloads)
    case 'rating':
      return sorted.sort((a, b) => {
        if (b.rating !== a.rating) {
          return b.rating - a.rating
        }
        return b.ratingCount - a.ratingCount
      })
    case 'downloads':
      return sorted.sort((a, b) => b.downloads - a.downloads)
    default:
      return sorted
  }
}

export function getPopularTags(listings: MarketplaceListing[], limit: number = 10): string[] {
  const tagCounts = new Map<string, number>()
  
  listings.forEach((listing) => {
    listing.tags.forEach((tag) => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1)
    })
  })
  
  return Array.from(tagCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([tag]) => tag)
}
