const express = require('express')
const OpenAI = require('openai')

const router = express.Router()

// Initialize OpenAI (fallback to simple responses if API key not provided)
let openai = null
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })
}

// Simple rule-based responses as fallback
const getSimpleResponse = (message) => {
  const lowerMessage = message.toLowerCase()

  if (lowerMessage.includes('track') || lowerMessage.includes('status')) {
    return 'You can track your issue using the tracking ID provided when you submitted the issue. Click on "Track Issue" button and enter your tracking ID.'
  }

  if (lowerMessage.includes('submit') || lowerMessage.includes('report')) {
    return 'To submit an issue, go to the homepage, allow location access, upload an image of the issue, fill in the details, and click submit. You will receive a tracking ID.'
  }

  if (lowerMessage.includes('pending') || lowerMessage.includes('time')) {
    return 'Issue resolution time depends on the type and severity of the issue. You can check the status anytime using your tracking ID. Typical resolution times range from 1-7 days.'
  }

  if (lowerMessage.includes('category') || lowerMessage.includes('type')) {
    return 'You can report issues in these categories: Road & Infrastructure, Water Supply, Electricity, Sanitation & Waste, Parks & Recreation, and Other issues.'
  }

  if (lowerMessage.includes('location') || lowerMessage.includes('where')) {
    return 'The platform automatically detects your location when you allow location access. You can also manually enter the address if needed.'
  }

  if (lowerMessage.includes('admin') || lowerMessage.includes('login')) {
    return 'Only administrators can access the admin portal. Citizens can submit and track issues without any login.'
  }

  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('help')) {
    return 'Hello! I can help you with information about submitting issues, tracking status, categories, and more. What would you like to know?'
  }

  return 'I understand you have a question about the civic issue platform. Could you please provide more details? I can help you with submitting issues, tracking status, categories, and general information about the platform.'
}

// Chatbot endpoint
router.post('/', async (req, res) => {
  try {
    const { message } = req.body

    if (!message) {
      return res.status(400).json({ message: 'Message is required' })
    }

    let response

    if (openai) {
      // Use OpenAI API if available
      try {
        const completion = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content:
                'You are a helpful assistant for a civic issue reporting platform. Help users understand how to submit issues, track their status, and answer questions about the platform. Be friendly and concise.',
            },
            {
              role: 'user',
              content: message,
            },
          ],
          max_tokens: 150,
          temperature: 0.7,
        })

        response = completion.choices[0].message.content
      } catch (openaiError) {
        console.error('OpenAI API error:', openaiError)
        // Fallback to simple responses
        response = getSimpleResponse(message)
      }
    } else {
      // Use simple rule-based responses
      response = getSimpleResponse(message)
    }

    res.json({ response })
  } catch (error) {
    console.error('Error in chatbot:', error)
    res.status(500).json({
      message: 'Server error',
      response: 'Sorry, I encountered an error. Please try again later.',
    })
  }
})

module.exports = router

