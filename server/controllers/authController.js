const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const registerUser = async (req, res) => {
  try {
    console.log(req.body);
    const {
      name,
      email,
      password,
      college,
      department,
    } = req.body;

    // Check required fields
    if (!name || !email || !password || !college || !department) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    // Validate email
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email address",
      });
    }

    // Check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      college,
      department,
    });

    res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: {
        id: user._id,
        name: user.name,
        email: user.email,
        college: user.college,
        department: user.department
    }
});

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


const loginUser = async (req,res)=>{
  console.log("➡️ loginUser called");
  try{

    const {email,password,} = req.body;

    if (!email || !password) {
      return res.status(400).json({
          success: false,
          message: "Email and password are required",
      });
    }

    const user = await User.findOne({
      email
    }).select("+password");

    console.log(user);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    //comapares the entered pass with the stored hash password
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if(!isMatch){
      return res.status(401).json({
        success:false,
        message: "Invalid email or password",
      })
    }

    //PASSWORD IS CORRECT
    // generate JWT after successful authentication
    
    console.log("JWT Secret:", process.env.JWT_SECRET);
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    

    const { password: _, ...userWithoutPassword } = user.toObject();

    return res.status(200).json({
        success: true,
        message: "Login successful",
        token,
        user: userWithoutPassword,
    });




    return res.status(200).json({
        success: true,
        message: "Login successful",
        token,
        user: userObject,
    });

  }catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
        
};




const getProfile = async (req, res) => {
    try {

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            user
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};


const updateProfile = async (req, res) => {
    try {

        const {
            bio,
            skillsOffered,
            skillsWanted,
            availability,
            profileImage,
            experience
        } = req.body;

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (bio !== undefined) user.bio = bio;
        user.profileImage = profileImage || user.profileImage;
        user.skillsOffered = skillsOffered || user.skillsOffered;
        user.skillsWanted = skillsWanted || user.skillsWanted;
        user.availability = availability || user.availability;
        if (experience !== undefined) user.experience = experience;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
};