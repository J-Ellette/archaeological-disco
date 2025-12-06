# Archaeological Discovery Explorer

An interactive web application for exploring archaeological sites and discoveries through satellite imagery, elevation data visualization, and area-of-interest selection for potential archaeological features.

**Experience Qualities**:

1. **Exploratory** - Users should feel like discoverers, freely navigating maps and uncovering hidden archaeological patterns through interactive visualization tools.
2. **Scientific** - The interface should convey precision and data-driven insights with technical overlays, measurement tools, and analytical visualization modes.
3. **Immersive** - Rich map interactions, smooth transitions, and layered data visualizations should create an engaging exploration experience.

**Complexity Level**: Light Application (multiple features with basic state)
This app provides interactive mapping with drawing tools, layer management, site data visualization, and saved discoveries - multiple coordinated features with persistent state but not requiring complex backend processing.

## Essential Features

### Interactive Map with AOI Drawing

- **Functionality**: Leaflet-based map allowing users to draw rectangles and polygons to define Areas of Interest (AOI)
- **Purpose**: Enable precise geographic selection for archaeological feature analysis
- **Trigger**: User clicks "Draw AOI" button or selects drawing tool from toolbar
- **Progression**: User clicks Draw Tool → Cursor changes to crosshair → User draws shape on map → Shape appears with measurements → User can edit/delete shape → Shape is saved to discoveries
- **Success criteria**: AOI shapes persist across sessions, show area calculations, and can be edited or removed

### Multi-Layer Visualization

- **Functionality**: Toggle between satellite imagery, topographic maps, terrain visualization, LiDAR, and custom map sources; upload georeferenced map images as overlays
- **Purpose**: Reveal different landscape features that might indicate archaeological sites and allow use of specialized datasets
- **Trigger**: User selects layer from layer control panel or clicks Layers button to manage custom sources
- **Progression**: User opens layer panel → Selects base layer or overlay → Map updates with transition → Multiple overlays can be combined → User can add custom tile servers or upload map images → Uploaded maps appear as toggleable overlays with opacity controls
- **Success criteria**: Smooth layer transitions, multiple simultaneous overlays, intuitive controls, custom sources persist across sessions

### Custom Map Sources

- **Functionality**: Add custom tile servers (XYZ), WMS services, or API endpoints as map layers; configure attribution, zoom levels, and other parameters
- **Purpose**: Enable use of specialized archaeological datasets, historical maps, or proprietary imagery sources
- **Trigger**: User clicks "Layers" button then "Add Custom Map Source"
- **Progression**: User opens layers manager → Clicks add source → Enters source details (name, type, URL, attribution) → Configures zoom levels → Saves source → Source appears in base layer list → Can be selected like built-in layers
- **Success criteria**: Custom sources work reliably, persist across sessions, can be edited or deleted, clear error handling for invalid URLs

### Map Image Upload

- **Functionality**: Upload georeferenced images (historical maps, survey imagery, etc.) with specified geographic bounds to overlay on the map
- **Purpose**: Allow users to work with custom imagery, historical maps, or specialized datasets not available via tile services
- **Trigger**: User clicks "Layers" button then "Upload Map Image"
- **Progression**: User opens layers manager → Clicks upload → Selects image file → Specifies geographic bounds (N/S/E/W coordinates) → Names the map → Uploads → Map appears in overlay list → User toggles overlay on/off → Overlay renders at correct geographic position
- **Success criteria**: Images upload reliably (max 10MB), overlays render at correct positions, multiple overlays can be active, overlays persist in browser storage

### Archaeological Site Database

- **Functionality**: Display known archaeological sites as markers on the map with detailed information panels
- **Purpose**: Provide context and reference points for exploration
- **Trigger**: Sites load automatically on map; user clicks marker for details
- **Progression**: Map loads with site markers → User clicks marker → Info panel slides in with site details → User can filter sites by type/period → User can toggle site visibility
- **Success criteria**: Markers are clearly visible, info panels are informative, filtering works instantly

### Elevation Analysis Tools

- **Functionality**: Show elevation profiles, slope analysis, and aspect visualization for selected areas
- **Purpose**: Identify terrain features that might indicate buried structures or earthworks
- **Trigger**: User selects analysis tool and clicks on map
- **Progression**: User selects "Elevation Profile" → Draws line on map → Profile graph appears → Shows elevation changes and statistics → User can export data
- **Success criteria**: Accurate elevation data, clear visualizations, responsive interactions

### Discovery Manager

