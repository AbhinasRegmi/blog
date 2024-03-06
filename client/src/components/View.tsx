import { StoryTitle, viewPublicStories } from "@/api/login";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

export function View() {
    let { data, isLoading, isError } = useQuery({
        queryKey: ['viewStory'],
        queryFn: viewPublicStories,
    })

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (isError) {
        return <div>Error...</div>
    }

    if(!data?.data.length){
        return <div>There are no stories to show.</div>
    }


    return (
        <div className="divide-y">
            {
                data?.data.map(i => <ViewItem key={i.key} data={i} />)
            }
        </div>
    )
}


function ViewItem(props: { data: StoryTitle }) {
    return (
        <div className="py-8 space-y-2">
            <div className="relative -z-10 flex items-center gap-x-1">
                <Avatar className="-z-1">
                    <AvatarImage src={props.data.authorImageUrl} />
                    <AvatarFallback>mB</AvatarFallback>
                </Avatar>
                <div className="text-black">{props.data.author}</div>
                <span className="text-muted-foreground">.</span>
                <div className="text-foreground/60 text-sm">{props.data.updatedAt}</div>
            </div>
            <Link to={`/story/?id=${props.data.key}`}>
                <div className="flex items-center gap-6 justify-between">
                    <div className="space-y-1">
                        <div className="text-2xl font-bold tracking-tight">
                            {props.data.title}
                        </div>
                        <p className="line-clamp-2 text-left leading-tight text-black/90 pr-4 h-[2.7rem]">
                            {props.data.summary ?? 'Read More...'}
                        </p>
                    </div>
                    <div className="w-[100px] aspect-square shrink-0 bg-red-100">
                        <img className="object-cover" src={''} alt="" />
                    </div>
                </div>
            </Link>
        </div>
    )
}