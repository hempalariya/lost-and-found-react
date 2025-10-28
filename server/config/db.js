import dotenv from 'dotenv'
dotenv.config()
import mongoose from "mongoose";


const connectDB = async () => {
    try {
        mongoose.connect(process.env.MONGO_URI)
        console.log('mongodb connected')
    } catch (error) {
        console.error(error.message)
        process.exit(1)
    }

}


export default connectDB