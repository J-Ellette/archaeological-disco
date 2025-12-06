import { MarketplaceListing, MapCollection, CustomMapSource } from './types'

const sampleAuthors = [
  {
    login: 'archaeology-institute',
    avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=AI&backgroundColor=45a049'
  },
  {
    login: 'heritage-mapper',
    avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=HM&backgroundColor=2196f3'
  },
  {
    login: 'ancient-world-gis',
    avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=AG&backgroundColor=ff9800'
  },
  {
    login: 'excavation-team',
    avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=ET&backgroundColor=9c27b0'
  },
  {
    login: 'digital-antiquity',
    avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=DA&backgroundColor=e91e63'
  }
]

function createCollection(
  name: string,
  description: string,
  sources: Omit<CustomMapSource, 'id' | 'createdAt'>[]
): MapCollection {
  const baseTime = Date.now() - Math.floor(Math.random() * 90 * 24 * 60 * 60 * 1000)
  
  return {
    id: `collection-${baseTime}-${Math.random().toString(36).substr(2, 9)}`,
    name,
    description,
    customSources: sources.map((source, idx) => ({
      ...source,
      id: `source-${baseTime + idx}`,
      createdAt: baseTime + idx * 1000
    })),
    uploadedMaps: [],
    createdAt: baseTime,
    exportedAt: baseTime,
    version: '1.0.0'
  }
}

