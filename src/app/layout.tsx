import './globals.css'

export const metadata = {
  title: 'AI Twitter Daily - Top 10 AI Tweets',
  description: 'Daily top 10 AI-related tweets from X (Twitter)',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}
