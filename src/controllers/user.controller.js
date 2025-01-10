import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { apiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";
import { Op } from 'sequelize';
import sendEmail from '../utils/sendEmail.js'; 
import bcrypt from 'bcrypt';

const generateAccessAndRefreshToken = async (userId) => {
    try {
      
      const user = await User.findOne({ where: { id: userId } });
  
      if (!user) {
        apiError(res, 404, false, "User not found");
        return;
      }
  
      
      const accessToken = user.generateAccessToken(); 
      const refreshToken = user.generateRefreshToken(); 
  
      
      user.refreshToken = refreshToken;
  
      
      await user.save({ validateBeforeSave: false });
  
      return { accessToken, refreshToken };
    } catch (error) {
      apiError(res, 500, false, "Something went wrong while generating refresh and access token");
      return;
    }
  };
 
const registerUser = asyncHandler(async (req, res) => {
    const { fullName, email, username, password } = req.body;
    const missingFields = [];
  
    if (!fullName) missingFields.push("full name");
    if (!email) missingFields.push("email");
    else if (!(email.includes("@gmail.com") || email.includes("@outlook.com") || email.includes("@yahoo.com"))) missingFields.push("use valid extension");
    if (!username) missingFields.push("username");
    if (!password) missingFields.push("password");
  
    if (missingFields.length > 0) {
      const error = `The following fields are required: ${missingFields.join(", ")}`;
      apiError(res, 400, false, error);
      return;
    }
  
    try {
      const existedUser = await User.findOne({
        where: {
          [Op.or]: [{ username }, { email }]  
        }
      });
  
      if (existedUser) {
        apiError(res, 409, false, "User with email or username already exists");
        return;
      }
  
      const user = await User.create({
        fullName,
        email,
        password,
        username: username.toLowerCase(),
        resetPasswordToken:null,
        resetPasswordExpires:null
      });
  
      
      const createdUser = user.toJSON(); 
      delete createdUser.password;  
      return res.status(201).json(new apiResponse(200, createdUser, "User registered Successfully"));
  
    } catch (error) {
      console.error("Error in registration:", error);
      apiError(res, 500, false, "Something went wrong while registering the user");
    }
  });


  

const loginUser = asyncHandler(async (req, res) => {
    
    const { email, username, password } = req.body;
  
    if (!username && !email) {
      apiError(res, 400, false, "username or email is required");
      return;
    }
  
    const user = await User.findOne({
      where: {
        [Op.or]: [
          { username: username || null },
          { email: email || null },
        ],
      },
    });
  
    if (!user) {
      apiError(res, 404, false, "user doesn't exist");
      return;
    }
  
    const isPasswordValid = await user.isPasswordCorrect(password);
  
    if (!isPasswordValid) {
      apiError(res, 401, false, "password incorrect or invalid user credentials");
      return;
    }
  
   
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user.id);
  
    const loggedInUser = await User.findOne({
      where: { id: user.id },
      attributes: { exclude: ["password", "refreshToken"] },
    });
  
    const options = {
      httpOnly: true,
      secure: true, 
    };
  
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new apiResponse(
          200,
          {
            user: loggedInUser,
            accessToken,
            refreshToken,
          },
          "user logged in successfully"
        )
      );
  });
  
const updateAccountDetails = asyncHandler(async (req, res) => {
    const { fullName, email } = req.body;
  
   
    if (!fullName || !email) {
      apiError(res, 400, false, "all fields are required");
      return;
    }
  
   
    const [affectedRows] = await User.update(
      {
        fullName: fullName, 
        email: email, 
      },
      {
        where: { id: req.user?.id }, 
      }
    );
  
    
    if (affectedRows === 0) {
      apiError(res, 404, false, "user not found");
      return;
    }
  
    
    const updatedUser = await User.findOne({
      where: { id: req.user?.id },
      attributes: { exclude: ["password", "refreshToken","resetPasswordToken","resetPasswordExpires"] }, 
    });
  
    return res
      .status(200)
      .json(
        new apiResponse(
          200,
          updatedUser,
          "account details updated successfully"
        )
      );
  });
  

  import crypto from 'crypto';



const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required" });
  }

  const user = await User.findOne({ where: { email:email } });

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  const resetToken = crypto.randomBytes(32).toString('hex');

  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  const tokenExpiry = Date.now() + 15 * 60 * 1000; // Token valid for 15 minutes

  await user.update({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: tokenExpiry,
  });


  const resetURL = `${req.protocol}://${req.get('host')}/api/users/reset-password/${resetToken}`;

 
  const message = `
    <h2>Password Reset Request</h2>
    <p>You requested to reset your password. Click the link below to reset your password:</p>
    <a href="${resetURL}" target="_blank">${resetURL}</a>
    <p>This link will expire in 15 minutes.</p>
  `;

  try {
    await sendEmail({
      to: user.email,
      subject: "Password Reset Request",
      html: message,
    });

    res.status(200).json({ success: true, message: "Reset email sent successfully" });
  } catch (error) {
    // Clean up if email fails
    await user.update({
      resetPasswordToken: null,
      resetPasswordExpires: null,
    });

    res.status(500).json({ success: false, message: "Failed to send email" });
  }
 });

const verifyResetToken = asyncHandler(async (req, res) => {
  const { token } = req.params;

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    where: {
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { [Op.gt]: Date.now() }, 
    },
  });

  if (!user) {
    return apiError(res, 400, false, "Invalid or expired token");
  }

  return res
    .status(200)
    .json(
      new apiResponse(
        200,
        null,
        "Token verified successfully. You can now reset your password."
      )
    );
 });
const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  if (!newPassword) {
    return res.status(400).json({ success: false, message: "New password is required" });
  }

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    where: {
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { [Op.gt]: Date.now() }, // Token is still valid
    },
  });

  if (!user) {
    return res.status(400).json({ success: false, message: "Invalid or expired token" });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await user.update({
    password: hashedPassword,
    resetPasswordToken: null, // Clear reset token
    resetPasswordExpires: null,
  });

  res.status(200).json({ success: true, message: "Password reset successfully" });
 });



export {registerUser,loginUser,updateAccountDetails,forgotPassword,resetPassword,verifyResetToken};
