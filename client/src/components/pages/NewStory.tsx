import { CommandMenu } from '@/components/CommandMenu';
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useReducer, useState } from 'react';
import { editorReducer } from '@/context/editorReducer';
import { editorContext } from '@/context/editorContext';
import { EditorBlockBuilder } from '../ui/editorBlocks';

export function NewStory() {
    const [blocks, dispatchfn] = useReducer(editorReducer, []);
    const [isFirstLoad, setIsFirstLoad] = useState(true);
    let params = new URLSearchParams(location.search);
    const { toast } = useToast();
    
    useEffect(() => {
        toast(
            {
                title: 'Unleash your creativity.',
                description: 'Press ` ctrl + K ` to get started.'
            }
        )
        setIsFirstLoad(false);
    }, [])

    useEffect(() => {
        let storyID = params.get('id');

        if(storyID){
            
        }


    }, [params])

    return (
        <editorContext.Provider value={{ dispatch: dispatchfn }}>
            <div className='bg-accent/10'>
                <div className='lg:max-w-3xl min-h-dvh mx-auto bg-white'>
                    {
                        blocks.map(block => <EditorBlockBuilder key={block.key} block={block} contentEditable={!isFirstLoad} />)
                    }
                </div>
                <CommandMenu dispatch={dispatchfn} />
            </div>
        </editorContext.Provider>
    )
}


