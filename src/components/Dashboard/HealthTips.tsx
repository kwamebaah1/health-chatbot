'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Lightbulb, Clock, TrendingUp } from 'lucide-react'

const healthTips = [
  {
    title: 'Stay Hydrated',
    description: 'Drink at least 8 glasses of water daily for optimal health.',
    icon: Lightbulb,
    time: '2 min read'
  },
  {
    title: 'Regular Exercise',
    description: '30 minutes of daily exercise can significantly improve cardiovascular health.',
    icon: TrendingUp,
    time: '5 min read'
  },
  {
    title: 'Sleep Quality',
    description: 'Aim for 7-9 hours of quality sleep each night for better recovery.',
    icon: Clock,
    time: '3 min read'
  }
]

export function HealthTips() {
  return (
    <Card className="bg-white dark:bg-slate-800 border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          <span>Health Tips</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {healthTips.map((tip, index) => {
          const Icon = tip.icon
          
          return (
            <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700">
              <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/20">
                <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-slate-900 dark:text-white">
                  {tip.title}
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  {tip.description}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                  {tip.time}
                </p>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}