import { CommandMenu } from '@/components/CommandMenu';
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useReducer } from 'react';
import { editorReducer } from '@/context/editorReducer';
import { editorContext } from '@/context/editorContext';
import { EditorBlockBuilder } from '../ui/editorBlocks';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getStoryData, updateStoryData } from '@/api/login';
import { StoryNotFound } from './StoryNotFound';
import { useLocalToken } from '@/hooks/localStorage';
import { useSearchParams } from 'react-router-dom';

export function NewStory() {
    const { toast } = useToast();
    const [blocks, dispatchfn] = useReducer(editorReducer, []);

    let token = useLocalToken();
    let [searchParams, setSearchParams] = useSearchParams();
    let { data, isLoading, isError } = useQuery({
        queryKey: ['newstory'],
        queryFn: async () => getStoryData(searchParams.get('id'), token)
    });

    let mutation = useMutation({
        mutationFn: async () => updateStoryData(token, searchParams.get('id')!, blocks)
    })



    useEffect(() => {
        toast(
            {
                title: 'Unleash your creativity.',
                description: 'Press ` ctrl + K ` to get started.'
            }
        )
    }, [])

    useEffect(() => {
        if(!searchParams.get('id') && !isLoading){
            setSearchParams(`id=${data?.data.storyID}`)
        }
    })

    useEffect(() => {
        if(data?.data && searchParams.get('id')){
            dispatchfn({
                type: 'sync',
                value: data?.data.content === '' ? '[]' : data?.data.content,
            })
        }
        
    }, [data])

    useEffect(() => {
        if (data?.data) {
            mutation.mutate()
        }
    }, [blocks])

    if (isLoading) {
        <div>Loading...</div>
    }

    if (isError) {
        return <StoryNotFound />
    }



    return (
        <editorContext.Provider value={{ dispatch: dispatchfn }}>
            <div className='bg-accent/10'>
                <div className='lg:max-w-3xl min-h-dvh mx-auto bg-white'>
                    {
                        blocks.map(block => <EditorBlockBuilder key={block.key} block={block} contentEditable={true} />)
                    }
                </div>
                <CommandMenu dispatch={dispatchfn} />
            </div>
        </editorContext.Provider>
    )
}


