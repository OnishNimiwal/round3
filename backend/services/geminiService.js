let GoogleGenerativeAI
let genAI = null

try {
  GoogleGenerativeAI = require('@google/generative-ai').GoogleGenerativeAI
  if (process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  }
} catch (error) {
  console.warn('@google/generative-ai package not installed. Category detection will use fallback method.')
}

const fs = require('fs')
const path = require('path')

/**
 * Get MIME type from file path
 */
function getImageMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase()
  const mimeTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
  }
  return mimeTypes[ext] || 'image/jpeg'
}

/**
 * Detect category from image and description using Gemini AI
 * @param {string} imagePath - Path to the uploaded image
 * @param {string} title - Issue title
 * @param {string} description - Issue description
 * @returns {Promise<string>} - Detected category
 */
async function detectCategory(imagePath, title, description) {
  try {
    if (!genAI || !process.env.GEMINI_API_KEY) {
      console.log('Gemini API key not provided, using fallback category detection')
      return detectCategoryFallback(title, description)
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    // Read image file
    const imageBuffer = fs.readFileSync(imagePath)
    const base64Image = imageBuffer.toString('base64')

    const prompt = `Analyze this civic issue image and description to determine the category.

Title: ${title}
Description: ${description}

Based on the image and description, categorize this issue into ONE of these categories:
- road (for road, pothole, street, traffic, infrastructure issues)
- water (for water supply, leakage, drainage issues)
- electricity (for power, electrical, street light issues)
- sanitation (for waste, garbage, cleanliness issues)
- parks (for parks, recreation, public spaces issues)
- other (for any other civic issues)

Respond with ONLY the category keyword (road, water, electricity, sanitation, parks, or other). Do not include any explanation or additional text.`

    // For Gemini, we need to use the vision model with image
    const result = await model.generateContent([
      {
        inlineData: {
          data: base64Image,
          mimeType: getImageMimeType(imagePath),
        },
      },
      { text: prompt },
    ])

    const response = await result.response
    let category = response.text().trim().toLowerCase()

    // Validate and clean the response
    const validCategories = ['road', 'water', 'electricity', 'sanitation', 'parks', 'other']
    if (!validCategories.includes(category)) {
      // Try to extract category from response
      for (const validCat of validCategories) {
        if (category.includes(validCat)) {
          category = validCat
          break
        }
      }
      // If still not found, use fallback
      if (!validCategories.includes(category)) {
        return detectCategoryFallback(title, description)
      }
    }

    return category
  } catch (error) {
    console.error('Error detecting category with Gemini:', error)
    // Fallback to text-based detection
    return detectCategoryFallback(title, description)
  }
}

/**
 * Fallback category detection using text analysis
 * @param {string} title - Issue title
 * @param {string} description - Issue description
 * @returns {string} - Detected category
 */
function detectCategoryFallback(title, description) {
  const text = `${title} ${description}`.toLowerCase()

  // Road & Infrastructure
  if (
    text.match(/\b(pothole|road|street|traffic|bridge|sidewalk|pavement|asphalt|highway|lane)\b/i)
  ) {
    return 'road'
  }

  // Water Supply
  if (
    text.match(/\b(water|leak|drainage|pipe|tap|faucet|supply|sewer|flood)\b/i)
  ) {
    return 'water'
  }

  // Electricity
  if (
    text.match(/\b(electric|power|light|bulb|streetlight|wire|outage|voltage|current)\b/i)
  ) {
    return 'electricity'
  }

  // Sanitation
  if (
    text.match(/\b(waste|garbage|trash|dump|clean|sanitation|sewage|dirty|rubbish)\b/i)
  ) {
    return 'sanitation'
  }

  // Parks & Recreation
  if (
    text.match(/\b(park|playground|recreation|garden|tree|bench|sport|field)\b/i)
  ) {
    return 'parks'
  }

  // Default to other
  return 'other'
}

module.exports = {
  detectCategory,
  detectCategoryFallback,
}

