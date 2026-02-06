'use client'

import { useState, useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'

interface IssueFormData {
  title: string
  description: string
  image?: FileList
}

interface IssueFormProps {
  location: { lat: number; lng: number; address: string } | null
  onIssueSubmitted: (trackingId: string) => void
}

export default function IssueForm({ location, onIssueSubmitted }: IssueFormProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadMode, setUploadMode] = useState<'camera' | 'file'>('file')
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [capturedImage, setCapturedImage] = useState<File | null>(null)
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<IssueFormData>()

  // Stop camera when component unmounts or mode changes
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop())
      }
    }
  }, [cameraStream])

  useEffect(() => {
    if (uploadMode === 'camera' && videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream
    } else if (uploadMode === 'file' && cameraStream) {
      // Stop camera when switching to file mode
      cameraStream.getTracks().forEach(track => track.stop())
      setCameraStream(null)
      setIsCameraActive(false)
    }
  }, [uploadMode, cameraStream])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' } // Use back camera on mobile
      })
      setCameraStream(stream)
      setIsCameraActive(true)
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (error) {
      console.error('Error accessing camera:', error)
      alert('Unable to access camera. Please check permissions or use file upload instead.')
      setUploadMode('file')
    }
  }

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop())
      setCameraStream(null)
      setIsCameraActive(false)
      if (videoRef.current) {
        videoRef.current.srcObject = null
      }
    }
  }

  const capturePhoto = () => {
    if (videoRef.current && videoRef.current.videoWidth > 0 && videoRef.current.videoHeight > 0) {
      const canvas = document.createElement('canvas')
      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight
      const ctx = canvas.getContext('2d')
      
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0)
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `camera-capture-${Date.now()}.jpg`, { type: 'image/jpeg' })
            
            // Create preview first
            const reader = new FileReader()
            reader.onloadend = () => {
              setImagePreview(reader.result as string)
              setCapturedImage(file)
              // Stop camera after capture
              stopCamera()
            }
            reader.readAsDataURL(file)
          }
        }, 'image/jpeg', 0.9)
      }
    }
  }

  const handleModeChange = (mode: 'camera' | 'file') => {
    if (mode === 'camera') {
      setUploadMode('camera')
      setCapturedImage(null)
      setImagePreview(null)
      startCamera()
    } else {
      setUploadMode('file')
      stopCamera()
      setCapturedImage(null)
      setImagePreview(null)
    }
  }

  const onSubmit = async (data: IssueFormData) => {
    if (!location) {
      alert('Please allow location access to submit an issue')
      return
    }

    // Check if image is provided
    const imageFile = capturedImage || (data.image && data.image[0])
    if (!imageFile) {
      alert('Please capture or upload an image')
      return
    }

    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append('title', data.title)
      formData.append('description', data.description)
      formData.append('latitude', location.lat.toString())
      formData.append('longitude', location.lng.toString())
      formData.append('address', location.address)
      formData.append('image', imageFile)

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/issues`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      alert(`Issue submitted successfully! Tracking ID: ${response.data.trackingId}`)
      onIssueSubmitted(response.data.trackingId)
      reset()
      setImagePreview(null)
      setCapturedImage(null)
      setUploadMode('file')
      stopCamera()
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error: any) {
      console.error('Error submitting issue:', error)
      alert(error.response?.data?.message || 'Failed to submit issue. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setCapturedImage(null) // Clear camera capture if file is selected
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      setValue('image', e.target.files)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Report a Civic Issue</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Issue Title *
          </label>
          <input
            {...register('title', { required: 'Title is required' })}
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="e.g., Pothole on Main Street"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            {...register('description', { required: 'Description is required' })}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Describe the issue in detail..."
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image *
          </label>
          
          {/* Mode Selection Buttons */}
          <div className="flex gap-2 mb-4">
            <button
              type="button"
              onClick={() => handleModeChange('camera')}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                uploadMode === 'camera'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              📷 Take Photo
            </button>
            <button
              type="button"
              onClick={() => handleModeChange('file')}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                uploadMode === 'file'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              📁 Choose File
            </button>
          </div>

          {/* Camera Mode */}
          {uploadMode === 'camera' && (
            <div className="space-y-4">
              {!isCameraActive && !imagePreview ? (
                <button
                  type="button"
                  onClick={startCamera}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Start Camera
                </button>
              ) : isCameraActive && !imagePreview ? (
                <div className="space-y-4">
                  <div className="relative bg-black rounded-lg overflow-hidden">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full max-h-96 object-contain"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={capturePhoto}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                    >
                      📸 Capture Photo
                    </button>
                    <button
                      type="button"
                      onClick={stopCamera}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                    >
                      Stop Camera
                    </button>
                  </div>
                </div>
              ) : imagePreview ? (
                <div className="text-center">
                  <p className="text-green-600 font-semibold mb-2">✓ Photo captured successfully!</p>
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null)
                      setCapturedImage(null)
                      startCamera()
                    }}
                    className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    Retake Photo
                  </button>
                </div>
              ) : null}
            </div>
          )}

          {/* File Upload Mode */}
          {uploadMode === 'file' && (
            <input
              {...register('image')}
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          )}

          {!imagePreview && !isCameraActive && (
            <p className="text-gray-500 text-sm mt-1">
              {uploadMode === 'camera' 
                ? 'Click "Start Camera" to take a photo' 
                : 'Please upload or capture an image'}
            </p>
          )}

          {/* Image Preview */}
          {imagePreview && (
            <div className="mt-4 relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="max-w-full h-48 object-cover rounded-lg border border-gray-300"
              />
              <button
                type="button"
                onClick={() => {
                  setImagePreview(null)
                  setCapturedImage(null)
                  if (fileInputRef.current) {
                    fileInputRef.current.value = ''
                  }
                  if (uploadMode === 'camera') {
                    stopCamera()
                  }
                }}
                className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold"
              >
                ×
              </button>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !location || (!imagePreview && !capturedImage)}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Issue'}
        </button>
      </form>
    </div>
  )
}

