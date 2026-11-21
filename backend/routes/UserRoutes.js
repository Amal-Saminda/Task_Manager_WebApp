const express = require("express");
const { protect, adminOnly } = require("../middlewares/AuthMiddlewares");
const {getUsers , getUserById , createUser } = require("../controllers/UserControllers")


const router = express.Router();

//User management route

router.get("/", protect, adminOnly , getUsers); //get all users( Admin only)
router.post("/", protect, adminOnly , createUser); //add team member (Admin only)
router.get("/:id",protect , getUserById); //get speci user

module.exports = router;