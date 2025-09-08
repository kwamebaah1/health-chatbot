'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '../ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Plus, Calendar, Download, Share } from 'lucide-react'
import { useChat } from '@/hooks/useChat'

export function QuickActions() {
  const { messages, addMessage } = useChat()

  // Modal states
  const [isLogModalOpen, setLogModalOpen] = useState(false)
  const [isAppointmentModalOpen, setAppointmentModalOpen] = useState(false)

  // Form inputs
  const [symptomInput, setSymptomInput] = useState('')
  const [appointmentDate, setAppointmentDate] = useState('')

  // Handlers
  const handleLogSubmit = () => {
    if (symptomInput.trim()) {
      addMessage(`Patient logged health data: ${symptomInput}`)
      setSymptomInput('')
      setLogModalOpen(false)
    }
  }

  const handleAppointmentSubmit = () => {
    if (appointmentDate) {
      const date = new Date(appointmentDate)
      if (!isNaN(date.getTime())) {
        addMessage(`Appointment scheduled for ${date.toLocaleString()}`)
        setAppointmentDate('')
        setAppointmentModalOpen(false)
      }
    }
  }

  const quickActions = [
    {
      label: 'Log Health Data',
      icon: Plus,
      color: 'bg-blue-500',
      action: () => setLogModalOpen(true),
    },
    {
      label: 'Schedule Appointment',
      icon: Calendar,
      color: 'bg-green-500',
      action: () => setAppointmentModalOpen(true),
    },
    {
      label: 'Export Records',
      icon: Download,
      color: 'bg-purple-500',
      action: () => {
        const blob = new Blob([JSON.stringify(messages, null, 2)], {
          type: 'application/json',
        })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'health-records.json'
        a.click()
        URL.revokeObjectURL(url)
      },
    },
    {
      label: 'Share Status',
      icon: Share,
      color: 'bg-orange-500',
      action: () => {
        if (messages.length === 0) {
          return alert('No status to share yet.')
        }
        const lastMessage = messages[messages.length - 1].content
        navigator.clipboard.writeText(lastMessage)
        alert('Latest status copied to clipboard.')
      },
    },
  ]

  return (
    <>
      {/* Quick Actions Card */}
      <Card className="bg-white dark:bg-slate-800 border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3">
          {quickActions.map((action, index) => {
            const Icon = action.icon
            return (
              <Button
                key={index}
                variant="outline"
                onClick={action.action}
                className="h-auto py-3 flex flex-col items-center justify-center space-y-2 bg-slate-50 dark:bg-slate-700 border-0 cursor-pointer"
              >
                <div
                  className={`w-10 h-10 rounded-full ${action.color} flex items-center justify-center`}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-medium">{action.label}</span>
              </Button>
            )
          })}
        </CardContent>
      </Card>

      {/* Log Health Data Modal */}
      <Dialog open={isLogModalOpen} onOpenChange={setLogModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log Health Data</DialogTitle>
            <DialogDescription>
              Enter symptoms or health measurements you want to record.
            </DialogDescription>
          </DialogHeader>
          <Input
            placeholder='e.g. "Fever 38°C, Headache"'
            value={symptomInput}
            onChange={(e) => setSymptomInput(e.target.value)}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setLogModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleLogSubmit}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule Appointment Modal */}
      <Dialog open={isAppointmentModalOpen} onOpenChange={setAppointmentModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Appointment</DialogTitle>
            <DialogDescription>
              Choose a date and time for your appointment.
            </DialogDescription>
          </DialogHeader>
          <Input
            type="datetime-local"
            value={appointmentDate}
            onChange={(e) => setAppointmentDate(e.target.value)}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setAppointmentModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAppointmentSubmit}>Schedule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
