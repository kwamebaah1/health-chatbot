'use client'

import { ChatMode } from '@/types/chat'
import { Wifi, WifiOff, AutoAwesome } from '@mui/icons-material'

interface ConnectionStatusProps {
  isOnline: boolean
  currentMode: 'online' | 'offline'
}

export function ConnectionStatus({ isOnline, currentMode }: ConnectionStatusProps) {
  return (
    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
      {currentMode === 'online' ? (
        <>
          <Wifi className="w-4 h-4 text-green-500" />
          <span>Online AI Mode</span>
        </>
      ) : (
        <>
          <WifiOff className="w-4 h-4 text-orange-500" />
          <span>Offline Expert System</span>
        </>
      )}
      {!isOnline && (
        <span className="text-xs text-orange-500">(No Internet Connection)</span>
      )}
    </div>
  )
}