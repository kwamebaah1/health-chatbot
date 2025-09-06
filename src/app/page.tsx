import { ChatInterface } from '@/components/ChatInterface'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 py-8">
      <div className="container mx-auto px-4">
        <ChatInterface />
      </div>
    </main>
  )
}