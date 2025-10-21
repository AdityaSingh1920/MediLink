import User from "../models/Users.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import generateOtp from "../utils/generateOtp.js";
import { sendVerificationMail } from "../helper/verificationMail.js";
import { generateTokens } from "../utils/generateTokens.js";
dotenv.config();

// signup
export const signup = async (req, res) => {
  try {
    const { name, email, password, phone, city } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      if (!existingUser.isVerified) {
        if (
          existingUser.lastOtpSentAt &&
          Date.now() - existingUser.lastOtpSentAt.getTime() < 60 * 1000
        ) {
          return res.status(429).json({
            success: false,
            message: "Please wait 1 minute before requesting another OTP.",
          });
        }

        const { code, expires, lastOtpSentAt } = await generateOtp(email);
        existingUser.verificationCodeExpires = expires;
        existingUser.verificationCode = code;
        existingUser.lastOtpSentAt = lastOtpSentAt;
        await existingUser.save();
        await sendVerificationMail(email, code);

        return res.status(200).json({
          success: true,
          message:
            "User already signed up, verification mail sent successfully",
        });
      }

      return res.status(400).json({
        success: false,
        message: "User already registered, please login",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const { code, expires, lastOtpSentAt } = await generateOtp(email);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      city,
      verificationCode: code,
      verificationCodeExpires: expires,
      lastOtpSentAt,
    });

    await sendVerificationMail(email, code);

    res
      .status(201)
      .json({ message: "Signup successful, please verify your email" });
  } catch (error) {
    console.log("LOG SIGNUP 2", error);
    res.status(500).json({ message: error.message });
  }
};

// verify
export const verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;
    const user = await User.findOne({ email });

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    if (user.isVerified)
      return res
        .status(400)
        .json({ success: false, message: "Already verified" });

    if (user.verificationCodeExpires < Date.now()) {
      const { code, expires, lastOtpSentAt } = await generateOtp(email);
      user.verificationCodeExpires = expires;
      user.verificationCode = code;
      user.lastOtpSentAt = lastOtpSentAt;
      await user.save();
      await sendVerificationMail(email, code);

      return res.status(400).json({
        message: "Expired code, new verification has been sent to your email",
      });
    }

    if (user.verificationCode !== parseInt(code)) {
      return res.status(400).json({ message: "Invalid code" });
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    user.lastOtpSentAt = undefined;
    await user.save();

    res.json({ message: "Email verified successfully" });
  } catch (error) {
    console.log("error");
    res.status(500).json({ message: error.message });
  }
};

// login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.isVerified)
      return res
        .status(400)
        .json({ message: "Please verify your email first" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const { accessToken, refreshToken } = generateTokens(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.json({
      success: true,
      message: "Login successful",
      accessToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        city: user.city,
        phone: user.phone,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Refresh
export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken)
      return res.status(401).json({ success: false, message: "No refresh token" });

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ success: false, message: "User not found" });

    const newAccessToken = jwt.sign(
      { id: user._id, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.json({ success: true, accessToken: newAccessToken });
  } catch (err) {
    res.status(401).json({ success: false, message: "Invalid refresh token" });
  }
};


// logout
export const logout = (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
  res.json({ success: true, message: "Logged out" });
};

// delete account
export const deleteAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.json({ message: "Record deleted successfully", deletedUser });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error deleting record", error: error.message });
  }
};
