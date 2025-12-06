import { describe, it, expect } from 'vitest'
import {
  calculateAreaFromBounds,
  toRadians,
  formatArea,
  formatCoordinate
} from '../lib/geo-utils'

describe('geo-utils', () => {
  describe('toRadians', () => {
    it('should convert degrees to radians correctly', () => {
      expect(toRadians(0)).toBe(0)
      expect(toRadians(90)).toBeCloseTo(Math.PI / 2)
      expect(toRadians(180)).toBeCloseTo(Math.PI)
      expect(toRadians(360)).toBeCloseTo(2 * Math.PI)
    })

    it('should handle negative degrees', () => {
      expect(toRadians(-90)).toBeCloseTo(-Math.PI / 2)
      expect(toRadians(-180)).toBeCloseTo(-Math.PI)
    })
  })

  describe('calculateAreaFromBounds', () => {
    it('should calculate area for a small bounds correctly', () => {
      const bounds = {
        north: 51.51,
        south: 51.50,
        east: -0.12,
        west: -0.13
      }
      
      const area = calculateAreaFromBounds(bounds)
      expect(area).toBeGreaterThan(0)
      expect(area).toBeLessThan(5) // Should be a small area in km²
    })

    it('should calculate area for larger bounds', () => {
      const bounds = {
        north: 52.0,
        south: 51.0,
        east: 0.0,
        west: -1.0
      }
      
      const area = calculateAreaFromBounds(bounds)
      expect(area).toBeGreaterThan(1000) // Should be larger area in km²
      expect(area).toBeLessThan(10000) // Reasonable upper bound
    })

    it('should handle bounds crossing the equator', () => {
      const bounds = {
        north: 1.0,
        south: -1.0,
        east: 1.0,
        west: -1.0
      }
      
      const area = calculateAreaFromBounds(bounds)
      expect(area).toBeGreaterThan(0)
    })

    it('should return the same area for mirrored bounds', () => {
      const bounds1 = {
        north: 51.51,
        south: 51.50,
        east: -0.12,
        west: -0.13
      }
      
      const bounds2 = {
        north: -51.50,
        south: -51.51,
        east: 0.13,
        west: 0.12
      }
      
      const area1 = calculateAreaFromBounds(bounds1)
      const area2 = calculateAreaFromBounds(bounds2)
      
      // Areas should be very close (accounting for slight differences in latitude calculations)
      expect(Math.abs(area1 - area2)).toBeLessThan(0.1)
    })
  })

  describe('formatArea', () => {
    it('should format small areas in square meters', () => {
      expect(formatArea(0.001)).toBe('1000 m²')
      expect(formatArea(0.0005)).toBe('500 m²')
      expect(formatArea(0.0001)).toBe('100 m²')
    })

    it('should format large areas in square kilometers', () => {
      expect(formatArea(1)).toBe('1.00 km²')
      expect(formatArea(1.5)).toBe('1.50 km²')
      expect(formatArea(100)).toBe('100.00 km²')
      expect(formatArea(1000.567)).toBe('1000.57 km²')
    })

    it('should handle edge case at 1 km²', () => {
      expect(formatArea(0.999)).toBe('999000 m²')
      expect(formatArea(1.0)).toBe('1.00 km²')
      expect(formatArea(1.001)).toBe('1.00 km²')
    })
  })

  describe('formatCoordinate', () => {
    it('should format positive coordinates correctly', () => {
      expect(formatCoordinate(51.5074, -0.1278)).toBe('51.5074°N, 0.1278°W')
      expect(formatCoordinate(40.7128, -74.0060)).toBe('40.7128°N, 74.0060°W')
    })

    it('should format negative coordinates correctly', () => {
      expect(formatCoordinate(-33.8688, 151.2093)).toBe('33.8688°S, 151.2093°E')
      expect(formatCoordinate(-25.7479, -80.2614)).toBe('25.7479°S, 80.2614°W')
    })

    it('should handle zero coordinates', () => {
      expect(formatCoordinate(0, 0)).toBe('0.0000°N, 0.0000°E')
      expect(formatCoordinate(0, -180)).toBe('0.0000°N, 180.0000°W')
      expect(formatCoordinate(-90, 0)).toBe('90.0000°S, 0.0000°E')
    })

    it('should handle extreme coordinates', () => {
      expect(formatCoordinate(90, 180)).toBe('90.0000°N, 180.0000°E')
      expect(formatCoordinate(-90, -180)).toBe('90.0000°S, 180.0000°W')
    })

    it('should round to 4 decimal places', () => {
      expect(formatCoordinate(51.507444444, -0.127888888)).toBe('51.5074°N, 0.1279°W')
    })
  })
})