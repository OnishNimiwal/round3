'use client'

import { useState } from 'react'
import axios from 'axios'

interface Issue {
  _id: string
  title: string
  description: string
  category: string
  status: 'pending' | 'in_progress' | 'resolved'
  address: string
  createdAt: string
  imageUrl?: string
}

interface TrackingModalProps {
  onClose: () => void
  initialTrackingId?: string
}

export default function TrackingModal({ onClose, initialTrackingId }: TrackingModalProps) {
  const [trackingId, setTrackingId] = useState(initialTrackingId || '')
  const [issue, setIssue] = useState<Issue | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleTrack = async () => {
    if (!trackingId.trim()) {
      setError('Please enter a tracking ID')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/issues/track/${trackingId}`
      )
      setIssue(response.data)
    } catch (error: any) {
      setError(error.response?.data?.message || 'Issue not found. Please check your tracking ID.')
      setIssue(null)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'bg-green-100 text-green-800'
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800'
      case 'pending':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'Resolved'
      case 'in_progress':
        return 'In Progress'
      case 'pending':
        return 'Pending'
      default:
        return status
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-primary-600 text-white p-4 rounded-t-lg flex justify-between items-center">
          <h3 className="text-xl font-bold">Track Your Issue</h3>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter Tracking ID
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                placeholder="Enter your tracking ID"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleTrack()}
              />
              <button
                onClick={handleTrack}
                disabled={isLoading}
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Loading...' : 'Track'}
              </button>
            </div>
            {error && (
              <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
          </div>

          {/* Issue Details */}
          {issue && (
            <div className="border border-gray-200 rounded-lg p-6 space-y-4">
              <div className="flex justify-between items-start">
                <h4 className="text-xl font-bold text-gray-800">{issue.title}</h4>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(issue.status)}`}>
                  {getStatusText(issue.status)}
                </span>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Category</p>
                <p className="font-medium text-gray-800 capitalize">{issue.category}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Description</p>
                <p className="text-gray-800">{issue.description}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Location</p>
                <p className="text-gray-800">{issue.address}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Submitted On</p>
                <p className="text-gray-800">
                  {new Date(issue.createdAt).toLocaleString()}
                </p>
              </div>

              {issue.imageUrl && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Image</p>
                  <img
                    src={issue.imageUrl}
                    alt="Issue"
                    className="max-w-full h-48 object-cover rounded-lg border border-gray-300"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

