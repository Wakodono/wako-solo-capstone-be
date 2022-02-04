import mongoose from "mongoose";
import bcrypt from "bcrypt";


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, 
  },
  avatar: {
    type: String,
  },
  password: {
    type: String, 
  },
  googleId: {
    type: String
  },
  role: {
    type: String, default: "User", enum: ["User", "Admin"]
  }
},
{timestamps: true}
);

userSchema.pre("save", async function (next) {
    const newUser = this;
    const userPassword = newUser.password;
  
    // If on document level, the password field is modified of user
     
    if(newUser.isModified("password")) {
      // Generate hash from newly created user.
      // Before hashing, salt (random string) is prepended to the password
      // Second argument of the hash function is the rounds (how many times/cycles the algorithm is run for this specific salt+password string?)
      // Hashing time grows exponentially as the number of rounds grows.
      const hash = await bcrypt.hash(userPassword, 10);
  
      // Finally, password field of user document is updated with the hash value before the actual .save() method is used to save the document within Database.
      newUser.password = hash;
    }
  })

  userSchema.methods.toJSON = function() {
    const userDocument = this;
    const user = userDocument.toObject();
    delete user.password;
    delete user.__v;
  
    return user;
  }

  userSchema.statics.checkCredentials = async function checkCredentials(email, plainTextPassword) {
    const user = await this.findOne({ email });
  
    if(user) {
      const isPwdMatch = await bcrypt.compare(plainTextPassword, user.password);
      if(isPwdMatch) {
        return user;
      } else {
        // When we return null, within the request response we should not specify if the password or email is specifically wrong. Better to respond that in overall credentials provided are wrong.
        return null;
      }
    } else {
      // When we return null, within the request response we should not specify if the password or email is specifically wrong. Better to respond that in overall credentials provided are wrong.
      return null;
    }
  }

  const UserModel = mongoose.model("user", userSchema)
  export default UserModel