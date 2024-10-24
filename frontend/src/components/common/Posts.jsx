import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const Posts = ({feedType}) => {


	const getPostEndpoint = ()=>{
		switch (feedType){
			case "forYou":
				return "/api/posts/getposts";
			case "following":
			return "api/posts/following"

			default:
				return "/api/posts/getposts"
		}
	}
	const POST_ENDPOINT = getPostEndpoint()

	const {data:posts,isLoading,refetch,isRefetching} = useQuery({
		querykey:["posts"],
		queryFn:async()=>{
            try {
				const res = await fetch(POST_ENDPOINT)
				const data = await res.json()

				if(!res.ok){
					throw new Error(data.error)
				}
				return data
			} catch (error) {
				console.log("error in getPosts",error)
				throw error
			}
		}
	})


	useEffect(()=>{
		refetch()
	},[feedType])

	return (
		<>
			{(isLoading || isRefetching) && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			{!isLoading && !isRefetching && posts?.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
			{!isLoading && !isRefetching && posts && (
				<div>
					{posts.map((post) => (
						<Post key={post._id} post={post} />
					))}
				</div>
			)}
		</>
	);
};
export default Posts;