import fs from 'fs'
import path from 'path'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { TrendingUp, Calendar, RefreshCw, AlertCircle } from 'lucide-react'

interface Tweet {
  id: string
  text: string
  author: string
  handle: string
  likes: number
  retweets: number
  replies: number
  url: string
  timestamp: string
}

interface Data {
  date: string
  tweets: Tweet[]
}

export const dynamic = 'force-static'

async function getTweetsData(): Promise<Data> {
  const filePath = path.join(process.cwd(), 'public/data/tweets.json')

  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8')
      return JSON.parse(data)
    }
  } catch (error) {
    console.error('Error reading tweets data:', error)
  }

  return {
    date: new Date().toISOString(),
    tweets: [],
  }
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))

  if (diffHours < 1) {
    const diffMinutes = Math.floor(diffMs / (1000 * 60))
    return diffMinutes === 0 ? '刚刚' : `${diffMinutes}分钟前`
  }
  if (diffHours < 24) {
    return `${diffHours}小时前`
  }
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays < 7) {
    return `${diffDays}天前`
  }
  return format(date, 'MM月dd日', { locale: zhCN })
}

export default async function Home() {
  const data = await getTweetsData()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                AI Twitter Daily
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                每日 X (Twitter) AI 话题最热 Top 10
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-xl shadow-md">
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calendar className="w-5 h-5" />
              <span className="font-medium">
                {data.date ? format(new Date(data.date), 'yyyy年MM月dd日 HH:mm', { locale: zhCN }) : '等待数据更新...'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <RefreshCw className="w-4 h-4" />
              <span>每日自动更新</span>
            </div>
          </div>
        </header>

        {data.tweets.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
            <AlertCircle className="w-16 h-16 text-amber-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              暂无数据
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-center">
              正在爬取今日热门推文，请稍后回来查看。
              <br />
              数据将在每日定时任务运行后自动更新。
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {data.tweets.map((tweet, index) => (
              <div
                key={tweet.id}
                 className="bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
              >
                <div className="p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900 dark:text-white truncate">
                          {tweet.author}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400">
                          @{tweet.handle}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {formatRelativeTime(tweet.timestamp)}
                      </div>
                    </div>
                    <a
                      href={tweet.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                      </svg>
                    </a>
                   </div>

                  <p className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
                    {tweet.text}
                   </p>
                </div>

                <div className="flex items-center justify-around px-5 py-3 bg-gray-50 dark:bg-slate-700/50 border-t border-gray-100 dark:border-slate-700">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span className="text-sm font-medium">{formatNumber(tweet.replies)}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span className="text-sm font-medium">{formatNumber(tweet.retweets)}</span>
                  </div>

                  <div className="flex items-center gap-2 text-red-500">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span className="text-sm font-medium">{formatNumber(tweet.likes)}</span>
                  </div>
                </div>
              </div>
            ))}
           </div>
         )}

        <footer className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>数据来源: X (Twitter) | 每日自动爬取 | Powered by Next.js & Playwright</p>
        </footer>
      </div>
    </div>
  )
}
