import passport from "passport"
import GoogleStrategy from "passport-google-oauth20";
import UserModel from "../db/models/userModel.js";
import { AuthenticateWithToken } from "./tools.js";

const googleCloudStrategy = new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_OAUTH_ID,
      clientSecret: process.env.GOOGLE_OAUTH_SECRET,
      callbackURL: `${process.env.API_URL}/login/googleRedirect`,
    },
    async (accessToken, refreshToken, profile, passportNext) => {
      try {
        const user = await UserModel.findOne({ googleId: profile.id });
        if (user) {
          // Returns access token:
          // TODO: Implement with refreshToken also
          const token = await AuthenticateWithToken(user);
          passportNext(null, { token });
        } else {
          const newUser = new UserModel({
            name: profile.name.givenName,
            surname: profile.name.familyName,
            email: profile.emails[0].value, 
            googleId: profile.id,
          });
  
          const savedNewUser = await newUser.save();
          const token = await AuthenticateWithToken(savedNewUser);
  
          passportNext(null, { token });
        }
      } catch (error) {
        passportNext(error);
      }
    }
  );

  export default googleCloudStrategy