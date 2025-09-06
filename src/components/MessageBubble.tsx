'use client'

import { ChatMessage } from '@/types/chat'
import { motion } from 'framer-motion'
import { User, Bot, WifiOff } from 'lucide-react'

interface MessageBubbleProps {
  message: ChatMessage
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user'
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div
        className={`flex max-w-xs lg:max-w-md xl:max-w-lg 2xl:max-w-xl items-start gap-2 ${
          isUser ? 'flex-row-reverse' : 'flex-row'
        }`}
      >
        <div
          className={`flex items-center justify-center w-8 h-8 rounded-full ${
            isUser
              ? 'bg-blue-500 text-white'
              : 'bg-green-500 text-white'
          }`}
        >
          {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
        </div>
        
        <div
          className={`px-4 py-2 rounded-2xl ${
            isUser
              ? 'bg-blue-500 text-white rounded-br-none'
              : 'bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white rounded-bl-none'
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <p className="text-sm font-medium">
              {isUser ? 'You' : 'Health Assistant'}
            </p>
            {message.isOffline && (
              <WifiOff className="w-3 h-3 text-slate-400" />
            )}
          </div>
          <p className="text-sm">{message.content}</p>
          <p className={`text-xs mt-1 ${isUser ? 'text-blue-100' : 'text-slate-500'}`}>
            {message.timestamp.toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </p>
        </div>
      </div>
    </motion.div>
  )
}