import express from "express";
import Parser from "rss-parser";
import { cached } from "../../lib/cache.js";

// Aggregates crypto news from public RSS feeds. Replaces the Bing News Search API, which Microsoft retired in 2025.
const newsRouter = express.Router()

export const FEEDS = [
    { source: "CoinDesk", url: "https://www.coindesk.com/arc/outboundfeeds/rss/" },
    { source: "Cointelegraph", url: "https://cointelegraph.com/rss" },
    { source: "Decrypt", url: "https://decrypt.co/feed" },
]

const CACHE_TTL_MS = 10 * 60 * 1000
const MAX_COUNT = 50

const parser = new Parser({
    customFields: { item: ["media:content", "media:thumbnail"] },
})

export function toArticle(item, source) {
    return {
        title: item.title,
        url: item.link,
        description: item.contentSnippet || "",
        image: item.enclosure?.url || item["media:content"]?.$?.url || item["media:thumbnail"]?.$?.url || null,
        source,
        publishedAt: item.isoDate || null,
    }
}

async function fetchFeed({ source, url }) {
    const response = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (CoinView news reader)" } })
    if (!response.ok) throw new Error(`${source} feed responded with ${response.status}`)

    const feed = await parser.parseString(await response.text())
    return feed.items.map((item) => toArticle(item, source))
}

async function fetchAllArticles() {
    // One failing feed shouldn't empty the page, so keep whatever succeeds.
    const results = await Promise.allSettled(FEEDS.map(fetchFeed))
    results
        .filter((result) => result.status === "rejected")
        .forEach((result) => console.log("News feed error:", result.reason.message))

    if (results.every((result) => result.status === "rejected")) {
        throw new Error("All news feeds failed")
    }

    return results
        .filter((result) => result.status === "fulfilled")
        .flatMap((result) => result.value)
        .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
}

export function filterArticles(articles, query) {
    if (!query || query.toLowerCase() === "cryptocurrency") return articles

    const term = query.toLowerCase()
    return articles.filter((article) =>
        `${article.title} ${article.description}`.toLowerCase().includes(term)
    )
}

newsRouter.get("/", async (req, res, next) => {
    try {
        const count = Math.min(Number(req.query.count) || 12, MAX_COUNT)
        const articles = await cached("news", CACHE_TTL_MS, fetchAllArticles)

        res.send({ articles: filterArticles(articles, req.query.q).slice(0, count) })
    } catch (error) {
        next(error)
    }
})

export default newsRouter
