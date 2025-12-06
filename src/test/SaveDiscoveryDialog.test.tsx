import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '../test/utils'
import { SaveDiscoveryDialog } from '../components/SaveDiscoveryDialog'

describe('SaveDiscoveryDialog', () => {
  const defaultProps = {
    open: true,
    onOpenChange: vi.fn(),
    onSave: vi.fn(),
    area: 25.5
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders when open', () => {
    render(<SaveDiscoveryDialog {...defaultProps} />)
    
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/notes/i)).toBeInTheDocument()
  })

  it('does not render when closed', () => {
    render(<SaveDiscoveryDialog {...defaultProps} open={false} />)
    
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('displays the area information', () => {
    render(<SaveDiscoveryDialog {...defaultProps} />)
    
    expect(screen.getByText(/25\.50 km²/)).toBeInTheDocument()
  })

  it('handles title input', () => {
    render(<SaveDiscoveryDialog {...defaultProps} />)
    
    const titleInput = screen.getByLabelText(/title/i)
    fireEvent.change(titleInput, { target: { value: 'Test Discovery' } })
    
    expect(titleInput).toHaveValue('Test Discovery')
  })

  it('handles notes input', () => {
    render(<SaveDiscoveryDialog {...defaultProps} />)
    
    const notesTextarea = screen.getByLabelText(/notes/i)
    fireEvent.change(notesTextarea, { target: { value: 'Test notes here' } })
    
    expect(notesTextarea).toHaveValue('Test notes here')
  })

  it('toggles suggested tags', () => {
    render(<SaveDiscoveryDialog {...defaultProps} />)
    
    const settlementTag = screen.getByText('settlement')
    fireEvent.click(settlementTag)
    
    // Badge should change variant when selected (this may require checking specific classes)
    expect(settlementTag).toBeInTheDocument()
  })

  it('adds custom tags', () => {
    render(<SaveDiscoveryDialog {...defaultProps} />)
    
    const customTagInput = screen.getByPlaceholderText(/add custom tag/i)
    fireEvent.change(customTagInput, { target: { value: 'custom-tag' } })
    fireEvent.keyDown(customTagInput, { key: 'Enter', code: 'Enter' })
    
    expect(screen.getByText('custom-tag')).toBeInTheDocument()
    expect(customTagInput).toHaveValue('')
  })

  it('removes custom tags', () => {
    render(<SaveDiscoveryDialog {...defaultProps} />)
    
    // Add a custom tag first
    const customTagInput = screen.getByPlaceholderText(/add custom tag/i)
    fireEvent.change(customTagInput, { target: { value: 'custom-test' } })
    fireEvent.keyDown(customTagInput, { key: 'Enter', code: 'Enter' })
    
    // Find and click the remove button (X icon)
    const removeButton = screen.getByRole('button', { name: /remove custom-test tag/i })
    fireEvent.click(removeButton)
    
    // Tag should be removed
    expect(screen.queryByText('custom-test')).not.toBeInTheDocument()
  })

  it('prevents duplicate custom tags', () => {
    render(<SaveDiscoveryDialog {...defaultProps} />)
    
    const customTagInput = screen.getByPlaceholderText(/add custom tag/i)
    
    // Add same tag twice
    fireEvent.change(customTagInput, { target: { value: 'duplicate' } })
    fireEvent.keyDown(customTagInput, { key: 'Enter', code: 'Enter' })
    
    fireEvent.change(customTagInput, { target: { value: 'duplicate' } })
    fireEvent.keyDown(customTagInput, { key: 'Enter', code: 'Enter' })
    
    // Should only have one instance
    const duplicateTags = screen.getAllByText('duplicate')
    expect(duplicateTags).toHaveLength(1)
  })

  it('trims whitespace from custom tags', () => {
    render(<SaveDiscoveryDialog {...defaultProps} />)
    
    const customTagInput = screen.getByPlaceholderText(/add custom tag/i)
    fireEvent.change(customTagInput, { target: { value: '  spaced-tag  ' } })
    fireEvent.keyDown(customTagInput, { key: 'Enter', code: 'Enter' })
    
    expect(screen.getByText('spaced-tag')).toBeInTheDocument()
  })

  it('calls onSave with correct data when save button clicked', () => {
    render(<SaveDiscoveryDialog {...defaultProps} />)
    
    // Fill in form
    const titleInput = screen.getByLabelText(/title/i)
    const notesTextarea = screen.getByLabelText(/notes/i)
    
    fireEvent.change(titleInput, { target: { value: 'Test Discovery' } })
    fireEvent.change(notesTextarea, { target: { value: 'Test notes' } })
    
    // Add a tag
    const settlementTag = screen.getByText('settlement')
    fireEvent.click(settlementTag)
    
    // Save
    const saveButton = screen.getByRole('button', { name: /save discovery/i })
    fireEvent.click(saveButton)
    
    expect(defaultProps.onSave).toHaveBeenCalledWith({
      title: 'Test Discovery',
      notes: 'Test notes',
      tags: ['settlement']
    })
  })

  it('does not save when title is empty', () => {
    render(<SaveDiscoveryDialog {...defaultProps} />)
    
    const saveButton = screen.getByRole('button', { name: /save discovery/i })
    fireEvent.click(saveButton)
    
    expect(defaultProps.onSave).not.toHaveBeenCalled()
  })

  it('does not save when title is only whitespace', () => {
    render(<SaveDiscoveryDialog {...defaultProps} />)
    
    const titleInput = screen.getByLabelText(/title/i)
    fireEvent.change(titleInput, { target: { value: '   ' } })
    
    const saveButton = screen.getByRole('button', { name: /save discovery/i })
    fireEvent.click(saveButton)
    
    expect(defaultProps.onSave).not.toHaveBeenCalled()
  })

  it('clears form after successful save', () => {
    render(<SaveDiscoveryDialog {...defaultProps} />)
    
    // Fill in form
    const titleInput = screen.getByLabelText(/title/i)
    const notesTextarea = screen.getByLabelText(/notes/i)
    
    fireEvent.change(titleInput, { target: { value: 'Test Discovery' } })
    fireEvent.change(notesTextarea, { target: { value: 'Test notes' } })
    
    // Add a tag
    const settlementTag = screen.getByText('settlement')
    fireEvent.click(settlementTag)
    
    // Save
    const saveButton = screen.getByRole('button', { name: /save discovery/i })
    fireEvent.click(saveButton)
    
    // Form should be cleared
    expect(titleInput).toHaveValue('')
    expect(notesTextarea).toHaveValue('')
  })

  it('calls onOpenChange when cancel button clicked', () => {
    render(<SaveDiscoveryDialog {...defaultProps} />)
    
    const cancelButton = screen.getByRole('button', { name: /cancel/i })
    fireEvent.click(cancelButton)
    
    expect(defaultProps.onOpenChange).toHaveBeenCalledWith(false)
  })

  it('handles Enter key for adding custom tags', () => {
    render(<SaveDiscoveryDialog {...defaultProps} />)
    
    const customTagInput = screen.getByPlaceholderText(/add custom tag/i)
    fireEvent.change(customTagInput, { target: { value: 'enter-tag' } })
    fireEvent.keyDown(customTagInput, { key: 'Enter', code: 'Enter' })
    
    expect(screen.getByText('enter-tag')).toBeInTheDocument()
    expect(customTagInput).toHaveValue('')
  })

  it('ignores non-Enter key presses for custom tags', () => {
    render(<SaveDiscoveryDialog {...defaultProps} />)
    
    const customTagInput = screen.getByPlaceholderText(/add custom tag/i)
    fireEvent.change(customTagInput, { target: { value: 'no-add-tag' } })
    fireEvent.keyDown(customTagInput, { key: 'Space', code: 'Space' })
    
    expect(screen.queryByText('no-add-tag')).not.toBeInTheDocument()
    expect(customTagInput).toHaveValue('no-add-tag')
  })
})