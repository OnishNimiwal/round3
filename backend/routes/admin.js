const express = require('express')
const jwt = require('jsonwebtoken')
const Admin = require('../models/Admin')
const Issue = require('../models/Issue')
const authMiddleware = require('../middleware/auth')

const router = express.Router()

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '7d',
  })
}

// Admin signup
router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' })
    }

    const existingAdmin = await Admin.findOne({ email })
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin with this email already exists' })
    }

    const admin = new Admin({ email, password })
    await admin.save()

    const token = generateToken(admin._id)

    res.status(201).json({
      message: 'Admin account created successfully',
      token,
      admin: { id: admin._id, email: admin.email },
    })
  } catch (error) {
    console.error('Error in admin signup:', error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    const admin = await Admin.findOne({ email })
    if (!admin) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const isPasswordValid = await admin.comparePassword(password)
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const token = generateToken(admin._id)

    res.json({
      message: 'Login successful',
      token,
      admin: { id: admin._id, email: admin.email },
    })
  } catch (error) {
    console.error('Error in admin login:', error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Get all issues (Admin only)
router.get('/issues', authMiddleware, async (req, res) => {
  try {
    const { status } = req.query
    const query = status && status !== 'all' ? { status } : {}
    
    const issues = await Issue.find(query).sort({ createdAt: -1 })
    res.json(issues)
  } catch (error) {
    console.error('Error fetching issues:', error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Update issue status (Admin only)
router.put('/issues/:id', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body

    if (!['pending', 'in_progress', 'resolved'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' })
    }

    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: Date.now() },
      { new: true }
    )

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' })
    }

    res.json({
      message: 'Issue status updated successfully',
      issue,
    })
  } catch (error) {
    console.error('Error updating issue:', error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

module.exports = router

