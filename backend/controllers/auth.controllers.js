import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  try {
    const { fullName, username, email, password } = req.body;

    if (!fullName || !username || !email || !password) {
      return res.status(401).json({ error: "Please fill all fileds" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    if (password.length < 6) {
      return res
        .status(401)
        .json({ error: "Password atleast 6 charactorsecfec" });
    }
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: "Email already exists" });
    }
    const salt = await bcrypt.genSalt(10);

    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      username,
      password: hashPassword,
      email,
    });

    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        username: newUser.username,
        email: newUser.email,
        profileImg: newUser.profileImg,
        followers: newUser.followers,
        following: newUser.following,
        bio: newUser.bio,
        link: newUser.link,
        coverImg: newUser.converImg,
      });
    } else {
      return res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    console.log("error in signup", error);
    return res.status(400).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Please fill all fields" });
    }
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ error: "Username not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ error: "Password incorrect" });
    }

    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      profileImg: user.profileImg,
      followers: user.followers,
      following: user.following,
      bio: user.bio,
      link: user.link,
      coverImg: user.converImg,
    });
  } catch (error) {
    console.log("error in login", error);
    return res.status(400).json({ error: error.message });
  }
};
export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 1 });

    res.status(200).json({ message: "Logout Successfully" });
  } catch (error) {
    console.log("error in logout", error);
    return res.status(400).json({ error: error.message });
  }
};

export const getMe = async (req, res) => {
  const userId = req.user._id;
  
  try {
    const user = await User.findById(userId).select("-password");
    res.status(200).json(user)
  } catch (error) {
    console.log("error in getMe", error);
    res.status(400).json({ error: error.message });
  }
};
