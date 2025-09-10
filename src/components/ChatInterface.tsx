'use client'

import { useState, useRef, useEffect } from 'react'
import { ModeToggle } from './ModeToggle'
import { MessageBubble } from './MessageBubble'
import { Button } from './ui/button'
import { Send, Trash2 } from 'lucide-react'
import { LoadingAnimation } from './LoadingAnimation'
import { ConnectionStatus } from './ConnectionStatus'
import { ChatMessage, ChatMode } from '@/types/chat'

interface ChatInterfaceProps {
  messages: ChatMessage[]
  isLoading: boolean
  mode: ChatMode
  setMode: (mode: ChatMode) => void
  currentMode: 'online' | 'offline'
  addMessage: (content: string) => Promise<void>
  clearMessages: () => void
  isOnline: boolean
}

export function ChatInterface({
  messages,
  isLoading,
  mode,
  setMode,
  currentMode,
  addMessage,
  clearMessages,
  isOnline
}: ChatInterfaceProps) {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !isLoading) {
      addMessage(input.trim())
      setInput('')
    }
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 shadow-xl rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            Health Assistant
          </h1>
          <ConnectionStatus isOnline={isOnline} currentMode={currentMode} />
        </div>
        <div className="flex items-center gap-2">
          <ModeToggle mode={mode} setMode={setMode} isOnline={isOnline} />
          <Button
            variant="outline"
            size="sm"
            onClick={clearMessages}
            disabled={messages.length === 0}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0" 
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 dark:text-slate-400 p-4">
            <div className="w-16 h-16 mb-4 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">Welcome to Health Assistant</h3>
            <p className="max-w-md">
              I'm here to help with your health questions. Describe your symptoms or ask a question to get started.
            </p>
            <div className="mt-6 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
              <p className="text-sm font-medium mb-2">Try asking:</p>
              <ul className="text-sm space-y-1">
                <li>"I have a headache and fever"</li>
                <li>"What are the symptoms of flu?"</li>
                <li>"How can I relieve muscle pain?"</li>
              </ul>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))
        )}
        {isLoading && <LoadingAnimation />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message here..."
            className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:text-white"
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="rounded-full px-4 shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 text-center">
          {currentMode === 'offline'
            ? 'Using offline expert system - basic guidance only'
            : 'Connected to AI health assistant'}
        </p>
      </form>
    </div>
  )
}