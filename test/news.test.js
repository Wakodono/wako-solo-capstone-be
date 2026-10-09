import { test, beforeEach, afterEach, mock } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import app from "../src/app.js";
import { clearCache } from "../src/lib/cache.js";
import { filterArticles } from "../src/services/news/index.js";

const rss = (items) => `<?xml version="1.0"?>
<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/">
  <channel><title>Feed</title>${items.join("")}</channel>
</rss>`

const item = (title, date, extra = "") => `
  <item>
    <title>${title}</title>
    <link>https://example.com/${encodeURIComponent(title)}</link>
    <description>&lt;p&gt;About ${title}&lt;/p&gt;</description>
    <pubDate>${date}</pubDate>
    ${extra}
  </item>`

beforeEach(() => clearCache())
afterEach(() => mock.restoreAll())

test("merges feeds, newest first, in the shape the frontend expects", async () => {
    mock.method(globalThis, "fetch", async (url) => {
        const body = url.includes("coindesk")
            ? rss([item("Bitcoin hits a high", "Tue, 06 Oct 2026 10:00:00 GMT", '<enclosure url="https://img.test/btc.jpg" type="image/jpeg" />')])
            : rss([item("Ethereum upgrade ships", "Wed, 07 Oct 2026 10:00:00 GMT", '<media:content url="https://img.test/eth.jpg" />')])
        return new Response(body, { status: 200 })
    })

    const res = await request(app).get("/news?count=10")

    assert.equal(res.status, 200)
    assert.equal(res.body.articles[0].title, "Ethereum upgrade ships")
    assert.deepEqual(res.body.articles.at(-1), {
        title: "Bitcoin hits a high",
        url: "https://example.com/Bitcoin%20hits%20a%20high",
        description: "About Bitcoin hits a high",
        image: "https://img.test/btc.jpg",
        source: "CoinDesk",
        publishedAt: "2026-10-06T10:00:00.000Z",
    })
})

test("keeps serving news when one feed fails", async () => {
    mock.method(globalThis, "fetch", async (url) =>
        url.includes("decrypt")
            ? new Response("Service unavailable", { status: 503 })
            : new Response(rss([item("Solana news", "Wed, 07 Oct 2026 10:00:00 GMT")]), { status: 200 })
    )

    const res = await request(app).get("/news")

    assert.equal(res.status, 200)
    assert.equal(res.body.articles.length, 2)
})

test("responds with an error when every feed fails", async () => {
    mock.method(globalThis, "fetch", async () => new Response("down", { status: 500 }))

    const res = await request(app).get("/news")

    assert.equal(res.status, 500)
})

test("filterArticles matches the coin name case-insensitively and treats 'Cryptocurrency' as everything", () => {
    const articles = [
        { title: "Bitcoin rallies", description: "" },
        { title: "Markets update", description: "Ethereum and XRP move" },
    ]

    assert.equal(filterArticles(articles, "Cryptocurrency").length, 2)
    assert.deepEqual(filterArticles(articles, "bitcoin").map((a) => a.title), ["Bitcoin rallies"])
    assert.deepEqual(filterArticles(articles, "XRP").map((a) => a.title), ["Markets update"])
})
