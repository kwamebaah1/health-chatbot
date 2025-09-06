const TOGETHER_API_KEY = process.env.TOGETHER_API_KEY
const TOGETHER_API_URL = 'https://api.together.xyz/v1/chat/completions'

export async function processWithAI(query: string, history: any[]): Promise<string> {
  const response = await fetch(TOGETHER_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TOGETHER_API_KEY}`
    },
    body: JSON.stringify({
      model: 'meta-llama/Llama-3-70b-chat-hf',
      messages: [
        {
          role: 'system',
          content: `You are a helpful medical assistant. Provide accurate health information but always remind users to consult with healthcare professionals for medical advice. Be empathetic, clear, and concise.`
        },
        ...history.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        {
          role: 'user',
          content: query
        }
      ],
      max_tokens: 1000,
      temperature: 0.7
    })
  })

  if (!response.ok) {
    throw new Error(`Together.ai API error: ${response.statusText}`)
  }

  const data = await response.json()
  return data.choices[0].message.content
}