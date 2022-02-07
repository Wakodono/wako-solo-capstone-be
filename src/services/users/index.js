import express from 'express'
import multer from 'multer'
import JWTAuth from '../../auth/token'
import adminAuth from '../../auth/admin'


//Router
const usersRouter = express.Router()

usersRouter.use(JWTAuth)
usersRouter.use(adminAuth)
