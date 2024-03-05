import { useSearchParams } from "react-router-dom";
import { StoryNotFound } from "./StoryNotFound";
import { useQuery } from "@tanstack/react-query";
import { viewPublicStory } from "@/api/login";
import { useEffect, useReducer } from "react";
import { editorReducer } from "@/context/editorReducer";
import { editorContext } from "@/context/editorContext";
import { EditorBlockBuilder } from "../ui/editorBlocks";

export function ViewStory(){
    let [searchParams] = useSearchParams();
    const [blocks, dispatchfn] = useReducer(editorReducer, []);


    if(!searchParams.get('id')){
        return <StoryNotFound />
    }

    let {data, isLoading, isError} = useQuery({
        queryKey: ['viewStory'],
        queryFn: async () => viewPublicStory(searchParams.get('id') ?? '')
    })

    useEffect(() => {
        if(data?.data && searchParams.get('id')){
            dispatchfn({
                type: 'sync',
                value: data?.data.content === '' ? '[]' : data?.data.content,
            })
        }
        
    }, [data])

    if(isLoading){
        return <div>Loading...</div>
    }

    if(isError){
        return <StoryNotFound />
    }

    return (
        <editorContext.Provider value={{ dispatch: dispatchfn }}>
        <div className='bg-accent/10'>
            <div className='lg:max-w-3xl mx-auto bg-white px-2'>
                {
                    blocks.map(block => <EditorBlockBuilder key={block.key} block={block} contentEditable={false} />)
                }
            </div>
        </div>
    </editorContext.Provider>
    )
}