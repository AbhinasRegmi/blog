import { CommandMenu } from '@/components/CommandMenu';
import { useReducer } from 'react';
import { editorReducer } from '@/context/editorReducer';
import { editorContext } from '@/context/editorContext';

export function NewStory() {
    const [blocks, dispatchfn] = useReducer(editorReducer, []);

    return (
        <editorContext.Provider value={{dispatch: dispatchfn}}>
            <div className='bg-accent/10'>
                <div className='lg:max-w-3xl h-screen mx-auto bg-white'>
                    {
                        blocks.map(block => block.value)
                    }
                </div>
                <CommandMenu dispatch={dispatchfn} />
            </div>
        </editorContext.Provider>
    )
}