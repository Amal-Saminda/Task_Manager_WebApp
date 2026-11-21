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
        const inProgressTasks = await Task.countDocuments({assignedTo: user._id, status: "In Progress"});
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

//desc create a new team member (Admin only)
//route post /api/user/
//access Private (Admin)

const createUser = async (req,res) => {
  try{
    const name = String(req.body.name || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = req.body.password;

    if(!name || !email || !password){
      return res.status(400).json({message: "Name, email and password are required"});
    }

    if(password.length < 8){
      return res.status(400).json({message: "Password must be at least 8 characters"});
    }

    const userExists = await User.findOne({email});
    if(userExists){
      return res.status(400).json({message: "User already exists"});
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //admin can only add normal members here
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      profileImageUrl: req.body.profileImageUrl || null,
      role: "member",
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImageUrl: user.profileImageUrl,
      pendingTasks: 0,
      inProgressTasks: 0,
      completedTasks: 0,
    });

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



module.exports = {getUsers , getUserById , createUser};
