import express from 'express'
import createHttpError from 'http-errors'
import UserModel from '../../db/models/userModel.js'
import { userPostValidation } from '../../validation.js'

//Router
const registerRouter = express.Router()

registerRouter.post("/", userPostValidation, async (req, res, next) => {
    try {
      const errorsList = validationResult(req);
      if (!errorsList.isEmpty()) {
        next(createHttpError(400, { errorsList }));
      }
      const newUser = new UserModel(req.body);
      // .pre() hook for save now contains a function
      // the function will hash the plain text password
      // hashed one will be saved to the database
      // What is returned from creation of new user is the _id. 
      const {_id} = await newUser.save();
      res.send({_id});
  
    } catch (error) {
      console.log(error);
      // error code 11000 seems to be the error for duplicate value found within database for some unique field of a document.
      if(error.code === 11000) {
        next(createHttpError(409, "Email already exists."))
      } else {
        next(error);
      }
    }
  })

  export default registerRouter