import express from 'express'
import JWTAuth from '../../auth/token'

//Router
const usersRouter = express.Router()

usersRouter.use(JWTAuth)
