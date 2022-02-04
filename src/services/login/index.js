import express from "express";
import createHttpError from "http-errors";
import UserModel from "../../db/models/userModel.js";
import { AuthenticateWithToken } from "../../auth/tools.js";
import passport from "passport";

//Router
const loginRouter = express.Router()

loginRouter.post("/", async (req, res, next) => {
    try {
        const {email, password} = req.body
        const user = await UserModel.checkCredentials(email, password)

        if (user) {
            const accessToken = await AuthenticateWithToken(user)
            res.send({accessToken})
        } else {
            next(createHttpError(401, "Please check credentials again."))
        }
    } catch (error) {
        console.log(error)
        next(error)
    }
})

// Requests are re-directed to Google Log-In.
loginRouter.get("/googleLogin", passport.authenticate("google", {
    // Scope: what information is supposed to be returned from the third-party provider, Google in this case after the login.
    scope: ["profile","email"]
}))

loginRouter.get("/googleRedirect", passport.authenticate("google"), async function handleRedirect(req,res,next) {
    try {
      // Due to use of passport serialize, the token(s) are now available within request
      // Redirect, attach with the redirect url as parameters the accessToken information
      //console.log(req.user.token);
      res.redirect(`${process.env.FE_URL}?accessToken=${req.user.token}`)
    } catch (error) {
      next(error);
    }
})

export default loginRouter