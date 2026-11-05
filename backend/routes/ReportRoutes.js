const express = require("express");
const { protect, adminOnly } = require("../middlewares/AuthMiddlewares");
const {exportTasksReport , exportUserReport} = require("../controllers/ReportControllers")

const router = express.Router();

router.get("/export/tasks" , protect , adminOnly, exportTasksReport) //export all tasks excell/pdf
router.get("/export/users", protect , adminOnly , exportUserReport) //export user-track report

module.exports = router;