- **Functionality**: Save AOIs, notes, and observations; organize discoveries into collections
- **Purpose**: Allow users to track and manage their archaeological exploration findings
- **Trigger**: User clicks "Save Discovery" after drawing AOI or adding notes
- **Progression**: User draws AOI → Clicks Save → Modal appears for details → User adds title/notes/tags → Saves to collection → Appears in discoveries list → Can review/edit later
- **Success criteria**: All discoveries persist across sessions, can be filtered and searched, exportable as GeoJSON

### Collection Marketplace
- **Functionality**: Publish map collections to a shared marketplace; browse, search, and install collections created by other users; rate and review collections
- **Purpose**: Enable community sharing of curated map sources, historical overlays, and specialized archaeological datasets
- **Trigger**: User clicks "Marketplace" button to browse; clicks "Publish" button to share their collection
- **Progression**: Browse: User opens marketplace → Searches/filters collections → Views listing details → Sees included sources/maps → Installs collection → Sources merge with existing data; Publish: User clicks publish → Names collection → Adds description/tags → Publishes to marketplace → Others can discover and install
- **Success criteria**: Marketplace browsing is smooth and responsive; search/filtering works accurately; published collections display author info; install process handles duplicates gracefully; ratings reflect user feedback

## Edge Case Handling

- **No GPS/Location**: App loads with default view of famous archaeological region (Angkor Wat area); users can navigate manually
- **Large AOIs**: Warn users when AOI exceeds reasonable processing size; suggest breaking into smaller areas
- **Overlapping Shapes**: Allow multiple overlapping AOIs with visual hierarchy and z-index management
- **Empty Discovery List**: Show inspiring welcome message with suggestions to explore famous sites
- **Slow Map Loading**: Display skeleton loaders for tiles; show progress indicator for data-heavy operations
- **Invalid Coordinates**: Validate coordinate inputs and provide helpful error messages with format examples
- **Export Failures**: Provide retry mechanism and fallback to clipboard copy for data export
- **Large Image Files**: Limit uploads to 10MB; show clear error for oversized files with size information
- **Invalid Map Bounds**: Validate that north > south and east > west; provide helpful error messages with coordinate format examples
- **Missing Custom Source URLs**: Validate URL format before saving; test tile URLs when possible; show clear error states for unreachable sources
- **Custom Source Conflicts**: Allow multiple custom sources with same base URL but different parameters; clear naming to avoid confusion
- **Empty Marketplace**: Show encouraging message when no collections are published yet; invite users to be first
- **Marketplace Installation Conflicts**: Handle duplicate sources/maps gracefully with clear merge options and preview of what will be added
- **Rating Without Login**: Prompt users to authenticate before rating collections
- **Publishing Empty Collections**: Disable publish button when no custom sources or maps are available

## Design Direction

The design should evoke a sense of scientific discovery merged with ancient history - combining the precision of modern GIS tools with the mystique of archaeological exploration. The interface should feel like a professional research tool while remaining accessible and visually engaging. Think: modern cartography meets Indiana Jones, with earth tones, topographic patterns, and data-rich visualizations that feel both technical and adventurous.

## Color Selection

**Primary Color**: Deep Archaeological Terracotta (oklch(0.45 0.12 35)) - Evokes ancient pottery and earthenware, represents the earth and archaeological excavations; used for primary actions and key interactive elements.

**Secondary Colors**:

- Topographic Moss (oklch(0.55 0.10 140)) - Represents vegetation-covered ruins and terrain mapping; used for success states and terrain overlays
- Stone Gray (oklch(0.35 0.02 265)) - Represents ancient stone and archaeological structures; used for secondary UI elements and borders

**Accent Color**: Discovery Gold (oklch(0.72 0.15 80)) - Bright highlight reminiscent of treasure and important finds; used for CTAs, selected states, and active tools.

**Foreground/Background Pairings**:

- Background (Parchment Cream oklch(0.97 0.02 75)): Dark text (oklch(0.25 0.02 35)) - Ratio 12.1:1 ✓
- Primary (Terracotta oklch(0.45 0.12 35)): White text (oklch(1 0 0)) - Ratio 5.8:1 ✓
- Accent (Gold oklch(0.72 0.15 80)): Dark text (oklch(0.25 0.02 35)) - Ratio 6.9:1 ✓
- Card (Light Stone oklch(0.95 0.01 265)): Dark text (oklch(0.25 0.02 35)) - Ratio 13.5:1 ✓

## Font Selection

Typefaces should convey technical precision while maintaining readability for both data-heavy interfaces and narrative content about discoveries.

