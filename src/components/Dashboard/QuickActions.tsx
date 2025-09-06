'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Calendar, Download, Share } from 'lucide-react'

const quickActions = [
  {
    label: 'Log Health Data',
    icon: Plus,
    description: 'Record symptoms or measurements',
    color: 'bg-blue-500'
  },
  {
    label: 'Schedule Appointment',
    icon: Calendar,
    description: 'Book with healthcare providers',
    color: 'bg-green-500'
  },
  {
    label: 'Export Records',
    icon: Download,
    description: 'Download your health data',
    color: 'bg-purple-500'
  },
  {
    label: 'Share Status',
    icon: Share,
    description: 'Share with family or doctors',
    color: 'bg-orange-500'
  }
]

export function QuickActions() {
  return (
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
              className="h-auto py-3 flex flex-col items-center justify-center space-y-2 bg-slate-50 dark:bg-slate-700 border-0"
            >
              <div className={`w-10 h-10 rounded-full ${action.color} flex items-center justify-center`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-medium">{action.label}</span>
            </Button>
          )
        })}
      </CardContent>
    </Card>
  )
}