# Wako Solo Capstone Backend

This repository contains the backend for my Strive School solo capstone project, [CoinView](https://github.com/Wakodono/wako-solo-capstone), a cryptocurrency dashboard.

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [API Endpoints](#api-endpoints)
- [Running locally](#running-locally)

## Project Overview

The backend does two jobs:

1. **Proxies third-party data for the frontend.** Coin data comes from Coinranking via RapidAPI. The backend adds the API key server-side, so it isn't shipped in the React bundle. News is aggregated from public RSS feeds (CoinDesk, Cointelegraph, Decrypt) after the Bing News Search API the app originally used was retired.
2. **User accounts.** Registration, JWT login and admin-only user management, stored in MongoDB.

## Features

- **API key kept on the server** for all Coinranking requests
- **News aggregation** from three RSS feeds, filtered by coin name; one feed failing doesn't empty the page
- **In-memory caching** (60 seconds for coin data, 10 minutes for news) to stay within API rate limits
- **JWT-based login** with bcrypt password hashing
- **Error handling and input validation** with express-validator
- **CORS** restricted to the frontend's origins
- **Tests** for the proxy and news routes using Node's built-in test runner and Supertest

## Technologies Used

- **Node.js** and **Express**
- **MongoDB** with **Mongoose**
- **JWT** and **bcrypt**
- **rss-parser**
- **node:test** and **Supertest**

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /crypto/coins | Coin list and global stats (`?limit=`) |
| GET | /crypto/coin/:coinId | Details for one coin |
| GET | /crypto/coin/:coinId/history | Price history (`?timeperiod=`) |
| GET | /crypto/exchanges | Exchanges |
| GET | /news | Latest news (`?q=` coin name, `?count=` up to 50) |
| POST | /register | Register a new user |
| POST | /login | Log in and receive an access token |
| GET, PUT, DELETE | /me | The logged-in user's profile |
| GET, POST | /users | List or create users (admin only) |
| GET, PUT, DELETE | /users/:id | Manage one user (admin only) |

## Running locally

1. Copy `.env.example` to `.env` and fill in `RAPIDAPI_KEY`. `MONGODB_URI` and `JWT_SECRET` are only needed for the user routes.
2. `npm install`
3. `npm run dev` starts the server on port 3001.
4. `npm test` runs the tests.