**Primary Font**: Space Grotesk - A geometric sans-serif with technical character that works well for UI elements, coordinates, and measurements
**Secondary Font**: Newsreader - An elegant serif for archaeological site descriptions and historical content, providing contrast and sophistication

**Typographic Hierarchy**:

- H1 (Page Title): Space Grotesk Bold/32px/tight tracking (-0.02em)
- H2 (Section Headers): Space Grotesk SemiBold/24px/normal tracking
- H3 (Card Titles): Space Grotesk Medium/18px/normal tracking
- Body (UI/Controls): Space Grotesk Regular/15px/normal tracking
- Body (Descriptions): Newsreader Regular/16px/relaxed leading (1.6)
- Caption (Coordinates/Data): Space Grotesk Regular/13px/tabular numbers
- Button: Space Grotesk Medium/14px/uppercase/wide tracking (0.05em)

## Animations

Animations should enhance the feeling of exploration and discovery while maintaining the precision expected of a scientific tool. Use smooth, purposeful animations for map interactions (panning, zooming), layer transitions (fade in/out with 400ms duration), and panel reveals (slide with elastic easing). Marker pops should have a subtle bounce to draw attention to new discoveries. Drawing tools should show real-time feedback with animated cursors and shape outlines. Keep animations restrained - this is a professional tool where function trumps flash, but moments of delight (like a subtle pulse when saving a discovery) reinforce positive actions.

## Component Selection

**Components**:

- **Card**: Site information panels, discovery cards, analysis result displays - elevated with subtle shadows and terracotta accent borders
- **Sheet**: Sliding panels for discovery manager and detailed site information - slides from right with backdrop
- **Dialog**: Modals for saving discoveries, confirming deletions, and data export options
- **Tabs**: Switch between map layers, analysis tools, and saved discoveries
- **Button**: Primary actions in terracotta, secondary in stone gray, ghost variants for tool toggles
- **Input/Textarea**: Coordinate entry, search, and note-taking with clear labels and helper text
- **Select**: Filter discoveries by type, period, or collection
- **Slider**: Adjust layer opacity, elevation exaggeration, and time-based visualizations
- **Badge**: Tag discoveries with categories (settlement, burial, monument, etc.)
- **Tooltip**: Show coordinates, elevation data, and tool descriptions on hover
- **Separator**: Divide sections in panels and toolbars with subtle stone-gray lines

**Customizations**:

- Custom map marker icons using Phosphor icons (MapPin, Compass, Cube for different site types)
- Custom drawing toolbar with archaeological-themed icons
- Topographic contour pattern background using CSS gradients for hero sections
- Custom scrollbar styling for panels to match terracotta theme

**States**:

- Buttons: Default with subtle shadow, hover lifts slightly, active state compresses, disabled at 40% opacity with cursor not-allowed
- Inputs: Default with stone border, focus shows terracotta ring with 2px width, error state with red ring and icon, success with moss green
- Tool toggles: Inactive ghost state, active with terracotta background and white icon, hover shows background preview

**Icon Selection**:

- MapPin for site markers, PushPin for saved locations
- CursorClick for draw tools, Selection for AOI operations
- Mountains for terrain layers, Globe for satellite
- ChartLine for elevation profiles, Ruler for measurements
- BookmarkSimple for saving discoveries, FolderOpen for collections
- Download for exports, MagnifyingGlass for search
- SlidersHorizontal for layer controls, Eye/EyeSlash for visibility toggles
- Stack for layers manager button
- Plus for adding new sources/uploads
- Upload for uploading map images and publishing collections
- Image for uploaded map overlays
- Trash for deleting sources and uploads
- Storefront for marketplace access
- Sparkle for marketplace highlights and featured collections
- Star for ratings
- TrendUp for popular/trending sort
- Clock for newest sort

**Spacing**:

- Panel padding: p-6 (24px) for main containers, p-4 (16px) for nested sections
- Card spacing: gap-4 between elements, gap-6 between cards in grid
- Form fields: gap-2 for label-input pairs, gap-4 between field groups
- Toolbar items: gap-2 for related tools, gap-4 for tool groups
- Map controls: Positioned with m-4 from edges, gap-3 between control clusters

**Mobile**:

- Stack toolbar vertically on left side instead of horizontal top bar
- Collapsible panels that slide from bottom on mobile (Sheet component)
- Larger touch targets (min 44px) for map controls and drawing tools
- Simplified layer control with expandable sections
- Single-column discovery list instead of grid
- Floating action button for quick draw access on mobile
- Map takes full viewport height with overlaid controls
