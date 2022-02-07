import express from 'express'
import multer from 'multer'
import { getUsers, getUserById, updateUserAvatar, newUser, editUser, deleteUser } from '../../db/controllers/users.controller.js'
import JWTAuth from '../../auth/token'
import adminAuth from '../../auth/admin'


//Router
const usersRouter = express.Router()

usersRouter.use(JWTAuth)
usersRouter.use(adminAuth)
