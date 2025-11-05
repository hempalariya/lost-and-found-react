import mongoose from 'mongoose'

const reportSchema = new mongoose.Schema({
    itemName: {
        type: String,
        required:true
    },
    description: {
        type: String,
        required: true
    }, 
    location: {
        type: String,
        required: true
    },
    reportType: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    }
}, {timestamps: true})

const Report = mongoose.model("Report", reportSchema)

export default Report