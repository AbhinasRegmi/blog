import { CommandMenu } from '@/components/CommandMenu';
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useReducer } from 'react';
import { editorReducer } from '@/context/editorReducer';
import { editorContext } from '@/context/editorContext';

export function NewStory() {
    const [blocks, dispatchfn] = useReducer(editorReducer, []);
    const { toast } = useToast();

    useEffect(() => {
        toast(
            {
                title: 'Unleash your creativity.',
                description: 'Press ` ctrl + Enter ` to get started.'
            }
        )
    }, [])

    return (
        <editorContext.Provider value={{ dispatch: dispatchfn }}>
            <div className='bg-accent/10'>
                <div className='lg:max-w-3xl min-h-dvh mx-auto bg-white'>
                    {
                        blocks.map(block => block.value)
                    }
                </div>
                <CommandMenu dispatch={dispatchfn} />
            </div>
        </editorContext.Provider>
    )
}