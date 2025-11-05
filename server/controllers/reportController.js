import Report from "../models/report.js"


export const createReport = async (req, res) => {
    const {itemName, description, location, reportType} = req.body
    const imagePath = req.file ? `uploads/${req.file.filename}` : null

    const newReport = await Report.create({
        itemName,
        description,
        location,
        reportType,
        image: imagePath
    })

    res.json({
        success: true,
        message: 'Report register',
        data: newReport
    })
}

export const getLostReport = async () => {

}

export const getFoundReport = async () => {

}

export const updateReport = async () => {

}

export const deleteReport = async () => {

}