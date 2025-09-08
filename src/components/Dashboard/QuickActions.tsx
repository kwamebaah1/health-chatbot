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
import { Plus, Pill, Download, Info } from 'lucide-react'
import { useChat } from '@/hooks/useChat'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"

export function QuickActions() {
  const { messages, addMessage } = useChat()

  // Modals
  const [isLogModalOpen, setLogModalOpen] = useState(false)
  const [isReminderModalOpen, setReminderModalOpen] = useState(false)
  const [isInfoModalOpen, setInfoModalOpen] = useState(false)

  // Inputs
  const [symptomInput, setSymptomInput] = useState('')
  const [reminderDate, setReminderDate] = useState<Date | null>(null)
  const [reminderNote, setReminderNote] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Handlers
  const handleLogSubmit = async () => {
    if (!symptomInput.trim() || !userEmail.trim()) {
      toast.error("Please enter both email and health data")
      return
    }
    
    setIsLoading(true)
    try {
      const { error } = await supabase
        .from('activity_logs')
        .insert({
          user_email: userEmail,
          content: symptomInput
        })

      if (error) throw error

      // Add to chat
      addMessage(`Patient logged health data: ${symptomInput}`)
      
      toast.success("Success, Health data logged successfully")
      
      setSymptomInput('')
      setLogModalOpen(false)
    } catch (error) {
      console.error('Error saving health data:', error)
      toast.error("Error, Failed to save health data. Please try again")
    } finally {
      setIsLoading(false)
    }
  }

  const handleReminderSubmit = async () => {
    if (!reminderDate || !reminderNote.trim() || !userEmail.trim()) {
      toast.error("Please enter email, date/time, and reminder details")
      return
    }
    
    setIsLoading(true)
    try {
      // Save to Supabase
      const { error } = await supabase
        .from('reminders')
        .insert({
          user_email: userEmail,
          note: reminderNote,
          reminder_time: reminderDate.toISOString()
        })

      if (error) throw error

      // Add to chat
      addMessage(`Medication reminder set for ${reminderDate.toLocaleString()}: ${reminderNote}`)
      
      toast.success(`Reminder Set Reminder scheduled for ${reminderDate.toLocaleString()}`)
      
      setReminderDate(null)
      setReminderNote('')
      setReminderModalOpen(false)

      // Setup real-time reminder (client-side)
      const timeUntilReminder = reminderDate.getTime() - Date.now()
      if (timeUntilReminder > 0) {
        setTimeout(() => {
          toast.success(`💊 Medication Reminder, ${reminderNote}`)
          
          // Also add a chat message when reminder triggers
          addMessage(`🔔 REMINDER: ${reminderNote}`)
        }, timeUntilReminder)
      }

    } catch (error) {
      console.error('Error setting reminder:', error)
      toast.error("Error, Failed to set reminder. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const exportRecords = () => {
    if (messages.length === 0) {
      toast.error("No Data, No records to export yet.")
      return
    }

    const blob = new Blob([JSON.stringify(messages, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `health-records-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    
    toast.success("Exported, Health records downloaded successfully")
  }

  const quickActions = [
    {
      label: 'Log Health Data',
      icon: Plus,
      color: 'bg-blue-500',
      action: () => setLogModalOpen(true),
    },
    {
      label: 'Set Medication Reminder',
      icon: Pill,
      color: 'bg-green-500',
      action: () => setReminderModalOpen(true),
    },
    {
      label: 'Export Records',
      icon: Download,
      color: 'bg-purple-500',
      action: exportRecords,
    },
    {
      label: 'Learn More',
      icon: Info,
      color: 'bg-orange-500',
      action: () => setInfoModalOpen(true),
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
                disabled={isLoading}
              >
                <div
                  className={`w-10 h-10 rounded-full ${action.color} flex items-center justify-center ${isLoading ? 'opacity-50' : ''}`}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-medium">{action.label}</span>
              </Button>
            )
          })}
        </CardContent>
      </Card>

      {/* Email Input */}
      <Card className="mt-4 bg-white dark:bg-slate-800 border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Your Email</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type="email"
            placeholder="Enter your email address"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            className="w-full"
          />
          <p className="text-sm text-muted-foreground mt-2">
            This will be used to save your health data and reminders.
          </p>
        </CardContent>
      </Card>

      {/* Activity Log */}
      {messages.length > 0 && (
        <Card className="mt-4 bg-white dark:bg-slate-800 border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Activity Log</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className="p-2 rounded-md bg-slate-100 dark:bg-slate-700 text-sm"
              >
                {msg.content}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Log Health Data Modal */}
      <Dialog open={isLogModalOpen} onOpenChange={setLogModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log Health Data</DialogTitle>
            <DialogDescription>
              Enter symptoms or health measurements you want to record.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type="email"
              placeholder="Your email address"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              required
            />
            <Input
              placeholder='e.g. "Fever 38°C, Headache"'
              value={symptomInput}
              onChange={(e) => setSymptomInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogSubmit()}
            />
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setLogModalOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleLogSubmit} 
              disabled={!userEmail.trim() || !symptomInput.trim() || isLoading}
            >
              {isLoading ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Medication Reminder Modal */}
      <Dialog open={isReminderModalOpen} onOpenChange={setReminderModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Medication Reminder</DialogTitle>
            <DialogDescription>
              Choose a date, time, and note for your medication reminder.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type="email"
              placeholder="Your email address"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              required
            />
            <div className="relative">
              <DatePicker
                selected={reminderDate}
                onChange={(date: Date) => setReminderDate(date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="MMMM d, yyyy h:mm aa"
                placeholderText="Select date and time"
                minDate={new Date()}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <Input
              placeholder="Medication details (e.g. Take 1 tablet of Paracetamol)"
              value={reminderNote}
              onChange={(e) => setReminderNote(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleReminderSubmit()}
            />
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setReminderModalOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleReminderSubmit} 
              disabled={!userEmail.trim() || !reminderDate || !reminderNote.trim() || isLoading}
            >
              {isLoading ? 'Setting...' : 'Set Reminder'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Learn More Modal */}
      <Dialog open={isInfoModalOpen} onOpenChange={setInfoModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>About Our System</DialogTitle>
            <DialogDescription>
              Our health management system helps you track symptoms, set
              medication reminders, export your health records, and manage your
              overall wellbeing. Designed with simplicity and security in mind,
              it empowers you to take control of your healthcare journey.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setInfoModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
