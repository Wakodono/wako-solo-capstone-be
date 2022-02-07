import createHttpError from 'http-errors'
import { validationResult } from 'express-validator'
import UserModel from '../models/userModel.js'

export async function getUsers(req,res,next) {
    try {
      const users = await UserModel.find();
      const count = await UserModel.countDocuments();
      if (users.length) {
        res.send({total: count, results: users});
      } else {
        next(createHttpError(404, "No users to show."));
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
}

export async function getUserById(req,res,next) {
    try {
      const user = await UserModel.findById(req.params.id, {
        createdAt: 0,
        updatedAt: 0,
        __v: 0,
      });
      if (user) {
        res.send(user);
      } else {
        next(
          createHttpError(404, `No user found with an id: ${req.params.id}`)
        );
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  export async function newUser(req,res,next) {
    try {
      const errorsList = validationResult(req);
      if (!errorsList.isEmpty()) {
        next(createHttpError(400, { errorsList }));
      }
  
      const createdUser = new UserModel(req.body);
      const { _id } = await createdUser.save();
  
      res.send({_id});
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  export async function updateUserAvatar(req,res,next) {
    try {
      const imageUrl = req.file.path;
      const editedUser = await UserModel.findByIdAndUpdate(
        req.params.id,
        {avatar: imageUrl},
        {new: true}
      );
      if(editedUser) {
        res.send({status: "User avatar image uploaded successfully."});
      } else {
      next(createHttpError(400, `User not found by id: ${req.params.id}`));
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  export async function editUser(req,res,next) {
    try {
      const editedUser = await UserModel.findByIdAndUpdate(
        req.params.id, // User id
        req.body, // Request body - Information to update
        {new: true} // Return updated information about the user
      );
      if(editedUser) {
        res.send(editedUser);
      } else {
        next(createHttpError(400, `User not found by id: ${req.params.id}`));
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  export async function deleteUser(req,res,next) {
    try {
      const deletedUser = await UserModel.findByIdAndRemove(req.params.id);
      if(deletedUser) {
        res.status(204).send();
      } else {
        next(createHttpError(400, `Could not find user with the id: ${req.params.id}`));
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }