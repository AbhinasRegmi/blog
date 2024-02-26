import { useState, useEffect } from 'react';

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
} from "@/components/ui/command"

import { BlockAction } from '@/context/editorReducer';



export function CommandMenu(props: {dispatch: (i: BlockAction) => void}) {
    const [open, setOpen] = useState(false)

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }
        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    return (
        <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Basic blocks">
                    <CommandItem onSelect={() => {props.dispatch({type: 'title'}); setOpen(p=>!p);}}>Title</CommandItem>
                    <CommandItem onSelect={() => {props.dispatch({type: 'section'}); setOpen(p=>!p);}}>Section</CommandItem>
                    <CommandItem onSelect={() => {props.dispatch({type: 'header'}); setOpen(p=>!p);}}>Header</CommandItem>
                    <CommandItem onSelect={() => {props.dispatch({type: 'paragraph'}); setOpen(p=>!p);}}>Paragraph</CommandItem>
                </CommandGroup>
                <CommandGroup heading="Utilities">
                <CommandItem onSelect={() => setOpen(p=>!p)}>Escape</CommandItem>
                <CommandItem onSelect={() => {props.dispatch({type: 'gap'}); setOpen(p=>!p);}}>Create Gap</CommandItem>
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    )
}
