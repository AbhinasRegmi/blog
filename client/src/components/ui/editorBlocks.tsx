import { editorContext } from "@/context/editorContext";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip";
import { useContext, useEffect, useRef, useState } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";

export type UIBlocks = 'title' | 'section' | 'header' | 'paragraph' | 'quote' | 'code' | 'link' | 'separator';
export type BlockType = {
    key: string;
    type: UIBlocks;
    value: string;
}

export function EditorBlockBuilder(props: {block: BlockType, contentEditable: boolean}){
    switch(props.block.type){
        case('title'):{
            return (
                <TitleBlock {...props} />
            )
        }
        case('section'):{
            return (
                <SectionHeaderBlock {...props} />
            )
        }
        case('header'): {
            return (
                <HeaderBlock {...props} />
            )
        }
        case('paragraph'): {
            return (
                <ParagraphBlock {...props} />
            )
        }
        case('separator'): {
            return (
                <SeparatorBlock {...props} />
            )
        }
        case('quote'): {
            return (
                <QuoteBlock {...props} />
            )
        }
        case('code'): {
            return (
                <CodeBlock {...props} />
            )
        }
        case('link'): {
            return (
                <LinkBlock {...props} />
            )
        }
        default:{
            throw new Error('Unimplemented type of UI Block.')
        }
    }
}

function TitleBlock(props: { block: BlockType, contentEditable: boolean }) {
    let { blockRef, handleInput } = useBlockRef(props.block);

    return (
        <div className="pt-8">
            <h1 ref={blockRef} contentEditable={props.contentEditable} onInput={(e) => handleInput(e.currentTarget.textContent ?? '')} className="-ml-1 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl py-2 focus:outline-none empty:after:content-['Title...'] after:opacity-30"></h1>
        </div>
    )
}

function SectionHeaderBlock(props: { block: BlockType, contentEditable: boolean }) {
    let ref = useBlockRef(props.block);
    return (
        <div className="">
            <h2 ref={ref.blockRef} onInput={e=>ref.handleInput(e.currentTarget.textContent ?? '')} contentEditable={props.contentEditable} className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 focus:outline-none empty:after:content-['Section_header...'] after:opacity-30"></h2>
        </div>
    )
}

function HeaderBlock(props: { block: BlockType, contentEditable: boolean }) {
    let ref = useBlockRef(props.block);

    return (
        <div className="">
            <h3 ref={ref.blockRef} onInput={e=>ref.handleInput(e.currentTarget.textContent ?? '')} contentEditable={props.contentEditable} className="scroll-m-20 text-2xl font-semibold tracking-tight focus:outline-none empty:after:content-['Header...'] after:opacity-30"></h3>
        </div>
    )
}

function ParagraphBlock(props: { block: BlockType, contentEditable: boolean }) {
    let ref = useBlockRef(props.block);

    return (
        <div className="inline">
            <p ref={ref.blockRef} onInput={e=>ref.handleInput(e.currentTarget.textContent ?? '')} contentEditable={props.contentEditable} className="focus:outline-none empty:after:content-['Paragraph...'] after:opacity-30 inline"></p>
        </div>
    )
}

function QuoteBlock(props: { block: BlockType, contentEditable: boolean }) {
    let ref = useBlockRef(props.block);

    return (
        <div contentEditable={props.contentEditable} ref={ref.blockRef} onInput={e=>ref.handleInput(e.currentTarget.textContent ?? '')} className="focus:outline-none mt-6 ml-8">
            <blockquote className="border-l-2 pl-6 italic empty:after:content-['Quotes...'] after:opacity-30"></blockquote>
        </div>
    )
}

function CodeBlock(props: { block: BlockType, contentEditable: boolean }) {
    let ref = useBlockRef(props.block);

    return (
        <div className="px-8 my-4">
            <div className="w-full bg-muted min-h-[100px] rounded-md px-6 py-1">
                <code ref={ref.blockRef} onInput={e=>ref.handleInput(e.currentTarget.textContent ?? '')} contentEditable={props.contentEditable} className="rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold focus:outline-none empty:after:content-['Enter_your_code...'] after:opacity-30"></code>
            </div>
        </div>
    )
}

