import express from 'express'
import adminAuth from '../../auth/admin.js'
import JWTAuth from '../../auth/token.js'
import { deleteUser, editUser, getUserById, getUsers, newUser, updateUserAvatar } from '../../db/controllers/users.controller.js'
import { uploadAvatarImageToCloud } from '../../lib/image-tools.js'
import { userPostValidation } from '../../validation.js'


//Router
const usersRouter = express.Router()

usersRouter.use(JWTAuth)
usersRouter.use(adminAuth)

//GET, POST - users/
usersRouter.route("/")
  .get(getUsers)
  .post(userPostValidation, newUser);

//GET, PUT, DELETE - /users/:id
usersRouter.route("/:id")
  .get(getUserById)
  .put(editUser)
  .delete(deleteUser);

// Upload user avatar image
usersRouter.post("/:id/uploadAvatar", uploadAvatarImageToCloud, updateUserAvatar)

export default usersRouter