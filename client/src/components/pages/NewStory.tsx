import { CommandMenu } from '@/components/CommandMenu';
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useReducer } from 'react';
import { editorReducer } from '@/context/editorReducer';
import { editorContext } from '@/context/editorContext';
import { EditorBlockBuilder } from '../ui/editorBlocks';

export function NewStory() {
    const [blocks, dispatchfn] = useReducer(editorReducer, []);
    console.log(blocks);
    const { toast } = useToast();

    useEffect(() => {
        toast(
            {
                title: 'Unleash your creativity.',
                description: 'Press ` ctrl + K ` to get started.'
            }
        )
    }, [])

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


