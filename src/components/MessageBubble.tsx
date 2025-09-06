'use client'

import { ChatMessage } from '@/types/chat'
import { motion } from 'framer-motion'
import { User, Bot, WifiOff } from 'lucide-react'

interface MessageBubbleProps {
  message: ChatMessage
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user'

  // Check if this is an expert-system structured response
  const isExpert =
    typeof message.content === 'object' && message.content?.type === 'expert'

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
        {/* Avatar */}
        <div
          className={`flex items-center justify-center w-8 h-8 rounded-full ${
            isUser ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'
          }`}
        >
          {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
        </div>

        {/* Bubble */}
        <div
          className={`px-4 py-2 rounded-2xl ${
            isUser
              ? 'bg-blue-500 text-white rounded-br-none'
              : 'bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white rounded-bl-none'
          }`}
        >
          {/* Header */}
          <div className="flex items-center gap-2 mb-1">
            <p className="text-sm font-medium">
              {isUser ? 'You' : 'Health Assistant'}
            </p>
            {message.isOffline && <WifiOff className="w-3 h-3 text-slate-400" />}
          </div>

          {/* Content */}
          {isExpert ? (
            <div className="space-y-4 text-sm">
              <p>
                Based on your symptoms, here are the most likely conditions:
              </p>
              {message.content.matches.map((m: any, i: number) => (
                <div
                  key={i}
                  className="p-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800"
                >
                  <h3 className="font-bold text-blue-600 dark:text-blue-400">
                    🩺 {m.name}{' '}
                    <span className="text-xs text-slate-500">
                      (matched {m.score} symptom{m.score > 1 ? 's' : ''})
                    </span>
                  </h3>
                  <ul className="mt-2 space-y-1">
                    <li>
                      <span className="font-semibold">Description:</span>{' '}
                      {m.description}
                    </li>
                    <li>
                      <span className="font-semibold">Typical symptoms:</span>{' '}
                      {m.symptoms.join(', ')}...
                    </li>
                    <li>
                      <span className="font-semibold">Next question:</span>{' '}
                      {m.question}
                    </li>
                  </ul>
                  <p className="mt-2 italic text-xs text-slate-500">
                    {m.summary}
                  </p>
                </div>
              ))}
              <p className="text-sm">
                Could you tell me more so I can refine the guidance?
              </p>
            </div>
          ) : (
            <p className="text-sm">
              {typeof message.content === 'string'
                ? message.content
                : JSON.stringify(message.content)}
            </p>
          )}

          {/* Timestamp */}
          <p
            className={`text-xs mt-1 ${
              isUser ? 'text-blue-100' : 'text-slate-500'
            }`}
          >
            {message.timestamp.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
      </div>
    </motion.div>
  )
}