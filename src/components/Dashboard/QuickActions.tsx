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
import { Plus, FileText, Download, Info, ChevronDown, ChevronUp, Calendar, User } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import { ChatMessage } from '@/types/chat'

interface QuickActionsProps {
  messages: ChatMessage[]
  addMessage: (content: string) => Promise<void>
}

export function QuickActions({ messages, addMessage }: QuickActionsProps) {
  // Modals
  const [isLogModalOpen, setLogModalOpen] = useState(false)
  const [isSummaryModalOpen, setSummaryModalOpen] = useState(false)
  const [isInfoModalOpen, setInfoModalOpen] = useState(false)
  const [isLogOpen, setIsLogOpen] = useState(false)

  // Inputs
  const [symptomInput, setSymptomInput] = useState('')
  const [patientId, setPatientId] = useState('')
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

  const handleGenerateSummary = async () => {
    if (messages.length === 0) {
      toast.error("No conversation history to generate a summary from")
      return
    }

    setIsLoading(true)
    try {
      // Generate a summary from the conversation
      const conversationText = messages.map(m => 
        `${m.role === 'user' ? 'Patient' : 'Assistant'}: ${m.content}`
      ).join('\n')
      
      const summary = `Patient Conversation Summary (Generated ${new Date().toLocaleString()}):\n\n${conversationText}\n\n---\nSummary: This conversation covers patient-reported symptoms and medical advice provided.`

      // ✅ Save summary to localStorage
      const savedSummaries = JSON.parse(localStorage.getItem("patient_summaries") || "[]")
      const newSummary = {
        user_email: userEmail,
        patient_id: patientId || 'unknown',
        summary,
        created_at: new Date().toISOString(),
      }

      savedSummaries.push(newSummary)
      sessionStorage.setItem("patient_summaries", JSON.stringify(savedSummaries))

      // Add to chat
      addMessage(`Generated patient summary for ${patientId || 'current session'}`)

      toast.success("Patient summary saved locally")

      setPatientId('')
      setSummaryModalOpen(false)
      setLogModalOpen(true)

    } catch (error) {
      console.error('Error generating summary:', error)
      toast.error("Error, Failed to generate summary. Please try again.")
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
      label: 'Generate Summary',
      icon: FileText,
      color: 'bg-green-500',
      action: () => {
        if (messages.length === 0) {
          toast.error("Please start a conversation first to generate a summary")
        } else {
          setSummaryModalOpen(true)
        }
      },
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
            This will be used to save your health data and summaries.
          </p>
        </CardContent>
      </Card>

      {/* Activity Log */}
      {JSON.parse(sessionStorage.getItem("patient_summaries") || "[]").length > 0 && (
        <Card className="mt-4 bg-white dark:bg-slate-800 border-0 shadow-sm overflow-hidden transition-all duration-300 ease-in-out">
          <CardHeader 
            className="flex flex-row justify-between items-center p-4 cursor-pointer hover:bg-grey-50 dark:hover:bg-slate-750 transition-colors duration-200"
            onClick={() => setIsLogOpen(!isLogOpen)}
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold">Activity Log</CardTitle>
                <p className="text-sm text-muted-foreground">
                  View your generated health summaries
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 rounded-full"
            >
              {isLogOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CardHeader>

          {/* Animated Content Area */}
          <div className={`
            overflow-hidden transition-all duration-300 ease-in-out
            ${isLogOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}
          `}>
            <CardContent className="p-4 space-y-4">
              {JSON.parse(sessionStorage.getItem("patient_summaries") || "[]")
                .map((summary: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 backdrop-blur-sm transition-all hover:shadow-sm"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-muted-foreground">
                          {new Date(summary.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {summary.patient_id || 'Unknown ID'}
                        </span>
                      </div>
                    </div>
                    <div className="p-3 rounded-md bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-sm whitespace-pre-wrap font-mono">
                      {summary.summary}
                    </div>
                  </div>
                ))}
              
              {JSON.parse(sessionStorage.getItem("patient_summaries") || "[]").length === 0 && (
                <div className="text-center py-6 text-muted-foreground">
                  No activity records yet. Generate a summary to see it here.
                </div>
              )}
            </CardContent>
          </div>
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

      {/* Patient Summary Modal */}
      <Dialog open={isSummaryModalOpen} onOpenChange={setSummaryModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate Patient Summary</DialogTitle>
            <DialogDescription>
              Create a summary of the current conversation for patient records.
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
              placeholder="Patient ID (optional)"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
            />
            <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-md">
              <p className="text-sm text-muted-foreground">
                {messages.length === 0 
                  ? "No conversation history available. Please chat with the assistant first."
                  : `This will generate a summary based on the current conversation history (${messages.length} messages) and save it to the database.`
                }
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setSummaryModalOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleGenerateSummary} 
              disabled={!userEmail.trim() || isLoading || messages.length === 0}
            >
              {isLoading ? 'Generating...' : 'Generate Summary'}
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
              Our medical assistant system helps healthcare professionals track patient symptoms, 
              generate consultation summaries, export medical records, and manage patient interactions. 
              Designed with medical expertise in mind, it streamlines clinical documentation and 
              enhances patient care.
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
