# Wako Solo Capstone Backend

This repository contains the backend for my Strive School solo capstone project. The project is a **cryptocurrency dashboard designed to provide trading enthusiasts with real-time data and insights**. It serves as the server-side component, handling data storage, business logic, and API endpoints for the frontend application.

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [API Endpoints](#api-endpoints)

## Project Overview

The backend is built to support a **cryptocurrency dashboard application**. It provides a RESTful API to handle **user authentication, cryptocurrency data retrieval, and CRUD operations for trading data**. The project demonstrates skills in backend development, database management, and API design learned during the Strive School bootcamp.

## Features

- **User authentication and authorization** using JWT-based login
- **CRUD operations** for users and cryptocurrency data
- **Database integration** with MongoDB using Mongoose ORM
- **Error handling and input validation**
- **Real-time updates** for cryptocurrency prices
- **Secure password hashing** with bcrypt
- **Cross-origin resource sharing** (CORS) support

## Technologies Used

- **Node.js**: JavaScript runtime for building the server
- **Express.js**: Web framework for creating API endpoints
- **MongoDB**: NoSQL database for data storage
- **Mongoose**: ORM for MongoDB
- **JWT**: For secure user sessions
- **Bcrypt**: For password hashing
- **CORS**: For handling cross-origin requests
- **dotenv**: For managing environment variables
- **Deployment**: Deployed on Heroku


## API Endpoints

Below are the main endpoints of the cryptocurrency dashboard:

| Method | Endpoint               | Description                      |
|--------|------------------------|----------------------------------|
| GET    | /api/users             | Retrieve all users               |
| POST   | /api/users/register    | Register a new user              |
| POST   | /api/users/login       | Authenticate a user              |
| GET    | /api/cryptos           | Retrieve all cryptocurrencies    |
| GET    | /api/cryptos/:id       | Get a specific cryptocurrency by ID |
| POST   | /api/cryptos           | Add a new cryptocurrency         |
| PUT    | /api/cryptos/:id       | Update a specific cryptocurrency |
| DELETE | /api/cryptos/:id       | Delete a specific cryptocurrency |
