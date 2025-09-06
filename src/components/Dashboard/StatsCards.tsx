'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Activity, Footprints, Moon, Flame } from 'lucide-react'
import { motion } from 'framer-motion'

interface StatsCardsProps {
  data: {
    heartRate: number
    steps: number
    sleep: number
    calories: number
  }
}

export function StatsCards({ data }: StatsCardsProps) {
  const stats = [
    {
      label: 'Heart Rate',
      value: `${data.heartRate} bpm`,
      icon: Activity,
      color: 'text-red-500'
    },
    {
      label: 'Steps Today',
      value: data.steps.toLocaleString(),
      icon: Footprints,
      color: 'text-green-500'
    },
    {
      label: 'Sleep',
      value: `${data.sleep.toFixed(1)} hrs`,
      icon: Moon,
      color: 'text-blue-500'
    },
    {
      label: 'Calories',
      value: data.calories.toLocaleString(),
      icon: Flame,
      color: 'text-orange-500'
    }
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="bg-white dark:bg-slate-800 border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full bg-opacity-20 ${stat.color.replace('text', 'bg')}`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}