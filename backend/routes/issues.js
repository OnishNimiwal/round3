const express = require('express')
const multer = require('multer')
const path = require('path')
const Issue = require('../models/Issue')
const { detectCategory } = require('../services/geminiService')

const router = express.Router()

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, 'issue-' + uniqueSuffix + path.extname(file.originalname))
  },
})

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)

    if (extname && mimetype) {
      return cb(null, true)
    } else {
      cb(new Error('Only image files are allowed'))
    }
  },
})

// Submit a new issue
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { title, description, latitude, longitude, address } = req.body

    if (!title || !description || !latitude || !longitude) {
      return res.status(400).json({ message: 'Title, description, and location are required' })
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' })
    }

    const imagePath = req.file.path
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`

    // Detect category using Gemini AI
    let category
    try {
      category = await detectCategory(imagePath, title, description)
      console.log(`Detected category: ${category} for issue: ${title}`)
    } catch (error) {
      console.error('Error detecting category:', error)
      // Use fallback category
      category = 'other'
    }

    const issue = new Issue({
      title,
      description,
      category,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      address: address || `${latitude}, ${longitude}`,
      imageUrl,
    })

    await issue.save()

    res.status(201).json({
      message: 'Issue submitted successfully',
      trackingId: issue.trackingId,
      category: category,
      issue: issue,
    })
  } catch (error) {
    console.error('Error submitting issue:', error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Get issue by ID
router.get('/:id', async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' })
    }
    res.json(issue)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Track issue by tracking ID
router.get('/track/:trackingId', async (req, res) => {
  try {
    const issue = await Issue.findOne({ trackingId: req.params.trackingId.toUpperCase() })
    if (!issue) {
      return res.status(404).json({ message: 'Issue not found. Please check your tracking ID.' })
    }
    res.json(issue)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

module.exports = router

