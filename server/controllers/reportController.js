import Report from "../models/Report.js";

export const createReport = async (req, res) => {
  const {
    itemName,
    description,
    location,
    reportType,
    contactName,
    contactEmail,
    contactNumber,
  } = req.body;
  const imagePath = req.file ? `uploads/${req.file.filename}` : null;

  const newReport = await Report.create({
    itemName,
    description,
    location,
    reportType,
    image: imagePath,
    contactEmail,
    contactName,
    contactNumber,
  });

  res.json({
    success: true,
    message: "Report register",
    data: newReport,
  });
};

export const getLostReport = async (req, res) => {
  try {
    const reports = await Report.find({ reportType: "lost" });
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFoundReport = async (req, res) => {
  try {
    const reports = await Report.find({ reportType: "found" });
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: "Report not found" });
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateReport = async () => {};

export const deleteReport = async () => {};
