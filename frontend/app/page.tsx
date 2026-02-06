'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import IssueForm from '@/components/IssueForm'
import Chatbot from '@/components/Chatbot'
import TrackingModal from '@/components/TrackingModal'

export default function Home() {
  const [location, setLocation] = useState<{ lat: number; lng: number; address: string } | null>(null)
  const [showChatbot, setShowChatbot] = useState(false)
  const [showTracking, setShowTracking] = useState(false)
  const [trackingId, setTrackingId] = useState('')

  useEffect(() => {
    getCurrentLocation()
  }, [])

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          
          // Try reverse geocoding using browser's built-in API
          let address = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
          
          try {
            // Use browser's built-in geocoding if available
            // Fallback: Use coordinates as address
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            )
            if (response.ok) {
              const data = await response.json()
              address = data.display_name || address
            }
          } catch (error) {
            // Use coordinates if reverse geocoding fails
            console.log('Using coordinates as address')
          }
          
          setLocation({
            lat: latitude,
            lng: longitude,
            address
          })
        },
        (error) => {
          console.error('Error getting location:', error)
          alert('Please enable location access to use this feature. You can still submit issues manually.')
        }
      )
    } else {
      alert('Geolocation is not supported by your browser. You can still submit issues manually.')
    }
  }

  const handleIssueSubmitted = (id: string) => {
    setTrackingId(id)
    setShowTracking(true)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Report Civic Issues
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Help us make your city better. Report issues and track their resolution.
          </p>
        </div>

        {/* Location Display */}
        {location && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center gap-2">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div>
                <p className="text-sm text-gray-500">Current Location</p>
                <p className="font-semibold text-gray-800">{location.address}</p>
              </div>
            </div>
          </div>
        )}

        {/* Issue Form */}
        <IssueForm 
          location={location} 
          onIssueSubmitted={handleIssueSubmitted}
        />

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => setShowTracking(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-md"
          >
            Track Issue
          </button>
          <button
            onClick={() => setShowChatbot(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-md"
          >
            Ask AI Assistant
          </button>
        </div>

        {/* Chatbot Modal */}
        {showChatbot && (
          <Chatbot onClose={() => setShowChatbot(false)} />
        )}

        {/* Tracking Modal */}
        {showTracking && (
          <TrackingModal 
            onClose={() => setShowTracking(false)}
            initialTrackingId={trackingId}
          />
        )}
      </div>
    </main>
  )
}

