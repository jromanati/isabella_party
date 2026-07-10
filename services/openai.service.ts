// OpenAI service for photo and message analysis

interface OpenAIAnalysisResult {
  isValid: boolean
  confidence: number
  reason?: string
}

interface GuestMessageAnalysisResult {
  isAppropriate: boolean
  confidence: number
  reason?: string
}

export class OpenAIService {
  private static readonly API_URL = 'https://api.openai.com/v1/chat/completions'
  private static readonly MODEL = 'gpt-4o'

  static async analyzePhoto(imageFile: File): Promise<OpenAIAnalysisResult> {
    try {
      // Convert image to base64
      const base64Image = await this.fileToBase64(imageFile)
      
      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: this.MODEL,
          messages: [
            {
              role: 'system',
              content: `You are a content moderator for a birthday party photo gallery. 
              
              Analyze the uploaded photo and determine if it's appropriate for a family-friendly birthday celebration.
              
              Consider:
              - Is it a real photo of people (not AI generated, not text, not random objects)?
              - Is the content appropriate for all ages (no explicit content, no violence, no hate)?
              - Is it related to a birthday/celebration context?
              - Is the photo quality reasonable (not extremely blurry, not completely dark)?
              
              Respond with ONLY "VALID" if the photo meets all criteria, or "INVALID" if it doesn't.
              No additional explanation needed.`
            },
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: 'Is this photo appropriate for a birthday party gallery?'
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:${imageFile.type};base64,${base64Image}`
                  }
                }
              ]
            }
          ],
          max_tokens: 10,
          temperature: 0.1,
        }),
      })

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`)
      }

      const data = await response.json()
      const result = data.choices?.[0]?.message?.content?.trim().toUpperCase()

      const isValid = result === 'VALID'
      
      return {
        isValid,
        confidence: isValid ? 0.9 : 0.1,
        reason: isValid ? 'Photo approved by AI analysis' : 'Photo rejected by AI analysis'
      }

    } catch (error) {
      console.error('OpenAI analysis error:', error)
      
      // If analysis fails, default to pending for manual review
      return {
        isValid: false,
        confidence: 0.0,
        reason: 'Analysis failed - manual review required'
      }
    }
  }

  static async analyzeGuestMessage(message: string): Promise<GuestMessageAnalysisResult> {
    try {
      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: this.MODEL,
          messages: [
            {
              role: 'system',
              content: `You are a content moderator for a birthday party message system.
              
              Analyze the message and determine if it's appropriate for a family-friendly birthday celebration.
              
              IMPORTANT: Be very permissive with typical birthday messages. Short messages like "felicidades", "feliz cumpleaños", "que la pases bien", "felicidades cumpleañera", "te quiero mucho", "éxitos", etc. are ALWAYS APPROPRIATED.
              
              Consider:
              - Is the content respectful and positive?
              - Is it appropriate for all ages (no explicit content, no hate speech, no bullying)?
              - Is it relevant to a birthday/celebration context? (Even generic positive wishes are fine)
              - Does it contain any inappropriate language or topics?
              
              The word "negra" can be used as an affectionate term in this context and should be allowed.
              Common affectionate terms and positive wishes should be approved.
              
              DEFAULT TO APPROVING unless there's clearly inappropriate content (explicit, hateful, or offensive).
              
              Respond with ONLY "APPROVED" if the message is appropriate, or "REJECTED" if it's not.
              No additional explanation needed.`
            },
            {
              role: 'user',
              content: `Is this message appropriate for a birthday party: "${message}"`
            }
          ],
          max_tokens: 10,
          temperature: 0.1,
        }),
      })

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`)
      }

      const data = await response.json()
      const result = data.choices?.[0]?.message?.content?.trim().toUpperCase()

      const isAppropriate = result === 'APPROVED'
      
      return {
        isAppropriate,
        confidence: isAppropriate ? 0.9 : 0.1,
        reason: isAppropriate ? 'Message approved by AI analysis' : 'Message rejected by AI analysis'
      }

    } catch (error) {
      console.error('OpenAI message analysis error:', error)
      
      // If analysis fails, default to pending for manual review
      return {
        isAppropriate: false,
        confidence: 0.0,
        reason: 'Analysis failed - manual review required'
      }
    }
  }

  private static fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
        const base64 = result.split(',')[1] // Remove data:image/...;base64, prefix
        resolve(base64)
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }
}
