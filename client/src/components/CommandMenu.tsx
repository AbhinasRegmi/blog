import { useState, useEffect } from 'react';

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator
} from "@/components/ui/command"

import { ActionPayloadType } from '@/context/editorReducer';



export function CommandMenu(props: { dispatch: (i: ActionPayloadType) => void }) {
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
                    <CommandItem onSelect={() => { props.dispatch({ type: 'create', uitype: 'title' }); setOpen(p => !p); }}>Title</CommandItem>
                    <CommandItem onSelect={() => { props.dispatch({ type: 'create', uitype: 'section' }); setOpen(p => !p); }}>Section</CommandItem>
                    <CommandItem onSelect={() => { props.dispatch({ type: 'create', uitype: 'header' }); setOpen(p => !p); }}>Header</CommandItem>
                    <CommandItem onSelect={() => { props.dispatch({ type: 'create', uitype: 'paragraph' }); setOpen(p => !p); }}>Paragraph</CommandItem>
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading='Other blocks'>
                    <CommandItem onSelect={() => { props.dispatch({ type: 'create', uitype: 'separator' }); setOpen(p => !p); }}>Separator</CommandItem>
                    <CommandItem onSelect={() => { props.dispatch({ type: 'create', uitype: 'code' }); setOpen(p => !p); }}>Code</CommandItem>
                    <CommandItem onSelect={() => { props.dispatch({ type: 'create', uitype: 'link' }); setOpen(p => !p); }}>Link</CommandItem>
                    <CommandItem onSelect={() => { props.dispatch({ type: 'create', uitype: 'quote' }); setOpen(p => !p); }}>Quote block</CommandItem>
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="Utilities">
                    <CommandItem onSelect={() => setOpen(p => !p)}>Escape</CommandItem>
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    )
}
