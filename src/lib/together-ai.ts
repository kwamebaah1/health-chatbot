export async function processWithAI(query: string, history: any[]): Promise<string> {
  const response = await fetch('/api/ai', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
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
    }),
  })

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`)
  }

  const data = await response.json()
  return data.choices[0].message.content
}

//'meta-llama/Llama-3-70b-chat-hf'