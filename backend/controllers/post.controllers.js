import Notification from "../models/notificatio.model.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import { v2 as cloudinary } from "cloudinary";

export const createPost = async (req, res) => {
  try {
    let { text, img } = req.body;

    const userId = req.user._id.toString();

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!text && !img) {
      return res.status(400).json({ error: "Post must have text or image" });
    }

    if (img) {
      const uploadedResponse = await cloudinary.uploader.upload(img);
      var image = uploadedResponse.secure_url;
    }
    const newPost = new Post({
      user: userId,
      text,
      img: image,
    });
    await newPost.save();

    res.status(201).json(newPost);
  } catch (error) {
    console.log("error in createPost", error);
    res.status(400).json({ error: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ error: "post not found" });
    }
    const currentUser = await User.findById(req.user._id);

    if (!currentUser) {
      return res.status(400).json({ error: "User not found" });
    }
    if (currentUser._id.toString() !== post.user.toString()) {
      return res.status(400).json({ error: "you cannot delete other's post" });
    }

    await Post.findByIdAndDelete(post._id);

    res.status(200).json({ message: "post deleted successfully" });
  } catch (error) {
    console.log("error in deletePost", error);
    res.status(400).json({ error: error.message });
  }
};

export const likeUnlikePost = async (req, res) => {
  try {
    const { id:postId } = req.params;

    const currentUserId = req.user._id;

    const user = await User.findById(currentUserId).select("-password");
    let post = await Post.findById(postId);
    if (!user) {
      return res.status(400).json({ error: "User not found " });
    }
    if (!post) {
      return res.status(400).json({ error: "Post not found" });
    }

    const isliked = post.likes.includes(user._id);
  let updatedLikes;
    if (!isliked) {
      await Post.findByIdAndUpdate(postId,{$push:{likes:user._id}});
      await post.save();
      await User.updateOne(
        { _id: user._id },
        { $push: { likedPosts: postId } }
      );
       const notification = new Notification({
          type: "like",
          from: currentUserId,
          to: post.user,
        });
        await notification.save();
    
      updatedLikes = post.likes
      res.status(200).json(updatedLikes);
    }
    // } else {
    //   // await Post.findByIdAndUpdate(postId, { $pull:{likes:user._id } });
    //   // await post.save()
  
    //   // res.status(200).json(post.likes);
    // }
    if(isliked){
      await Post.findByIdAndUpdate(postId, { $pull:{likes:user._id } });
      await post.save()
  
      res.status(200).json(post.likes);
    }
  } catch (error) {
    console.log("error in likeUnlikePost", error);
    res.status(400).json({ error: error.message });
  }
};

export const commentPost = async (req, res) => {
  const { id: postId } = req.params;
  const currentUserId = req.user._id;
  const { text } = req.body;
  try {
    let post = await Post.findById(postId).populate({
      path: "comments.user",
      select: "-password",
    });
    const user = await User.findById(currentUserId);
    if (!text) {
      return res.status(400).json({ error: "text feild is required" });
    }
    if (!post) {
      return res.status(400).json({ error: "Post not found" });
    }
    if (!user) {
      return res.status(400).json({ error: "user not found" });
    }
    const comment = {
      user: {
        _id: user._id,
        username: user.username,
        fullName: user.fullName,
      },
      text,
    };

    post.comments.push(comment);

    await post.save();
    // const lastPost = post.comments.pop()
    res.status(200).json(post.comments);
  } catch (error) {
    console.log("error in commentPost", error);
    res.status(400).json({ error: error.message });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({ path: "comments.user", select: "-password" }).sort({createdAt:-1});

    if (posts.length == 0) {
      return res.status(200).json([]);
    }
    res.status(200).json(posts);
  } catch (error) {
    console.log("error in getAllPost", error);
    res.status(400).json({ error: error.message });
  }
};

export const getLikePost = async (req, res) => {
  try {
    const {id} = req.params
    const user = await User.findById(id);
    const likedPost = await Post.find({ _id: { $in: user.likedPosts } })
      .populate({ path: "user", select: "-password" })
      .populate({ path: "comments.user", select: "-password" });
    if (!user) {
      return res.status(400).json({ error: "user not found" });
    }
    res.status(200).json(likedPost);
  } catch (error) {
    console.log("error in getLikePost", error);
    res.status(400).json({ error: error.message });
  }
};

export const followingPost = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }
    const following = user.following;

    const feedPosts = await Post.find({ user: { $in: following } })
      .sort({ createdAt: -1 })
      .populate({ path: "user", select: "-password" })
      .populate({ path: "comments.user", select: "-password" });

    res.status(200).json(feedPosts);
  } catch (error) {
    console.log("error in getFollowingPost", error);
    res.status(400).json({ error: error.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const posts = await Post.find({ user: user._id })
      .sort({ createAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({ path: "comments.user", select: "-password" });

    res.status(200).json(posts);
  } catch (error) {
    console.log("error in getUserPost", error);
    res.status(400).json({ error: error.message });
  }
};