export function generateSampleMarketplaceListings(): MarketplaceListing[] {
  const now = Date.now()
  const dayMs = 24 * 60 * 60 * 1000
  
  const collections: Array<{
    collection: MapCollection
    author: typeof sampleAuthors[number]
    tags: string[]
    downloads: number
    rating: number
    ratingCount: number
    daysAgo: number
  }> = [
    {
      collection: createCollection(
        'Roman Empire Historical Maps',
        'Comprehensive collection of Roman period mapping resources including the Digital Atlas of the Roman Empire and historical cartography layers.',
        [
          {
            name: 'Digital Atlas of Roman Empire',
            type: 'tile',
            url: 'https://dh.gu.se/tiles/imperium/{z}/{x}/{y}.png',
            attribution: '© Digital Atlas of the Roman Empire',
            maxZoom: 11,
            minZoom: 4
          },
          {
            name: 'Pleiades Ancient Places',
            type: 'tile',
            url: 'https://tiles.pelagios.org/data/{z}/{x}/{y}.png',
            attribution: '© Pleiades Gazetteer',
            maxZoom: 15,
            minZoom: 3
          },
          {
            name: 'Roman Roads Network',
            type: 'tile',
            url: 'https://api.mapbox.com/styles/v1/mapbox/light-v11/tiles/{z}/{x}/{y}?access_token=pk.example',
            attribution: '© OpenStreetMap contributors, Roman Roads overlay',
            maxZoom: 18
          }
        ]
      ),
      author: sampleAuthors[0],
      tags: ['roman', 'empire', 'ancient-world', 'roads', 'settlements'],
      downloads: 247,
      rating: 4.8,
      ratingCount: 42,
      daysAgo: 45
    },
    {
      collection: createCollection(
        'Ancient Egypt Satellite & Survey Maps',
        'High-resolution satellite imagery and archaeological survey data for major Egyptian sites including Giza, Luxor, and the Nile Delta.',
        [
          {
            name: 'Egypt Satellite Imagery',
            type: 'tile',
            url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            attribution: '© Esri World Imagery',
            maxZoom: 19,
            minZoom: 1
          },
          {
            name: 'Egyptian Archaeological Survey',
            type: 'wms',
            url: 'https://services.arcgisonline.com/arcgis/services/Egyptian_Sites/MapServer/WMSServer',
            attribution: '© Egyptian Ministry of Antiquities',
            maxZoom: 16
          },
          {
            name: 'Nile Delta Historical Mapping',
            type: 'tile',
            url: 'https://tiles.arcgis.com/tiles/nile-delta/MapServer/tile/{z}/{y}/{x}',
            attribution: '© Alexandria Archive Institute',
            maxZoom: 14,
            bounds: {
              north: 31.5,
              south: 29.5,
              east: 32.5,
              west: 30.0
            }
          }
        ]
      ),
      author: sampleAuthors[1],
      tags: ['egypt', 'satellite', 'survey', 'pyramids', 'nile'],
      downloads: 189,
      rating: 4.9,
      ratingCount: 35,
      daysAgo: 30
    },
    {
      collection: createCollection(
        'Mesopotamian Civilization Layers',
        'Curated mapping resources for Mesopotamian archaeological sites including Ur, Babylon, and Assyrian territories with topographic overlays.',
        [
          {
            name: 'Mesopotamia Base Map',
            type: 'tile',
            url: 'https://api.maptiler.com/maps/topo/{z}/{x}/{y}.png?key=example',
            attribution: '© MapTiler © OpenStreetMap contributors',
            maxZoom: 16
          },
          {
            name: 'Ancient Mesopotamian Cities WMS',
            type: 'wms',
            url: 'https://geoserver.example.org/mesopotamia/wms',
            attribution: '© Oriental Institute, University of Chicago',
            maxZoom: 15,
            bounds: {
              north: 37.0,
              south: 30.0,
              east: 48.0,
              west: 38.0
            }
          },
          {
            name: 'Cuneiform Tablet Findspots',
            type: 'tile',
            url: 'https://cdli.ucla.edu/tiles/findspots/{z}/{x}/{y}.png',
            attribution: '© Cuneiform Digital Library Initiative',
            maxZoom: 12
          }
        ]
      ),
      author: sampleAuthors[2],
      tags: ['mesopotamia', 'babylon', 'assyria', 'cuneiform', 'tigris-euphrates'],
      downloads: 156,
      rating: 4.7,
      ratingCount: 28,
      daysAgo: 60
    },
    {
      collection: createCollection(
        'Greek & Aegean World Maps',
        'Essential mapping resources for Classical Greek archaeology including the Aegean basin, major poleis, and sacred sites.',
        [
          {
            name: 'Ancient Greece Terrain',
            type: 'tile',
            url: 'https://tile.opentopomap.org/{z}/{x}/{y}.png',
            attribution: '© OpenTopoMap contributors',
            maxZoom: 17
          },
          {
            name: 'Greek Polis Locations',
            type: 'tile',
            url: 'https://awmc.unc.edu/tiles/greek-world/{z}/{x}/{y}.png',
            attribution: '© Ancient World Mapping Center',
            maxZoom: 13,
            bounds: {
              north: 42.0,
              south: 34.0,
              east: 30.0,
              west: 19.0
            }
          },
          {
            name: 'Mycenaean & Bronze Age Sites',
            type: 'wms',
            url: 'https://services.example.org/aegean/wms',
            attribution: '© American School of Classical Studies',
            maxZoom: 14
          }
        ]
      ),
      author: sampleAuthors[0],
      tags: ['greece', 'aegean', 'classical', 'bronze-age', 'mycenaean'],
      downloads: 203,
      rating: 4.6,
      ratingCount: 38,
      daysAgo: 22
    },
    {
      collection: createCollection(
        'Maya Civilization LiDAR & Survey Data',
        'Advanced LiDAR-derived datasets revealing Maya structures in dense jungle, including Tikal, Caracol, and El Mirador regions.',
        [
          {
            name: 'Maya LiDAR Canopy Penetration',
            type: 'tile',
            url: 'https://lidar.archaeology.org/maya/dtm/{z}/{x}/{y}.png',
            attribution: '© PACUNAM LiDAR Initiative',
            maxZoom: 16,
            bounds: {
              north: 18.0,
              south: 15.5,
              east: -88.5,
              west: -91.0
            }
          },
          {
            name: 'Peten Region Structures',
            type: 'tile',
            url: 'https://tiles.archaeology.org/maya-structures/{z}/{x}/{y}.png',
            attribution: '© University of Pennsylvania Museum',
            maxZoom: 17
          },
          {
            name: 'Maya Settlement Patterns WMS',
            type: 'wms',
            url: 'https://geoserver.example.org/maya/wms',
            attribution: '© Mesoamerican Research Center',
            maxZoom: 15
          }
        ]
      ),
      author: sampleAuthors[3],
      tags: ['maya', 'mesoamerica', 'lidar', 'jungle', 'guatemala'],
      downloads: 312,
      rating: 5.0,
      ratingCount: 67,
      daysAgo: 15
    },
    {
      collection: createCollection(
        'British Isles Prehistoric Monuments',
        'Comprehensive mapping of Neolithic and Bronze Age monuments across Britain and Ireland including stone circles, henges, and barrows.',
        [
          {
            name: 'UK Ordnance Survey Historic',
            type: 'tile',
            url: 'https://api.os.uk/maps/raster/v1/zxy/Outdoor_3857/{z}/{x}/{y}.png?key=example',
            attribution: '© Ordnance Survey',
            maxZoom: 16
          },
          {
            name: 'Prehistoric Monuments Database',
            type: 'wms',
            url: 'https://services.archaeology.uk/monuments/wms',
            attribution: '© Historic England, Cadw, HES',
            maxZoom: 15
          },
          {
            name: 'Megalithic Portal Sites',
            type: 'tile',
            url: 'https://tiles.megalithic.co.uk/sites/{z}/{x}/{y}.png',
            attribution: '© The Megalithic Portal',
            maxZoom: 14
          }
        ]
      ),
      author: sampleAuthors[1],
      tags: ['britain', 'neolithic', 'bronze-age', 'megaliths', 'stone-circles'],
      downloads: 178,
      rating: 4.5,
      ratingCount: 31,
      daysAgo: 38
    },
    {
      collection: createCollection(
        'Inca Trail & Andean Archaeology',
        'Specialized collection for Andean archaeology featuring Inca roads, terracing, and high-altitude sites from Peru to Chile.',
        [
          {
            name: 'Andes Elevation Model',
            type: 'tile',
            url: 'https://tiles.openterrainmap.org/andes/{z}/{x}/{y}.png',
            attribution: '© SRTM, ASTER GDEM',
            maxZoom: 14,
            bounds: {
              north: -8.0,
              south: -18.0,
              east: -68.0,
              west: -78.0
            }
          },
          {
            name: 'Qhapaq Ñan - Inca Road System',
            type: 'tile',
            url: 'https://tiles.unesco.org/qhapaq-nan/{z}/{x}/{y}.png',
            attribution: '© UNESCO World Heritage Centre',
            maxZoom: 15
          },
          {
            name: 'Andean Archaeological Sites',
            type: 'wms',
            url: 'https://geoservices.cultura.gob.pe/arcgis/services/inca/MapServer/WMSServer',
            attribution: '© Peruvian Ministry of Culture',
            maxZoom: 16
          }
        ]
      ),
      author: sampleAuthors[4],
      tags: ['inca', 'peru', 'andes', 'roads', 'terraces'],
      downloads: 134,
      rating: 4.8,
      ratingCount: 22,
      daysAgo: 52
    },
    {
      collection: createCollection(
        'Silk Road Trade Routes',
        'Historical mapping of Silk Road networks spanning from China through Central Asia to the Mediterranean.',
        [
          {
            name: 'Central Asia Terrain',
            type: 'tile',
            url: 'https://tile.opentopomap.org/{z}/{x}/{y}.png',
            attribution: '© OpenTopoMap',
            maxZoom: 15
          },
          {
            name: 'Silk Road Trade Routes',
            type: 'tile',
            url: 'https://tiles.silkroad.org/routes/{z}/{x}/{y}.png',
            attribution: '© Silk Road Foundation',
            maxZoom: 12
          },
          {
            name: 'Caravanserai & Trading Posts',
            type: 'wms',
            url: 'https://geoserver.example.org/silkroad/wms',
            attribution: '© Max van Berchem Foundation',
            maxZoom: 14
          }
        ]
      ),
      author: sampleAuthors[2],
      tags: ['silk-road', 'trade', 'central-asia', 'caravanserai', 'routes'],
      downloads: 167,
      rating: 4.7,
      ratingCount: 29,
      daysAgo: 41
    }
  ]

  return collections.map((item, index) => {
    const publishedAt = now - (item.daysAgo * dayMs)
    
    return {
      id: `listing-${publishedAt}-${index}`,
      collectionId: item.collection.id,
      name: item.collection.name,
      description: item.collection.description,
      author: item.author,
      tags: item.tags,
      sourceCount: item.collection.customSources.length,
      mapCount: item.collection.uploadedMaps.length,
      downloads: item.downloads,
      rating: item.rating,
      ratingCount: item.ratingCount,
      publishedAt,
      updatedAt: publishedAt,
      collection: item.collection
    }
  })
}
