import express from "express";
import multer from "multer"
import path from "path"

import {
  createReport,
  getFoundReport,
  getLostReport,
  getReport,
  updateReport,
  deleteReport,
  getMyReports
} from "../controllers/reportController.js";
import protect from "../middleware/auth.js";


const storage = multer.diskStorage({
    destination: function (req, res, cb){
        cb(null, 'uploads/')
    },
    filename: function(req, file, cb){
        cb(null, Date.now() + '-' + path.extname(file.originalname))
    }

})

const upload = multer({storage: storage})



const reportRouter = express.Router();

reportRouter.post("/", protect, upload.single("image"), createReport);
reportRouter.get("/lost-report", getLostReport);
reportRouter.get("/found-report", getFoundReport);
reportRouter.delete("/delete-report", deleteReport);

reportRouter.get("/my-reports", protect, getMyReports)
reportRouter.get("/:id", getReport)
export default reportRouter;
