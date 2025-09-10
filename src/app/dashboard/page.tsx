'use client'

import { useState, useEffect } from 'react'
import { HealthTips } from '@/components/Dashboard/HealthTips'
import { QuickActions } from '@/components/Dashboard/QuickActions'
import { ChatInterface } from '@/components/ChatInterface'
import { Button } from '@/components/ui/button'
import { MessageSquare, Activity } from 'lucide-react'
import { motion } from 'framer-motion'
import { ChatMessage, ChatMode } from '@/types/chat'
import { processWithExpertSystem } from '@/lib/expert-system'
import { processWithAI } from '@/lib/together-ai'
import { supabase } from '@/lib/supabase'
import { useConnectionStatus } from '@/hooks/useConnectionStatus'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('chat')
  const [healthData, setHealthData] = useState({
    heartRate: 72,
    steps: 8432,
    sleep: 7.2,
    calories: 2100
  })

  // Chat state moved to Dashboard
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [mode, setMode] = useState<ChatMode>('auto')
  const isOnline = useConnectionStatus()

  const currentMode = mode === 'auto' ? (isOnline ? 'online' : 'offline') : mode

  const addMessage = async (content: string) => {
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
  }

  const clearMessages = () => {
    setMessages([])
  }

  useEffect(() => {
    // Simulate live data updates
    const interval = setInterval(() => {
      setHealthData(prev => ({
        heartRate: Math.floor(Math.random() * 20) + 65,
        steps: prev.steps + Math.floor(Math.random() * 10),
        sleep: prev.sleep + (Math.random() * 0.2 - 0.1),
        calories: prev.calories + Math.floor(Math.random() * 5)
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Health Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Welcome back! Here's your health overview and assistant.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mt-8">
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4 md:p-6 h-full">
              <div className="flex space-x-2 mb-6 overflow-x-auto pb-2 -mx-2 px-2">
                <Button
                  variant={activeTab === 'chat' ? 'default' : 'ghost'}
                  onClick={() => setActiveTab('chat')}
                  className="flex items-center space-x-2 whitespace-nowrap"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat Assistant</span>
                </Button>
                <Button
                  variant={activeTab === 'activity' ? 'default' : 'ghost'}
                  onClick={() => setActiveTab('activity')}
                  className="flex items-center space-x-2 whitespace-nowrap"
                >
                  <Activity className="w-4 h-4" />
                  <span>Activity</span>
                </Button>
              </div>

              {activeTab === 'chat' ? (
                <div className="h-[500px] md:h-[600px]">
                  <ChatInterface 
                    messages={messages}
                    isLoading={isLoading}
                    mode={mode}
                    setMode={setMode}
                    currentMode={currentMode}
                    addMessage={addMessage}
                    clearMessages={clearMessages}
                    isOnline={isOnline}
                  />
                </div>
              ) : (
                <div className="h-[500px] md:h-[600px] flex items-center justify-center">
                  <div className="text-center">
                    <Activity className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                      Activity Tracking
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      Your health activity data will appear here.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <HealthTips />
            <QuickActions 
              messages={messages}
              addMessage={addMessage}
            />
          </div>
        </div>
      </div>
    </div>
  )
}