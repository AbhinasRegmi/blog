import { useEffect, useRef, useContext, useState } from "react";
import { editorContext } from "./editorContext";
import { FaExternalLinkAlt } from "react-icons/fa";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"


export type BlockTypes = {
    type: 'title' | 'section' | 'header' | 'paragraph' | 'escape' | 'delete' | 'quote' | 'code' | 'link' | 'separator',
}
export interface BlockAction extends BlockTypes {
    deletethis?: string,
}
export interface BlockInterface extends BlockTypes {
    key: string,
    value: JSX.Element,
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
        case ('delete'): {
            if (action.deletethis) {
                return state.filter(block => block.key !== action.deletethis)
            }
            return state;
        }
        case ('quote'): {
            return (
                [
                    ...state,
                    {
                        key: identifier,
                        type: 'quote',
                        value: <QuoteBlock key={identifier} identifier={identifier} />
                    }
                ]
            )
        }
        case ('code'): {
            return (
                [
                    ...state,
                    {
                        key: identifier,
                        type: 'code',
                        value: <CodeBlock key={identifier} identifier={identifier} />
                    }
                ]
            )
        }
        case ('link'): {
            return (
                [
                    ...state,
                    {
                        key: identifier,
                        type: 'link',
                        value: <LinkBlock key={identifier} identifier={identifier} />
                    }
                ]
            )
        }
        case ('separator'): {
            return (
                [
                    ...state,
                    {
                        key: identifier,
                        type: 'separator',
                        value: <SeparatorBlock key={identifier} identifier={identifier} />
                    }
                ]
            )
        }
        default: {
            throw new Error(`Unknown Action Type: ${action.type}`)
        }
    }
}

// Basic Blocks
function TitleBlock(props: { identifier: string }) {
    let { focusRef } = useFocusRef(props.identifier);

    return (
        <div className="pt-8">
            <h1 ref={focusRef} contentEditable={true} className="-ml-1 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl p-2 focus:outline-none empty:after:content-['Title...'] after:opacity-30"></h1>
        </div>
    )
}

function SectionHeaderBlock(props: { identifier: string }) {
    let ref = useFocusRef(props.identifier);
    return (
        <div className="">
            <h2 ref={ref.focusRef} contentEditable={true} className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 p-2 focus:outline-none empty:after:content-['Section_header...'] after:opacity-30"></h2>
        </div>
    )
}

function HeaderBlock(props: { identifier: string }) {
    let ref = useFocusRef(props.identifier);

    return (
        <div className="">
            <h3 ref={ref.focusRef} contentEditable={true} className="scroll-m-20 text-2xl font-semibold tracking-tight p-2 focus:outline-none empty:after:content-['Header...'] after:opacity-30"></h3>
        </div>
    )
}

function ParagraphBlock(props: { identifier: string }) {
    let ref = useFocusRef(props.identifier);

    return (
        <div className="inline">
            <p ref={ref.focusRef} contentEditable={true} className="leading-7 focus:outline-none empty:after:content-['Paragraph...'] after:opacity-30 inline pl-2"></p>
        </div>
    )
}

function QuoteBlock(props: { identifier: string }) {
    let ref = useFocusRef(props.identifier);

    return (
        <div contentEditable={true} ref={ref.focusRef} className="focus:outline-none mt-6 ml-8">
            <blockquote className="border-l-2 pl-6 italic empty:after:content-['Quotes...'] after:opacity-30"></blockquote>
        </div>
    )
}

function CodeBlock(props: { identifier: string }) {
    let ref = useFocusRef(props.identifier);

    return (
        <div className="px-8 my-4">
            <div className="w-full bg-muted min-h-[100px] rounded-md px-6 py-1">
                <code ref={ref.focusRef} contentEditable={true} className="rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold focus:outline-none empty:after:content-['Enter_your_code...'] after:opacity-30"></code>
            </div>
        </div>
    )
}

function LinkBlock(props: { identifier: string }) {
    const focusRef = useRef<HTMLAnchorElement>(null);
    const [showChild, setShowChild] = useState<boolean>(false);
    const [link, setLink] = useState<string>('');
    const { dispatch } = useContext(editorContext);
    let child = (<span className="text-foreground/60 pl-1"><FaExternalLinkAlt /></span>);

    function handleKeyDown(event: KeyboardEvent) {
        if (event.key === 'Backspace' && focusRef.current?.textContent === '') {
            if (dispatch) {
                dispatch({ type: 'delete', deletethis: props.identifier })
            }
        } else if (event.key === 'Enter' && link.length == 0 && focusRef.current?.textContent) {
            event.preventDefault();
            setLink(focusRef.current.textContent);
            focusRef.current.textContent = '';
        } else if (event.key === 'Enter' && link.length !== 0) {
            event.preventDefault();
            focusRef.current?.blur();
            setShowChild(true);
        }
    }

    useEffect(() => {
        !showChild && focusRef.current?.focus();
        focusRef.current?.addEventListener('keydown', handleKeyDown);

        return () => focusRef.current?.removeEventListener("keydown", handleKeyDown);
    })

    let content = link.length === 0 ? <a ref={focusRef} key='link' contentEditable={true} href={link} className="font-medium focus:outline-none empty:after:content-['Enter_link_and_press_enter...'] after:opacity-30 underline inline"></a> : <a target='_blank' ref={focusRef} href={link} contentEditable={true} key='name' className="font-medium focus:outline-none empty:after:content-['Enter_name_for_link...'] after:opacity-30 underline inline-flex items-center">{showChild && child}</a>;

    return (
        content
    )
}

function SeparatorBlock(props: { identifier: string }) {
    const { dispatch } = useContext(editorContext);
    let ref = useFocusRef(props.identifier);

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger className="w-full">
                    <div ref={ref.focusRef} className='h-14 border-x-2 border-muted'></div>
                </TooltipTrigger>
                <TooltipContent onClick={() => {if(dispatch) dispatch({type: 'delete',deletethis: props.identifier })}} className="cursor-pointer">
                    Remove Separator
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

// Utilities
function useFocusRef(identifier: string) {
    const focusRef = useRef<HTMLDivElement>(null);
    const { dispatch } = useContext(editorContext);

    function handleKeyDown(event: KeyboardEvent) {
        if (event.key === 'Backspace' && focusRef.current?.textContent === '') {
            if (dispatch) {
                dispatch({ type: 'delete', deletethis: identifier })
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