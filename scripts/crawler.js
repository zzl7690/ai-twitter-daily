const { chromium } = require('playwright')
const fs = require('fs')
const path = require('path')

const DATA_DIR = path.join(__dirname, '../public/data')
const DATA_FILE = path.join(DATA_DIR, 'tweets.json')

async function scrapeAITweets() {
  const browser = await chromium.launch({
    headless: false,
  })

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
  })

  const page = await context.newPage()

  console.log('Navigating to X (Twitter)...')

  try {
    await page.goto('https://x.com/explore/tabs/for-you', {
      waitUntil: 'networkidle',
    })

    console.log('Waiting for login...')

    await page.waitForTimeout(10000)

    const isLoggedIn = await page.locator('[data-testid="SideNav_AccountSwitcher_Button"]').isVisible().catch(() => false)

    if (!isLoggedIn) {
      console.log('Not logged in. Please log in manually in the browser window.')
      console.log('Waiting 120 seconds for you to log in...')

      await page.waitForTimeout(120000)

      const isNowLoggedIn = await page.locator('[data-testid="SideNav_AccountSwitcher_Button"]').isVisible().catch(() => false)
      if (!isNowLoggedIn) {
        throw new Error('Still not logged in after timeout. Exiting...')
      }
    }

    console.log('Logged in! Searching for AI tweets...')

    await page.goto('https://x.com/search?q=%23AI%20lang%3Aen&src=typed_query&f=live', {
      waitUntil: 'networkidle',
    })

    await page.waitForTimeout(3000)

    console.log('Extracting tweets...')

    const tweets = await page.evaluate(() => {
      const tweetElements = document.querySelectorAll('article[data-testid="tweet"]')

      const results = []

      tweetElements.forEach((tweet, index) => {
        try {
          const article = tweet
          const textElement = article.querySelector('[data-testid="tweetText"]')

          if (!textElement) return

          const text = textElement.textContent?.trim() || ''

          if (!text) return

          const link = article.querySelector('a[href*="/status/"]')
          const statusUrl = link?.href || ''

          const urlMatch = statusUrl.match(/\/status\/(\d+)/)
          const tweetId = urlMatch ? urlMatch[1] : ''

          if (!tweetId) return

          const authorElement = article.querySelector('[data-testid="User-Name"] span')
          const author = authorElement?.textContent?.trim() || 'Unknown'

          const handleMatch = statusUrl.match(/x\.com\/([^/]+)/)
          const handle = handleMatch ? handleMatch[1] : ''

          const likesElement = article.querySelector('[data-testid="like"]')
          const likesText = likesElement?.textContent?.trim() || '0'

          const retweetsElement = article.querySelector('[data-testid="retweet"]')
          const retweetsText = retweetsElement?.textContent?.trim() || '0'

          const repliesElement = article.querySelector('[data-testid="reply"]')
          const repliesText = repliesElement?.textContent?.trim() || '0'

          const parseNumber = (text) => {
            if (!text) return 0
            const num = parseFloat(text.replace(/[^0-9.KMB]/g, ''))
            if (text.includes('K')) return Math.floor(num * 1000)
            if (text.includes('M')) return Math.floor(num * 1000000)
            if (text.includes('B')) return Math.floor(num * 1000000000)
            return Math.floor(num)
          }

          const likes = parseNumber(likesText)
          const retweets = parseNumber(retweetsText)
          const replies = parseNumber(repliesText)

          const timestampElement = article.querySelector('time')
          const timestamp = timestampElement?.getAttribute('datetime') || new Date().toISOString()

          results.push({
            id: tweetId,
            text,
            author,
            handle,
            likes,
            retweets,
            replies,
            url: statusUrl,
            timestamp,
            engagementScore: likes + retweets * 2 + replies,
          })
        } catch (error) {
          console.error('Error parsing tweet:', error)
        }
      })

      return results
    })

    console.log(`Found ${tweets.length} tweets`)

    const topTweets = tweets
      .sort((a, b) => b.engagementScore - a.engagementScore)
      .slice(0, 10)

    console.log('Top 10 AI tweets:')

    topTweets.forEach((tweet, index) => {
      console.log(`\n${index + 1}. ${tweet.author} (@${tweet.handle})`)
      console.log(`   Likes: ${tweet.likes}, Retweets: ${tweet.retweets}, Replies: ${tweet.replies}`)
      console.log(`   ${tweet.text.substring(0, 100)}...`)
    })

    const data = {
      date: new Date().toISOString(),
      tweets: topTweets.map((t) => ({
        id: t.id,
        text: t.text,
        author: t.author,
        handle: t.handle,
        likes: t.likes,
        retweets: t.retweets,
        replies: t.replies,
        url: t.url,
        timestamp: t.timestamp,
      })),
    }

    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true })
    }

    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))

    console.log(`\nData saved to ${DATA_FILE}`)

  } catch (error) {
    console.error('Error during scraping:', error)
    throw error
  } finally {
    await browser.close()
  }
}

scrapeAITweets().catch(console.error)
