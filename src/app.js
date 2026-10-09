import express from 'express'
import cors from 'cors'
import passport from 'passport'
import registerRouter from './services/register/index.js'
import usersRouter from './services/users/index.js'
import loginRouter from './services/login/index.js'
import userRouter from './services/singleUser/index.js'
import cryptoRouter from './services/crypto/index.js'
import newsRouter from './services/news/index.js'
import {
    badRequestHandler,
    notFoundHandler,
    genericErrorHandler,
    forbiddenHandler,
    unauthorizedHandler,
    duplicateEmailHandler
} from './errorHandlers.js'

const app = express()

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

app.use(cors(corsOptions))
app.use(express.json())
// app.use(passport.initialize())

// Routes

app.use("/register", registerRouter)
app.use("/login", loginRouter)
app.use("/me", userRouter)
app.use("/users", usersRouter)
app.use("/crypto", cryptoRouter)
app.use("/news", newsRouter)

// Error handling middlewares

app.use(unauthorizedHandler)
app.use(forbiddenHandler)
app.use(duplicateEmailHandler)
app.use(badRequestHandler)
app.use(notFoundHandler)
app.use(genericErrorHandler)

export default app
