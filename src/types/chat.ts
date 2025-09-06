export interface ChatMessage {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
  isOffline?: boolean
}

export type ChatMode = 'online' | 'offline' | 'auto'