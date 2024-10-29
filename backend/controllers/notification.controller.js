import Notification from "../models/notificatio.model.js";
import User from "../models/user.model.js";

export const getNotification = async (req, res) => {
  try {
    const userId = req.user._id;

    const currentUser = await User.findById(userId);
  
    if(!currentUser){
        return res.status(400).json({error:"user not found"})
    }
 
    let notification = await Notification.find({to:{$in:currentUser._id}}).populate({path:"from",select:"username profileImg"}).sort({createdAt:1})

    if(!notification){
        return res.status(400).json({error:"no notification"})
    }
   let newNotification = notification.filter(notifi=>notifi.from._id.toString() !==notifi.to.toString())
    res.status(200).json(newNotification)
  } catch (error) {
    console.log("error in getNotification", error);
    res.status(400).json({error:error.message})
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const {id} = req.params

    const user = await User.findById(req.user._id)

    if(!user){
        return res.status(400).json({error:"User not found"})
    }

    await Notification.findByIdAndDelete(id)

    let notification = await Notification.find({to:{$in:user._id}}).populate({path:"from",select:"username profilePic"})
    
    res.status(200).json(notification)
  } catch (error) {
    console.log("error in deleteNotification", error);
    res.status(400).json({error:error.message})
  }
};

export const readNotification = async(req,res)=>{
    try {
        const {id} = req.params

        const user = await User.findById(req.user._id)
        if(!user){
            return res.status(400).json({error:"user not found"})
        }

       await Notification.findByIdAndUpdate(id,{$set:{read:true}})
        const notificationRead = await Notification.findById(id)
        res.status(200).json(notificationRead)
    } catch (error) {
        console.log("error in readNotification", error);
    res.status(400).json({error:error.message})
    }
}

