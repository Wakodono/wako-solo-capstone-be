# CoinView Backend

Backend API for CoinView, a Strive School solo capstone project. Built with Node.js, Express, and MongoDB. Authenticated routes are protected by JWT middleware (`src/auth/token.js`) that verifies tokens and attaches the user document to the request; a separate admin guard (`src/auth/admin.js`) restricts user-management endpoints to accounts with an `Admin` role. Passwords are hashed via a Mongoose pre-save hook before storage.

**Frontend repository:** [wako-solo-capstone](https://github.com/Wakodono/wako-solo-capstone)

## Routes

Routes below are defined in source. Google OAuth routes exist but are non-functional: `passport.initialize()` is commented out and `passport.use()` is never called.

| Method | Path | Description | Status |
|--------|------|-------------|--------|
| POST | `/register` | Create a new user account | Defined |
| POST | `/login` | Authenticate and receive a JWT | Defined |
| GET | `/login/googleLogin` | Redirect to Google OAuth | Inactive |
| GET | `/login/googleRedirect` | Google OAuth callback | Inactive |
| GET | `/me` | Retrieve the authenticated user's profile | Defined |
| PUT | `/me` | Update the authenticated user's profile | Defined |
| DELETE | `/me` | Delete the authenticated user's account | Defined |
| GET | `/users` | List all users (admin only) | Defined |
| POST | `/users` | Create a user (admin only) | Defined |
| GET | `/users/:id` | Retrieve a user by ID (admin only) | Defined |
| PUT | `/users/:id` | Update a user by ID (admin only) | Defined |
| DELETE | `/users/:id` | Delete a user by ID (admin only) | Defined |
| POST | `/users/:id/uploadAvatar` | Upload avatar image (admin only) | Defined |

## Local Setup

Startup requirements have not been runtime-tested. The following is inferred from source inspection.

**Environment variables read at startup:**

```
MONGODB_URI=<connection string>
JWT_SECRET=<signing key>
GOOGLE_OAUTH_ID=<client id>
GOOGLE_OAUTH_SECRET=<client secret>
API_URL=<base URL for OAuth callback>
```

`MONGODB_URI` and `JWT_SECRET` are required for core functionality. The Google OAuth variables are read at startup because `src/auth/oauth.js` constructs the strategy at import time (line 6), even though the OAuth flow is incomplete. Behaviour with missing values has not been tested.

**Optional:**

```
PORT=3001
FE_LOCAL_URL=<frontend origin for CORS>
REACT_APP_FE_PROD_URL=<additional frontend origin for CORS>
FE_URL=<frontend redirect after OAuth>
```

Create a `.env` file, then:

```
npm install
npm run dev
```

`npm start` runs without nodemon or dotenv preload.

### Cloudinary

Avatar upload routes use Cloudinary via `multer-storage-cloudinary`. The code passes the imported `cloudinary` instance to the storage constructor but does not call `cloudinary.config()`. Configuration relies on SDK auto-detection of `CLOUDINARY_URL`. Without this variable, avatar uploads will fail at runtime.

## Known Constraints

- Startup and route behaviour have not been runtime-tested; functionality is inferred from source inspection only.
- No deployment configuration (Procfile, container definitions) is present.
- The `/users` mount in `src/server.js` omits the leading slash, which may affect route resolution.
- Google OAuth setup is incomplete: the strategy is constructed but never registered with `passport.use()`, and `passport.initialize()` is commented out.
