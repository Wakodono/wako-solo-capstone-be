import express from 'express'
import cors from 'cors'
import listEndpoints from 'express-list-endpoints'
import passport from 'passport'
import mongoose from 'mongoose'
import registerRouter from './services/register/index.js'
// import usersRouter from './services/users/index.js'
import loginRouter from './services/login/index.js'
import userRouter from './services/singleUser/index.js'
import {
    badRequestHandler,
    notFoundHandler,
    genericErrorHandler,
    forbiddenHandler,
    unauthorizedHandler,
    duplicateEmailHandler
} from './errorHandlers.js'

const server = express()

const whitelist = [process.env.FE_LOCAL_URL, process.env.REACT_APP_FE_PROD_URL]

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || whitelist.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error({ status: 500, message: "CORS ERROR" }))
        }
    },
}

// Passport config for Google auth will go here

// Global middlewares

server.use(cors(corsOptions))
server.use(express.json())
// server.use(passport.initialize())

// Routes

server.use("/register", registerRouter)
server.use("/login", loginRouter)
server.use("/me", userRouter)
// server.use("users", usersRouter)

// Error handling middlewares

server.use(unauthorizedHandler)
server.use(forbiddenHandler)
server.use(duplicateEmailHandler)
server.use(badRequestHandler)
server.use(notFoundHandler)
server.use(genericErrorHandler)

const PORT = process.env.PORT || 3001

mongoose.connect(process.env.MONGODB_URI)
mongoose.connection.on("connected", () => {
    server.listen(PORT, () => {
        console.table(listEndpoints(server))
        console.log("Server is running on port:", PORT)
    })
})