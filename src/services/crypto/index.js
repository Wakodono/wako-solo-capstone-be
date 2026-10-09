import express from "express";
import { cached } from "../../lib/cache.js";

// Proxies Coinranking (via RapidAPI) so the API key stays on the server.
const cryptoRouter = express.Router()

const CACHE_TTL_MS = 60 * 1000

async function forwardToCoinranking(req, res, next) {
    const key = process.env.RAPIDAPI_KEY
    if (!key) {
        return res.status(503).send({ message: "Crypto data is not configured on the server." })
    }

    const host = process.env.RAPIDAPI_CRYPTO_HOST || "coinranking1.p.rapidapi.com"
    const url = `https://${host}${req.url}`

    try {
        const { status, body } = await cached(url, CACHE_TTL_MS, async () => {
            const response = await fetch(url, {
                headers: { "x-rapidapi-host": host, "x-rapidapi-key": key },
            })
            return { status: response.status, body: await response.json() }
        })
        res.status(status).send(body)
    } catch (error) {
        next(error)
    }
}

cryptoRouter.get("/coins", forwardToCoinranking)
cryptoRouter.get("/exchanges", forwardToCoinranking)
cryptoRouter.get("/coin/:coinId", forwardToCoinranking)
cryptoRouter.get("/coin/:coinId/history", forwardToCoinranking)

export default cryptoRouter
