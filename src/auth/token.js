import createHttpError from "http-errors";
import UserModel from "../db/models/users.model.js";
import { verifyJWToken } from "./tools.js";

export default async function JWTAuth(req,res,next) {
  try {

    if(req.headers.authorization) {

      const jwtoken = req.headers.authorization.replace("Bearer ", "");
      //const jwtoken = req.headers.authorization.split("Bearer ", "");
      const decodedToken = await verifyJWToken(jwtoken);

      const user = await UserModel.findById(decodedToken._id);
      if(user) {
        req.user = user;
        next();
      } else {
        next(createHttpError(404, "User not found."));
      }
    } else {
      next(createHttpError(401, "Please provide authorization token."))
    }
  } catch (error) {
    console.log(error);
    next(error) 
  }
}