'use client'

import { useState, useCallback } from 'react'
import { ChatMessage, ChatMode } from '@/types/chat'
import { processWithExpertSystem } from '@/lib/expert-system'
import { processWithAI } from '@/lib/together-ai'
import { supabase } from '@/lib/supabase'
import { useConnectionStatus } from './useConnectionStatus'

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [mode, setMode] = useState<ChatMode>('auto')
  const isOnline = useConnectionStatus()

  const currentMode = mode === 'auto' ? (isOnline ? 'online' : 'offline') : mode

  const addMessage = useCallback(async (content: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date(),
      isOffline: currentMode === 'offline'
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      let response: string
      
      if (currentMode === 'offline') {
        response = await processWithExpertSystem(content)
      } else {
        response = await processWithAI(content, messages)
        
        // Store conversation in Supabase
        const { error } = await supabase
          .from('conversations')
          .insert({
            user_message: content,
            ai_response: response,
            mode: 'online',
            created_at: new Date().toISOString()
          })
          
        if (error) console.error('Error saving conversation:', error)
      }

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant',
        timestamp: new Date(),
        isOffline: currentMode === 'offline'
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error processing message:', error)
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error. Please try again.',
        role: 'assistant',
        timestamp: new Date(),
        isOffline: currentMode === 'offline'
      }
      
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }, [currentMode, messages])

  const clearMessages = useCallback(() => {
    setMessages([])
  }, [])

  return {
    messages,
    isLoading,
    mode,
    setMode,
    currentMode,
    addMessage,
    clearMessages,
    isOnline
  }
}