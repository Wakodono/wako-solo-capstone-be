# CoinView Backend

Backend API for CoinView, a Strive School solo capstone project. Built with Node.js, Express, and MongoDB. Authenticated routes are protected by JWT middleware (`src/auth/token.js`) that verifies tokens and attaches the user document to the request; a separate admin guard (`src/auth/admin.js`) restricts user-management endpoints to accounts with an `Admin` role. Passwords are hashed via a Mongoose pre-save hook before storage.

**Frontend repository:** [wako-solo-capstone](https://github.com/Wakodono/wako-solo-capstone)

## Routes

Routes below are defined in source. Google OAuth routes are present but non-functional: `passport.initialize()` is commented out in `src/server.js`.

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

**Required environment variables** (server will not start or function without these):

```
MONGODB_URI=<connection string>
JWT_SECRET=<signing key>
```

**Optional:**

```
PORT=3001
FE_LOCAL_URL=<frontend origin for CORS>
REACT_APP_FE_PROD_URL=<additional frontend origin for CORS>
```

Create a `.env` file with at least the required variables, then:

```
npm install
npm run dev
```

`npm start` runs without nodemon or dotenv preload; suitable for environments that inject variables separately.

### Optional integrations

**Cloudinary** (avatar uploads): Set `CLOUDINARY_URL` or individual `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` variables. Without configuration, avatar upload routes will fail at runtime.

**Google OAuth**: Requires `GOOGLE_OAUTH_ID`, `GOOGLE_OAUTH_SECRET`, `API_URL`, and `FE_URL`. Currently non-functional because `passport.initialize()` is commented out in source.

## Known Constraints

- Routes have not been runtime-tested as part of this documentation; functionality is inferred from source inspection only.
- No deployment configuration (e.g. Procfile, container definitions) is present in the repository.
- The `/users` mount in `src/server.js` omits the leading slash, which may affect route resolution.
