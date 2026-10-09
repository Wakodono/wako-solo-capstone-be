import { test, beforeEach, afterEach, mock } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import app from "../src/app.js";
import { clearCache } from "../src/lib/cache.js";

beforeEach(() => {
    clearCache()
    process.env.RAPIDAPI_KEY = "test-key"
})

afterEach(() => {
    mock.restoreAll()
    delete process.env.RAPIDAPI_KEY
})

test("forwards the path and query to Coinranking with the server-side key", async () => {
    const fetchMock = mock.method(globalThis, "fetch", async () =>
        new Response(JSON.stringify({ data: { coins: [] } }), { status: 200 })
    )

    const res = await request(app).get("/crypto/coins?limit=10")

    assert.equal(res.status, 200)
    assert.deepEqual(res.body, { data: { coins: [] } })

    const [url, options] = fetchMock.mock.calls[0].arguments
    assert.equal(url, "https://coinranking1.p.rapidapi.com/coins?limit=10")
    assert.equal(options.headers["x-rapidapi-key"], "test-key")
})

test("passes upstream error statuses through", async () => {
    mock.method(globalThis, "fetch", async () =>
        new Response(JSON.stringify({ message: "Too many requests" }), { status: 429 })
    )

    const res = await request(app).get("/crypto/coin/Qwsogvtv82FCd")

    assert.equal(res.status, 429)
})

test("serves repeat requests from the cache", async () => {
    const fetchMock = mock.method(globalThis, "fetch", async () =>
        new Response(JSON.stringify({ data: {} }), { status: 200 })
    )

    await request(app).get("/crypto/exchanges")
    await request(app).get("/crypto/exchanges")

    assert.equal(fetchMock.mock.callCount(), 1)
})

test("returns 503 when the API key is missing", async () => {
    delete process.env.RAPIDAPI_KEY

    const res = await request(app).get("/crypto/coins")

    assert.equal(res.status, 503)
})

test("does not proxy paths outside the allowed list", async () => {
    const fetchMock = mock.method(globalThis, "fetch", async () => new Response("{}"))

    const res = await request(app).get("/crypto/markets")

    assert.equal(res.status, 404)
    assert.equal(fetchMock.mock.callCount(), 0)
})
