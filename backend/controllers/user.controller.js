import Notification from "../models/notificatio.model.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import {v2 as cloudinary} from "cloudinary"

export const getUserProfile = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username }).select("-password");
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.log("erorr in getUserProfile", error);
    return res.status(400).json({ error: error.message });
  }
};

export const getSuggestedUser = async (req, res) => {
  try {
    const userId = req.user._id;

    const followingUser = await User.findById(userId).select("following");
   
    const users = await User.aggregate([
      {
        $match: {
          _id: { $ne: userId },
        },
      },
      { $sample: { size: 10 } },
    ]);

    const filteredUser = users.filter(user=>!followingUser.following.includes(user._id))
    const suggestedUser = filteredUser.slice(0, 4);

    suggestedUser.forEach((user) => (user.password = null));

    res.status(200).json(suggestedUser);
  } catch (error) {
    console.log("erorr in getSuggestedUser", error);
    return res.status(400).json({ error: error.message });
  }
};

export const followUnfollowUser = async (req, res) => {
  try {
    const currentId = req.user._id;
    const { id: modifyUserId } = req.params;

    const modifyUser = await User.findById(modifyUserId);
    const currentUser = await User.findById(currentId);

    if (!modifyUser || !currentUser) {
      return res.status(400).json({ error: "Invalid User" });
    }
    if (modifyUserId.toString() == currentId.toString()) {
      return res
        .status(400)
        .json({ error: "You cannot follow/unfollow yourself" });
    }
    const isFollowing = currentUser.following.includes(modifyUser._id);

    if (!isFollowing) {
      await User.findByIdAndUpdate(modifyUser._id,{$push:{followers:req.user._id }});
      await User.findByIdAndUpdate(currentUser._id,{$push:{following: modifyUser._id }});
      res.status(200).json(currentUser.following);
      const newNotification = new Notification({
        type: "follow",
        from: currentId,
        to: modifyUserId,
      });
      await newNotification.save();
    } else {

      await User.findByIdAndUpdate(modifyUser._id,{$pull: { followers: req.user._id }});
      await User.findByIdAndUpdate(currentUser._id,{$pull: { following: modifyUser._id }});
      
      res.status(200).json(currentUser.following);
    }
  } catch (error) {
    console.log("erorr in followUnfollowUser", error);
    return res.status(400).json({ error: error.message });
  }
};

export const updateUser = async (req, res) => {
  const { fullName, username, currentPassword, newPassword, bio, link } =
    req.body;
  let { profileImg, coverImg } = req.body;
  try {
    let user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    if(!currentPassword && newPassword || !newPassword && currentPassword){
        return res.status(400).json({error:"Please provide both currentPassword and newPassword"})
    }

    if (currentPassword) {
      const isCheckPassword = await bcrypt.compare(
        currentPassword,
        user.password
      );

      if (!isCheckPassword) {
        return res.status(400).json({ error: "current Password is wrong" });
      }

      if (newPassword.length < 6) {
        return res
          .status(400)
          .json({ error: "password should be atleast 6 charactors" });
      }

      const salt = await bcrypt.genSalt(10);

      var hashPassword = await bcrypt.hash(newPassword, salt);
    }

    if(profileImg){
        if(user.profileImg){
            await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0])
        }
        const uploadedResponse =   await cloudinary.uploader.upload(profileImg)
        profileImg = uploadedResponse.secure_url
    }
    if(coverImg){
        if(user.coverImg){
            await cloudinary.uploader.destroy(user.coverImg.split("/").pop().split(".")[0])
        }
        const uploadedResponse =   await cloudinary.uploader.upload(coverImg)
        coverImg = uploadedResponse.secure_url
    }

    user.fullName =fullName || user.fullName,
      user.username =  username || user.username,
      user.bio = bio || user.bio,
    user.link =link || user.link,
    user.password = hashPassword || user.password,
    user.profileImg = profileImg || user.profileImg,
    user.coverImg = coverImg || user.coverImg,

    user = await user.save();
      user.password = null
    res.status(200).json(user);
  } catch (error) {
    console.log("erorr in updateUser", error);
    return res.status(400).json({ error: error.message });
  }
};
