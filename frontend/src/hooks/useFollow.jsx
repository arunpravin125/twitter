import toast from "react-hot-toast";
import { useMutation,useQueryClient } from "@tanstack/react-query";

export const useFollow = ()=>{
    const queryClient = useQueryClient()

    const {mutate:follow,isPending} = useMutation({
        mutationFn:async(userId)=>{
            console.log("follow",userId)
            try {
                const res = await fetch(`/api/users/follow/${userId}`,{
                    method:"POST",
                    headers:{
                        "Content-type":"application/json"
                    }

                })
                const data = await res.json()
                if(!res.ok) throw new Error(data.error || "something went wrong")
                    console.log("following or unfollow",data)
                return data
            } catch (error) {
                console.log("error in followAndUnfollowin",error)
                toast.error(error.message)
            }
        },
        onSuccess:(follow)=>{
        queryClient.invalidateQueries({queryKey:["authUser"]}),

          queryClient.invalidateQueries({queryKey:["suggestedUser"]})
           
          queryClient.setQueryData(["authUser"],(oldData)=>{
            console.log("authOldData",oldData)
           return oldData?{...oldData,following:follow}:oldData
          })
        },
        onError:()=>{
            toast.error(error.message)
        }

    })
    return {follow,isPending}
}