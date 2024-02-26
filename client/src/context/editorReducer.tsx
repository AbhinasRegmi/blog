import { useEffect, useRef, useContext } from "react";
import { editorContext } from "./editorContext";

export type BlockTypes = {
    type: 'title' | 'section' | 'header' | 'paragraph' | 'gap' | 'escape' | 'delete',
}
export interface BlockAction extends BlockTypes {
    deletethis?: string,
}
export interface BlockInterface extends BlockTypes {
    key: string,
    value: React.ReactNode,
}
export function editorReducer(state: Array<BlockInterface>, action: BlockAction): Array<BlockInterface> {
    let identifier = crypto.randomUUID();

    switch (action.type) {
        case ('title'): {
            return ([
                ...state,
                {
                    key: identifier,
                    type: 'title',
                    value: <TitleBlock key={identifier} identifier={identifier} />
                }
            ])
        }
        case ('section'): {
            return ([
                ...state,
                {
                    key: identifier,
                    type: 'section',
                    value: <SectionHeaderBlock key={identifier} identifier={identifier} />
                }
            ])
        }
        case ('header'): {
            return (
                [
                    ...state,
                    {
                        key: identifier,
                        type: 'header',
                        value: <HeaderBlock key={identifier} identifier={identifier} />
                    }
                ]
            )
        }
        case ('paragraph'): {
            return (
                [
                    ...state,
                    {
                        key: identifier,
                        type: 'paragraph',
                        value: <ParagraphBlock key={identifier} identifier={identifier} />
                    }
                ]
            )
        }
        case ('gap'): {
            return ([
                ...state,
                {
                    key: identifier,
                    type: 'gap',
                    value: <GapBlock key={identifier} identifier={identifier}/>
                }
            ])
        }
        case ('delete'): {
            if(action.deletethis){
                return state.filter(block => block.key !== action.deletethis)
            }
            return state;
        }
        default: {
            throw new Error(`Unknown Action Type: ${action.type}`)
        }
    }
}

// Basic Blocks
function TitleBlock(props: {identifier: string}) {
    let {focusRef} = useFocusRef(props.identifier);

    return (
        <div className="pt-8">
            <h1 ref={focusRef} contentEditable={true} className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl p-2 focus:outline-none empty:after:content-['Title...'] after:opacity-30"></h1>
        </div>
    )
}

function SectionHeaderBlock(props: {identifier: string}) {
    let ref = useFocusRef(props.identifier);
    return (
        <div className="px-4">
            <h2 ref={ref.focusRef} contentEditable={true} className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 p-2 focus:outline-none empty:after:content-['Section_header'] after:opacity-30"></h2>
        </div>
    )
}

function HeaderBlock(props: {identifier: string}) {
    let ref = useFocusRef(props.identifier);

    return (
        <div className="py-2 px-2">
            <h3 ref={ref.focusRef} contentEditable={true} className="scroll-m-20 text-2xl font-semibold tracking-tight p-2 focus:outline-none empty:after:content-['Header'] after:opacity-30"></h3>
        </div>
    )
}

function ParagraphBlock(props: {identifier: string}) {
    let ref = useFocusRef(props.identifier);

    return (
        <div className="py-1 px-3">
            <p ref={ref.focusRef} contentEditable={true} className="leading-7 [&:not(:first-child)]:mt-6 p-2 focus:outline-none empty:after:content-['Header'] after:opacity-30"></p>
        </div>
    )
}

// Utilities
function GapBlock(props: {identifier: string}){
    let ref = useFocusRef(props.identifier);

    return (
        <div ref={ref.focusRef} className="h-12 w-full"></div>
    )
}

function useFocusRef(identifier: string) {
    const focusRef = useRef<HTMLDivElement>(null);
    const {dispatch} = useContext(editorContext);

    function handleKeyDown(event: KeyboardEvent){
        if(event.key === 'Backspace' && focusRef.current?.textContent === ''){
            if(dispatch){
                dispatch({type: 'delete', deletethis: identifier})
            }
        }
    }

    useEffect(() => {
        focusRef.current?.focus();
        focusRef.current?.addEventListener('keydown', handleKeyDown);

        return () => focusRef.current?.removeEventListener("keydown", handleKeyDown);
    }, [])

    return { focusRef }
}