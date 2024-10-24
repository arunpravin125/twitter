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
                return data
            } catch (error) {
                console.log("error in followAndUnfollowin",error)
                toast.error(error.message)
            }
        },
        onSuccess:()=>{
          Promise.all([ queryClient.invalidateQueries({queryKey:["suggestedUser"]}),
           queryClient.invalidateQueries({queryKey:["authUser"]})])
        },
        onError:()=>{
            toast.error(error.message)
        }

    })
    return {follow,isPending}
}