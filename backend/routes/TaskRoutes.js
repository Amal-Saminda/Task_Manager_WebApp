const express = require("express");
const {protect , adminOnly} = require("../middlewares/AuthMiddlewares");
const { getTasks,getTaskById,createTask,getUserDashboardData,getDashboardData,updateTask,deleteTask,updateTaskStatus,updateTaskCheckList } = require("../controllers/TaskControllers");

const router = express.Router();

//Task-Manager Routes

router.get("/",protect, getTasks);
router.post("/",protect,adminOnly, createTask);
router.get("/user-dashboard-data",protect, getUserDashboardData);
router.get("/dashboard-data",protect, getDashboardData);
router.get("/:id",protect, getTaskById);
router.put("/:id",protect,updateTask);
router.delete("/:id",protect,adminOnly,deleteTask);
router.put("/:id/status",protect,updateTaskStatus);
router.put("/:id/todo",protect,updateTaskCheckList);

module.exports = router;
