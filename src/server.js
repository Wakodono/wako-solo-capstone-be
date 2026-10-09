import listEndpoints from 'express-list-endpoints'
import mongoose from 'mongoose'
import app from './app.js'

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.table(listEndpoints(app))
    console.log("Server is running on port:", PORT)
})

// The crypto and news proxies work without a database; only the user routes need MongoDB.
if (process.env.MONGODB_URI) {
    mongoose.connect(process.env.MONGODB_URI)
    mongoose.connection.on("connected", () => console.log("Connected to MongoDB"))
} else {
    console.log("MONGODB_URI not set: user routes won't work")
}
