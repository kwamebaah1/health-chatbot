'use client'

import { Button } from '@/components/ui/button'
import { ChatMode } from '@/types/chat'
import { Wifi, WifiOff, Sparkles } from 'lucide-react'

interface ModeToggleProps {
  mode: ChatMode
  setMode: (mode: ChatMode) => void
  isOnline: boolean
}

export function ModeToggle({ mode, setMode, isOnline }: ModeToggleProps) {
  const modes: { id: ChatMode; label: string; icon: React.ReactNode }[] = [
    {
      id: 'online',
      label: 'Online',
      icon: <Wifi className="w-4 h-4" />
    },
    {
      id: 'offline',
      label: 'Offline',
      icon: <WifiOff className="w-4 h-4" />
    },
    {
      id: 'auto',
      label: 'Auto',
      icon: <Sparkles className="w-4 h-4" />
    }
  ]

  return (
    <div className="flex items-center gap-2 p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
      {modes.map((m) => (
        <Button
          key={m.id}
          variant={mode === m.id ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setMode(m.id)}
          className="flex items-center gap-2"
          disabled={m.id === 'online' && !isOnline}
        >
          {m.icon}
          <span className="hidden sm:inline">{m.label}</span>
        </Button>
      ))}
    </div>
  )
}