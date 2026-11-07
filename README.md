# CoinView Backend

Backend API for CoinView, a Strive School solo capstone project. Handles user authentication and account management for the companion frontend application.

**Frontend repository:** [wako-solo-capstone](https://github.com/Wakodono/wako-solo-capstone)

## Stack

- **Node.js** with **Express**
- **MongoDB** via Mongoose
- **JWT** for session tokens
- **bcrypt** for password hashing
- **express-validator** for input validation
- **Cloudinary** for avatar image storage
- **Passport** with Google OAuth strategy (prepared; not currently initialised)

## Routes

| Method | Path | Description |
|--------|------|-------------|
| POST | `/register` | Create a new user account |
| POST | `/login` | Authenticate and receive a JWT |
| GET | `/login/googleLogin` | Redirect to Google OAuth |
| GET | `/login/googleRedirect` | Google OAuth callback |
| GET | `/me` | Retrieve the authenticated user's profile |
| PUT | `/me` | Update the authenticated user's profile |
| DELETE | `/me` | Delete the authenticated user's account |
| GET | `/users` | List all users (admin only) |
| POST | `/users` | Create a user (admin only) |
| GET | `/users/:id` | Retrieve a user by ID (admin only) |
| PUT | `/users/:id` | Update a user by ID (admin only) |
| DELETE | `/users/:id` | Delete a user by ID (admin only) |
| POST | `/users/:id/uploadAvatar` | Upload avatar image (admin only) |

## Local Setup

1. Clone this repository.
2. Run `npm install`.
3. Create a `.env` file with the following variables:

   ```
   PORT
   MONGODB_URI
   JWT_SECRET
   FE_LOCAL_URL
   REACT_APP_FE_PROD_URL
   GOOGLE_OAUTH_ID
   GOOGLE_OAUTH_SECRET
   API_URL
   FE_URL
   CLOUDINARY_URL
   ```

4. Start the server:
   - Development: `npm run dev`
   - Production: `npm start`

## Notes

- The `/users` routes require JWT authentication and an `Admin` role.
- Google OAuth routes are defined but `passport.initialize()` is commented out in `server.js`.
- Password hashing occurs automatically via a Mongoose pre-save hook.
