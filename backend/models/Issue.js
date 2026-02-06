const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid')

const issueSchema = new mongoose.Schema({
  trackingId: {
    type: String,
    unique: true,
    default: () => uuidv4().substring(0, 8).toUpperCase(),
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['road', 'water', 'electricity', 'sanitation', 'parks', 'other'],
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'resolved'],
    default: 'pending',
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
  },
  department: {
    type: String,
    default: function () {
      // Auto-assign department based on category
      const departmentMap = {
        road: 'Public Works Department',
        water: 'Water Supply Department',
        electricity: 'Electricity Department',
        sanitation: 'Sanitation Department',
        parks: 'Parks & Recreation Department',
        other: 'General Administration',
      }
      return departmentMap[this.category] || 'General Administration'
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// Update updatedAt before saving
issueSchema.pre('save', function (next) {
  this.updatedAt = Date.now()
  next()
})

module.exports = mongoose.model('Issue', issueSchema)

