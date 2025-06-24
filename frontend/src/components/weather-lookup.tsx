"use client"

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'

interface WeatherData {
  date: string
  location: string
  notes?: string
  weather: {
    current: {
      temperature: number
      weather_descriptions: string[]
    }
  }
}

export function WeatherLookup() {
  const [id, setId] = useState('')
  const [data, setData] = useState<WeatherData | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setData(null)

    if (!id.trim()) {
      setError('Please enter a weather ID.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`http://localhost:8000/weather/${id}`)
      if (!res.ok) throw new Error('Weather data not found.')
      const json = await res.json()
      setData(json)
    } catch (err: any) {
      setError(err.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Lookup Weather by ID</CardTitle>
        <CardDescription>
          Enter your weather request ID to view stored results.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleLookup} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="weather-id">Weather Request ID</Label>
            <Input
              id="weather-id"
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="e.g., 123e4567-e89b-12d3-a456-426614174000"
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Looking up...' : 'Get Weather Data'}
          </Button>

          {error && (
            <div className="p-3 rounded-md bg-red-900/20 text-red-500 border border-red-500">
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {data && (
            <div className="p-4 mt-4 border border-gray-700/30 rounded-md space-y-2 bg-muted/30 bg-green-900/20 text-green-500 border border-green-500">
              <p className="text-sm font-medium">
              Your weather info is:
              </p>
              <p className="text-sm">
                Date: {data.date}
              </p>
              <p className="text-sm">
                Location: {data.location}
              </p>
              {data.notes && (
                <p className="text-sm">
                  Notes: {data.notes}
                </p>
              )}
              <p className="text-sm">
                Temperature:{' '}
                {data.weather.current.temperature}°C
              </p>
              <p className="text-sm">
                Condition:{' '}
                {data.weather.current.weather_descriptions[0]}
              </p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
