const Task = require("../models/Task");
const User = require("../models/User");
const bcrypt = require("bcryptjs");


//desc get all users(Admin only)
//route get /api/users/
//access Private (Admin)

const getUsers = async (req,res) => {
  try{
const users = await User.find({role: "member"}).select("-password");

      //add task counts to each user 
      const userWithTaskCounts = await Promise.all(users.map(async (user) => {
        const pendingTasks = await Task.countDocuments({assignedTo: user._id, status: "Pending"});
        const inProgressTasks = await Task.countDocuments({assignedTo: user._id, status: "In progress"});
        const completedTasks = await Task.countDocuments({assignedTo: user._id, status: "Completed"});

        return {
          ...user._doc, //includes all exiting user data
          pendingTasks,
          inProgressTasks,
          completedTasks
        }
      }));

      res.json(userWithTaskCounts);

  }catch(error) {
    res.status(500).json({message: "Server Error" , error: error.message});
  }
}

//desc get all user by ID
//route get /api/users/:id
//access private

const getUserById = async(req,res) =>{
    try{
        const user = await User.findById(req.params.id).select("-password");
        if(!user) return res.status(404).json({message: "User not found"})
          res.json(user);
  }catch(error) {
    res.status(500).json({message: "Server Error" , error: error.message});
  }
};



module.exports = {getUsers , getUserById};
