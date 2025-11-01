import express from "express"
import cors from 'cors'
import connectDB from "./config/db.js"
import userRouter from "./routes/userRoutes.js"

const app = express()
app.use(cors())

//AvEtDglSuAEiXlE7
//mongodb+srv://palariya8513_db_user:AvEtDglSuAEiXlE7@cluster0.eark5qd.mongodb.net/?appName=Cluster0
connectDB()
app.use(express.json())

app.use('/api/v1/auth', userRouter)

const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log('listening on ' + port)
})




 