function SeparatorBlock(props: { block: BlockType, contentEditable: boolean }) {
    const { dispatch } = useContext(editorContext);
    let ref = useBlockRef(props.block);

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger className="w-full">
                    <div ref={ref.blockRef} className='h-14 border-x-2 border-muted'></div>
                </TooltipTrigger>
                <TooltipContent onClick={() => {if(dispatch) dispatch({type: 'delete', key: props.block.key })}} className="cursor-pointer">
                    Remove Separator
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

function useBlockRef(block: BlockType) {
    const blockRef = useRef<HTMLDivElement>(null);
    const { dispatch } = useContext(editorContext);
    let timer: any = null;

    function handleKeyDown(event: KeyboardEvent) {
        if (event.key === 'Backspace' && blockRef.current?.textContent === '') {
            if (dispatch) {
                dispatch({ type: 'delete', key: block.key })
            }
        }
    }

    function handleInput(content: string){
        if(timer){
            clearTimeout(timer);
        }

        timer = setTimeout(
            () => {
                if(dispatch){
                    dispatch({
                        type: 'update',
                        key: block.key,
                        value: content
                    })
                }
            },
            800
        )
    }

    useEffect(() => {
        blockRef.current?.focus();
        blockRef.current?.addEventListener('keydown', handleKeyDown);

        return () => {
            blockRef.current?.removeEventListener("keydown", handleKeyDown);
        }
    }, [])

    return { blockRef, handleInput }
}

// Special Blocks

function LinkBlock(props: { block: BlockType, contentEditable: boolean }) {
    const { dispatch } = useContext(editorContext);
    const blockRef = useRef<HTMLAnchorElement>(null);

    const [link, setLink] = useState<string>('');
    const [showChild, setShowChild] = useState<boolean>(false);
    
    let child = (<span className="text-foreground/60 pl-1"><FaExternalLinkAlt /></span>);
    let timer: any = null;

    function handleKeyDown(event: KeyboardEvent) {
        if (event.key === 'Backspace' && blockRef.current?.textContent === '') {
            if (dispatch) {
                dispatch({ type: 'delete', key: props.block.key })
            }
        } else if (event.key === 'Enter' && link.length == 0 && blockRef.current?.textContent) {
            event.preventDefault();
            setLink(blockRef.current.textContent);
            blockRef.current.textContent = '';
        } else if (event.key === 'Enter' && link.length !== 0) {
            event.preventDefault();
            blockRef.current?.blur();
            setShowChild(true);
        }
    }

        function handleInput(content: string){
            if(timer){
                clearTimeout(timer);
            }
    
            timer = setTimeout(
                () => {
                    if(dispatch){
                        dispatch({
                            type: 'update',
                            key: props.block.key,
                            value: content
                        })
                    }
                },
                800
            )
        }
    
    useEffect(() => {
        !showChild && blockRef.current?.focus();
        blockRef.current?.addEventListener('keydown', handleKeyDown);

        return () => blockRef.current?.removeEventListener("keydown", handleKeyDown);
    })

    let content = link.length === 0 ? <a ref={blockRef} onInput={e=>handleInput(e.currentTarget.textContent ?? '')} key='link' contentEditable={props.contentEditable} href={link} className="font-medium focus:outline-none empty:after:content-['Enter_link_and_press_enter...'] after:opacity-30 underline inline"></a> : <a target='_blank' ref={blockRef} href={link} contentEditable={props.contentEditable} key='name' className="font-medium focus:outline-none empty:after:content-['Enter_name_for_link...'] after:opacity-30 underline inline-flex items-center">{showChild && child}</a>;

    return (
        content
    )
}