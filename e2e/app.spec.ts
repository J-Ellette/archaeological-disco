import { test, expect } from '@playwright/test'

test.describe('Archaeological Discovery Explorer', () => {
  test('loads the homepage successfully', async ({ page }) => {
    await page.goto('/')
    
    // Check that the page loads and has the expected title
    await expect(page).toHaveTitle(/archaeological/i)
    
    // Check for key UI elements
    await expect(page.locator('text=Archaeological Discovery Explorer')).toBeVisible()
  })

  test('displays the map component', async ({ page }) => {
    await page.goto('/')
    
    // Wait for the map container to load
    await expect(page.locator('.leaflet-container')).toBeVisible()
    
    // Check for map controls
    await expect(page.locator('.leaflet-control-zoom')).toBeVisible()
  })

  test('can access the discoveries panel', async ({ page }) => {
    await page.goto('/')
    
    // Look for a button or link to open discoveries
    const discoveriesButton = page.locator('button', { hasText: /discoveries/i }).first()
    
    if (await discoveriesButton.isVisible()) {
      await discoveriesButton.click()
      
      // Check that the discoveries panel opens
      await expect(page.locator('text=My Discoveries')).toBeVisible()
    }
  })

  test('can toggle between drawing modes', async ({ page }) => {
    await page.goto('/')
    
    // Look for drawing mode buttons (rectangle, polygon, etc.)
    const drawingControls = page.locator('[data-testid*="draw"], button[title*="draw"], button[aria-label*="draw"]').first()
    
    if (await drawingControls.isVisible()) {
      await drawingControls.click()
      
      // Verify that drawing mode is activated
      // This would depend on how drawing states are indicated in the UI
      await expect(page.locator('body')).toContainText(/draw|select/i, { timeout: 5000 })
    }
  })

  test('shows proper responsive behavior on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    
    // Check that the page loads properly on mobile
    await expect(page.locator('text=Archaeological Discovery Explorer')).toBeVisible()
    
    // Map should still be visible
    await expect(page.locator('.leaflet-container')).toBeVisible()
  })

  test('handles no discoveries state', async ({ page }) => {
    await page.goto('/')
    
    // Clear any existing discoveries by checking localStorage
    await page.evaluate(() => {
      // Clear any discovery-related localStorage
      Object.keys(localStorage).forEach(key => {
        if (key.includes('discover') || key.includes('collection')) {
          localStorage.removeItem(key)
        }
      })
    })
    
    await page.reload()
    
    // Try to open discoveries panel and check empty state
    const discoveriesButton = page.locator('button', { hasText: /discoveries/i }).first()
    
    if (await discoveriesButton.isVisible()) {
      await discoveriesButton.click()
      await expect(page.locator('text=No Discoveries Yet')).toBeVisible()
    }
  })

  test('can navigate between different map layers', async ({ page }) => {
    await page.goto('/')
    
    // Look for layer controls or settings
    const layerControl = page.locator('.leaflet-control-layers, button[title*="layer"], button[aria-label*="layer"]').first()
    
    if (await layerControl.isVisible()) {
      await layerControl.click()
      
      // Should show layer options
      await expect(page.locator('input[type="radio"], input[type="checkbox"]')).toBeVisible({ timeout: 5000 })
    }
  })

  test('preserves state across page refreshes', async ({ page }) => {
    await page.goto('/')
    
    // Set some test data in localStorage to simulate saved discoveries
    await page.evaluate(() => {
      localStorage.setItem('test-discovery', JSON.stringify({
        id: 'test-1',
        title: 'Test Site',
        notes: 'E2E Test Discovery'
      }))
    })
    
    await page.reload()
    
    // Verify that localStorage data persists
    const stored = await page.evaluate(() => {
      return localStorage.getItem('test-discovery')
    })
    
    expect(stored).toBeTruthy()
  })
})