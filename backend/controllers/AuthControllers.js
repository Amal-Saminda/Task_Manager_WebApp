const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//genarate webToken

const generateToken = (userId) => {
  return jwt.sign({id: userId} , process.env.JWT_SECRET , {expiresIn: "7d"});
}

const registerUser = async(req,res) => {
  try{
    // Accept both naming styles so the frontend field names can't silently drop data
    const fullName = req.body.fullName || req.body.name;
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = req.body.password;
    const profileImageUrl = req.body.profileImageUrl || null;
    const adminInviteToken = String(
      req.body.adminInviteToken || req.body.inviteToken || ""
    ).trim();

    if(!fullName || !email || !password){
      return res.status(400).json({message: "Name, email and password are required"});
    }

    //check if user already exists
    const userExists = await User.findOne({email});
    if(userExists){
      return res.status(400).json({message: "User already exists"});
    }

    // Role rule:
    //   no token            -> member (normal user)
    //   correct token       -> admin
    //   wrong token         -> rejected (so nobody becomes a member by typo)
    let role = "member";
    if(adminInviteToken){
      if(
        !process.env.ADMIN_INVITE_TOKEN ||
        adminInviteToken !== process.env.ADMIN_INVITE_TOKEN
      ){
        return res.status(400).json({message: "Invalid admin invite token"});
      }
      role = "admin";
    }

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);

    //create new user
    const user = await User.create({
      name: fullName.trim(),
      email,
      password: hashedPassword,
      profileImageUrl,
      role
    });

    //return user data with JWT
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImageUrl: user.profileImageUrl,
      token: generateToken(user._id),
    });
  }catch(error){

    res.status(500).json({message: "Server Error", error: error.message});
  }
};

const loginUser = async(req,res) => {
    try{

      const email = String(req.body.email || "").trim().toLowerCase();
      const {password} = req.body;

      const user = await User.findOne({email});
      if(!user){
        return res.status(401).json({message: "Invalid email or password"});
      }

      const isMatch = await bcrypt.compare(password , user.password);
      if(!isMatch) {
        return res.status(401).json({message: "Invalid email or password"})
      } 

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImageUrl: user.profileImageUrl,
        token: generateToken(user._id),
      })

  }catch(error){
    res.status(500).json({message: "Server Error", error: error.message});
  }

};

const getUserProfile = async(req,res) => {

    try{

      const user = await User.findById(req.user.id).select("-password");
      if(!user){
        return res.status(404).json({message: "User not found"});
      }
      
      return res.status(200).json(user);

  }catch(error){
    res.status(500).json({message: "Server Error", error: error.message});
  }
};

const updateUserProfile = async(req,res) => {
    try{
      const user = await User.findById(req.user.id);
      if(!user){
        return res.status(404).json({message: "User not found"});
      }

      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;

      if(req.body.password) {
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(req.body.password, salt);
      }

      const updateUser = await user.save();

      res.json({
        _id: updateUser._id,
        name: updateUser.name,
        email: updateUser.email,
        role: updateUser.role,
        profileImageUrl: updateUser.profileImageUrl,
        token: generateToken(updateUser._id),
      });

  }catch(error){
    res.status(500).json({message: "Server Error", error: error.message});
  }
};

module.exports = {registerUser , loginUser , getUserProfile , updateUserProfile};