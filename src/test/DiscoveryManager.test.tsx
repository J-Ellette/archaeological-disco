import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '../test/utils'
import { DiscoveryManager } from '../components/DiscoveryManager'
import { Discovery } from '../lib/types'

// Mock date-fns format function
vi.mock('date-fns', () => ({
  format: vi.fn((_date: number, _formatStr: string) => {
    return '2024-01-15' // Mock formatted date
  })
}))

describe('DiscoveryManager', () => {
  const mockDiscovery: Discovery = {
    id: 'test-discovery-1',
    title: 'Test Archaeological Site',
    notes: 'This is a test discovery with detailed notes about the findings.',
    tags: ['settlement', 'Roman', 'pottery'],
    bounds: {
      north: 51.51,
      south: 51.50,
      east: -0.12,
      west: -0.13
    },
    area: 25.5,
    createdAt: Date.now(),
    updatedAt: Date.now()
  }

  const defaultProps = {
    discoveries: [mockDiscovery],
    open: true,
    onOpenChange: vi.fn(),
    onDelete: vi.fn(),
    onSelect: vi.fn()
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders when open', () => {
    render(<DiscoveryManager {...defaultProps} />)
    
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('My Discoveries')).toBeInTheDocument()
  })

  it('does not render when closed', () => {
    render(<DiscoveryManager {...defaultProps} open={false} />)
    
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('shows empty state when no discoveries', () => {
    render(<DiscoveryManager {...defaultProps} discoveries={[]} />)
    
    expect(screen.getByText('No Discoveries Yet')).toBeInTheDocument()
    expect(screen.getByText(/Start exploring the map and draw Areas of Interest/)).toBeInTheDocument()
  })

  it('displays discovery information correctly', () => {
    render(<DiscoveryManager {...defaultProps} />)
    
    // Check title
    expect(screen.getByText('Test Archaeological Site')).toBeInTheDocument()
    
    // Check notes
    expect(screen.getByText(/This is a test discovery with detailed notes/)).toBeInTheDocument()
    
    // Check tags
    expect(screen.getByText('settlement')).toBeInTheDocument()
    expect(screen.getByText('Roman')).toBeInTheDocument()
    expect(screen.getByText('pottery')).toBeInTheDocument()
    
    // Check formatted date
    expect(screen.getByText('2024-01-15')).toBeInTheDocument()
  })

  it('displays formatted area', () => {
    render(<DiscoveryManager {...defaultProps} />)
    
    // Area should be formatted (25.5 km²)
    expect(screen.getByText('25.50 km²')).toBeInTheDocument()
  })

  it('displays formatted coordinates', () => {
    render(<DiscoveryManager {...defaultProps} />)
    
    // Should show the center coordinates formatted
    // Center lat: (51.51 + 51.50) / 2 = 51.505
    // Center lng: (-0.12 + -0.13) / 2 = -0.125
    expect(screen.getByText('51.5050°N, 0.1250°W')).toBeInTheDocument()
  })

  it('calls onSelect when discovery card is clicked', () => {
    render(<DiscoveryManager {...defaultProps} />)
    
    const discoveryButton = screen.getByRole('button', { name: /test archaeological site/i })
    fireEvent.click(discoveryButton)
    
    expect(defaultProps.onSelect).toHaveBeenCalledWith(mockDiscovery)
  })

  it('calls onDelete when delete button is clicked', () => {
    render(<DiscoveryManager {...defaultProps} />)
    
    // Find delete button by the trash icon (since button has no accessible name)
    const deleteButton = screen.getByRole('button', { name: '' })
    fireEvent.click(deleteButton)
    
    expect(defaultProps.onDelete).toHaveBeenCalledWith(mockDiscovery.id)
  })

  it('handles discovery without notes', () => {
    const discoveryWithoutNotes = {
      ...mockDiscovery,
      notes: ''
    }
    
    render(<DiscoveryManager {...defaultProps} discoveries={[discoveryWithoutNotes]} />)
    
    expect(screen.getByText('Test Archaeological Site')).toBeInTheDocument()
    // Notes section should not be displayed
    expect(screen.queryByText(/This is a test discovery/)).not.toBeInTheDocument()
  })

  it('handles discovery with empty tags array', () => {
    const discoveryWithoutTags = {
      ...mockDiscovery,
      tags: []
    }
    
    render(<DiscoveryManager {...defaultProps} discoveries={[discoveryWithoutTags]} />)
    
    expect(screen.getByText('Test Archaeological Site')).toBeInTheDocument()
    // No tags should be displayed
    expect(screen.queryByText('settlement')).not.toBeInTheDocument()
  })

  it('renders multiple discoveries', () => {
    const secondDiscovery: Discovery = {
      id: 'test-discovery-2',
      title: 'Second Discovery',
      notes: 'Another archaeological finding',
      tags: ['burial', 'medieval'],
      bounds: {
        north: 52.51,
        south: 52.50,
        east: -1.12,
        west: -1.13
      },
      area: 10.2,
      createdAt: Date.now(),
      updatedAt: Date.now()
    }

    render(<DiscoveryManager {...defaultProps} discoveries={[mockDiscovery, secondDiscovery]} />)
    
    expect(screen.getByText('Test Archaeological Site')).toBeInTheDocument()
    expect(screen.getByText('Second Discovery')).toBeInTheDocument()
    expect(screen.getByText('burial')).toBeInTheDocument()
    expect(screen.getByText('medieval')).toBeInTheDocument()
  })

  it('applies hover effects to discovery cards', () => {
    render(<DiscoveryManager {...defaultProps} />)
    
    const card = screen.getByText('Test Archaeological Site').closest('.p-4')
    expect(card).toHaveClass('hover:shadow-md', 'transition-shadow')
  })

  it('shows proper delete button styling', () => {
    render(<DiscoveryManager {...defaultProps} />)
    
    // Find delete button by the empty name (trash icon button)
    const deleteButton = screen.getByRole('button', { name: '' })
    expect(deleteButton).toHaveClass('text-destructive', 'hover:text-destructive')
  })

  it('handles very long notes with line clamping', () => {
    const discoveryWithLongNotes = {
      ...mockDiscovery,
      notes: 'This is a very long note that should be clamped to two lines in the UI to prevent the card from becoming too large and maintain a clean layout throughout the discoveries list.'
    }
    
    render(<DiscoveryManager {...defaultProps} discoveries={[discoveryWithLongNotes]} />)
    
    const notesElement = screen.getByText(/This is a very long note that should be clamped/)
    expect(notesElement).toHaveClass('line-clamp-2')
  })

  it('renders with correct sheet properties', () => {
    render(<DiscoveryManager {...defaultProps} />)
    
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveClass('overflow-y-auto')
    expect(dialog).toHaveClass('sm:max-w-2xl')
  })

  it('shows area icon with area value', () => {
    render(<DiscoveryManager {...defaultProps} />)
    
    // The MapPin icon should be associated with the area value
    const areaText = screen.getByText('25.50 km²')
    expect(areaText.parentElement).toBeInTheDocument()
  })

  it('shows calendar icon with date value', () => {
    render(<DiscoveryManager {...defaultProps} />)
    
    // The Calendar icon should be associated with the date value
    const dateText = screen.getByText('2024-01-15')
    expect(dateText.parentElement).toBeInTheDocument()
  })
})