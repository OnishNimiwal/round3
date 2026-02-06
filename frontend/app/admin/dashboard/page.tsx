'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import Link from 'next/link'

interface Issue {
  _id: string
  title: string
  description: string
  category: string
  status: 'pending' | 'in_progress' | 'resolved'
  address: string
  createdAt: string
  trackingId: string
  imageUrl?: string
}

export default function AdminDashboard() {
  const [issues, setIssues] = useState<Issue[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'resolved'>('all')
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin/login')
      return
    }
    fetchIssues()
  }, [filter])

  const fetchIssues = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/admin/issues`,
        {
          params: filter !== 'all' ? { status: filter } : {},
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      setIssues(response.data)
    } catch (error: any) {
      if (error.response?.status === 401) {
        localStorage.removeItem('adminToken')
        router.push('/admin/login')
      } else {
        console.error('Error fetching issues:', error)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const updateStatus = async (id: string, newStatus: 'pending' | 'in_progress' | 'resolved') => {
    try {
      const token = localStorage.getItem('adminToken')
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/admin/issues/${id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      fetchIssues()
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to update status')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    router.push('/admin/login')
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
            <div className="flex gap-4">
              <Link href="/" className="text-gray-700 hover:text-gray-900">
                Home
              </Link>
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filter Buttons */}
        <div className="flex gap-2 mb-6">
          {(['all', 'pending', 'in_progress', 'resolved'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === status
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Issues List */}
        <div className="grid gap-6">
          {issues.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-600 text-lg">No issues found</p>
            </div>
          ) : (
            issues.map((issue) => (
              <div key={issue._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{issue.title}</h3>
                    <p className="text-gray-600 mb-2">{issue.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <span className="capitalize">Category: {issue.category}</span>
                      <span>Location: {issue.address}</span>
                      <span>Tracking ID: {issue.trackingId}</span>
                      <span>
                        Submitted: {new Date(issue.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                      issue.status
                    )}`}
                  >
                    {issue.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>

                {issue.imageUrl && (
                  <div className="mb-4">
                    <img
                      src={issue.imageUrl}
                      alt="Issue"
                      className="max-w-md h-48 object-cover rounded-lg border border-gray-300"
                    />
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => updateStatus(issue._id, 'pending')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      issue.status === 'pending'
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => updateStatus(issue._id, 'in_progress')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      issue.status === 'in_progress'
                        ? 'bg-yellow-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    In Progress
                  </button>
                  <button
                    onClick={() => updateStatus(issue._id, 'resolved')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      issue.status === 'resolved'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Resolved
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

