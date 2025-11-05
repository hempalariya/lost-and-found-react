import express from "express"
import cors from 'cors'
import connectDB from "./config/db.js"
import userRouter from "./routes/userRoutes.js"
import reportRouter from "./routes/reportRoutes.js"

const app = express()
app.use(cors())
app.use("/uploads", express.static("uploads"));


connectDB()
app.use(express.json())

app.use('/api/v1/auth', userRouter)
app.use('/api/v1/report', reportRouter)

const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log('listening on ' + port)
})




 