import { Link } from "react-router-dom";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { MdDeleteOutline } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { useQuery,useMutation } from "@tanstack/react-query";
import { queryClient } from "../../main";
import toast from "react-hot-toast";
import { useEffect } from "react";

const NotificationPage = () => {
	
	const {data:notifications,isLoading,refetch,}=useQuery({
		queryKey:["notifications"],
		queryFn:async()=>{
			try {
				const res = await fetch("/api/notification/getNotification",)
				const data = await res.json()
				if(!res.ok) throw new Error(data.error || "Something went wrong")
					console.log("notification",data)
				return data
			} catch (error) {
				throw error
			}
		},
		
		
	})
	
const {mutate:deleteNotifications}=useMutation({
	mutationFn:async(id)=>{
		try {
			const res = await fetch(`/api/notification/${id}`,{
				method:"POST",
				headers:{
					"Content-type":"application/json"
				}
			})
			const data = await res.json()
			
			if(!res.ok){
				throw new Error(data.error)
			}
			queryClient.refetchQueries({queryKey:["notifications"]})
				return data
		} catch (error) {
			console.log("error in deleteNotification",error)
		}
	},
	onSuccess:(updated)=>{
		
		queryClient.setQueryData(["notification"],(oldData)=>{
			toast.success("notifications deleted")
			return {...oldData,...updated}
		})
	// await queryClient.refetchQueries({queryKey:["notifications"]})

		
	}
})
useEffect(()=>{
  refetch()
},[deleteNotifications])
	// const deleteNotifications = () => {
	// 	alert("All notifications deleted");
	// };
const handleDelete = (id)=>{
   deleteNotifications(id)
}
	return (
		<>
			<div className='flex-[4_4_0] border-l border-r border-gray-700 min-h-screen'>
				<div className='flex justify-between items-center p-4 border-b border-gray-700'>
					<p className='font-bold'>Notifications</p>
					<div className='dropdown '>
						<div tabIndex={0} role='button' className='m-1'>
							<IoSettingsOutline className='w-4' />
						</div>
						<ul
							tabIndex={0}
							className='dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52'
						>
							<li>
								<a onClick={deleteNotifications}>Delete all notifications</a>
							</li>
						</ul>
					</div>
				</div>
				{isLoading && (
					<div className='flex justify-center h-full items-center'>
						<LoadingSpinner size='lg' />
					</div>
				)}
				{notifications?.length === 0 && <div className='text-center p-4 font-bold'>No notifications 🤔</div>}
				{notifications?.map((notification) => (
					<div className='border-b flex justify-between border-gray-700' key={notification._id}>
						<div className='flex gap-5 p-4'>
							{notification.type === "follow" && <FaUser className='w-7 h-7 text-primary' />}
							{notification.type === "like" && <FaHeart className='w-7 h-7 text-red-500' />}
						
							<Link to={`/profile/${notification.from.username}`}>
								<div className='avatar'>
									<div className='w-8 rounded-full'>
										<img src={notification.from.profileImg || "/avatar-placeholder.png"} />
									</div>
								</div>
								<div className='flex gap-1'>
									<span className='font-bold'>@{notification.from.username}</span>{" "}
									{notification.type === "follow" ? "followed you" : "liked your post"}
								</div>
							</Link>
							
						</div>
						<button className="p-2 mr-9" onClick={()=>handleDelete(notification._id)}  ><MdDeleteOutline className="w-6 h-6 hover:text-red-500" /></button>
					</div>
				))}
			</div>
		</>
	);
};
export default NotificationPage;