import React from 'react';
import { MoreHorizontal, Trash, Pencil, MonitorOff, Eye, ImageUp, Rocket, ArrowUpZA } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useNavigate } from "react-router-dom";
import { StoryTitle, updateStoryStatus, deleteStory } from "@/api/login";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocalToken } from "@/hooks/localStorage";
import { Delete } from './Delete';
import { Summary } from './ui/Summary';


export function DraftsLi(props: { data: StoryTitle }) {
    const [open, setOpen] = React.useState(false);
    const [summaryOpen, setSummaryOpen] = React.useState(false);
    const [deleteOpen, setDeleteOpen] = React.useState(false);
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    let token = useLocalToken();


    const umutation = useMutation({
        mutationFn: updateStoryStatus,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['mineStories'] })
        }
    })

    const dmutation = useMutation({
        mutationFn: deleteStory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['mineStories'] })
        }
    })

    return (
        <div className="flex w-full items-center justify-between rounded-md border px-4 py-3">
            <p className="text-sm font-medium flex leading-7">
                <span className="mr-2 rounded-lg bg-orange-500/90 px-2 py-1 text-xs text-primary-foreground tracking-wider self-center">
                    draft
                </span>
                <span className="text-muted-foreground line-clamp-1">{props.data.title}</span>
            </p>
            <DropdownMenu open={open} onOpenChange={setOpen}>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                        <MoreHorizontal />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuGroup>
                        <DropdownMenuItem onClick={() => { navigate(`/new-story?id=${props.data.key}`) }}>
                            <Pencil className="mr-2 w-4 h-4" />
                            Edit now
                        </DropdownMenuItem>

                        <DropdownMenuItem onSelect={() => setSummaryOpen(true)}>
                            <ArrowUpZA className='mr-2 w-4 h-4' />
                            Add Summary
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <ImageUp className='mr-2 w-4 h-4' />
                            Add Cover
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { umutation.mutate({ token: token, storyID: props.data.key, isPublished: true }); }}>
                            <Rocket className="mr-2 h-4 w-4" />
                            Publish now
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600" onClick={() => setDeleteOpen(true)}>
                            <Trash className='mr-2 h-4 w-4' />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>

            <Summary storyID={props.data.key} token={token} summaryOpen={summaryOpen} setSummaryOpen={setSummaryOpen} />
            <Delete content='saved draft.' fn={() => { dmutation.mutate({ token: token, storyID: props.data.key }) }} deleteOpen={deleteOpen} setDeleteOpen={setDeleteOpen} />
        </div>
    )
}

export function PublishedLi(props: { data: StoryTitle }) {
    const [open, setOpen] = React.useState(false);
    const [deleteOpen, setDeleteOpen] = React.useState(false);
    const queryClient = useQueryClient();
    let token = useLocalToken();
    const navigate = useNavigate();



    const umutation = useMutation({
        mutationFn: updateStoryStatus,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['mineStories'] })
        }
    })

    const dmutation = useMutation({
        mutationFn: deleteStory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['mineStories'] })
        }
    })

    return (
        <div className="flex w-full items-center justify-between rounded-md border px-4 py-3">
            <p className="text-sm font-medium leading-none flex items-center">
                <span className="mr-2 rounded-lg bg-green-500/90 px-2 py-1 text-xs text-primary-foreground tracking-wider">
                    online
                </span>
                <span className="text-muted-foreground line-clamp-1">{props.data.title}</span>
            </p>
            <DropdownMenu open={open} onOpenChange={setOpen}>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                        <MoreHorizontal />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuGroup>
                        <DropdownMenuItem onClick={() => { navigate(`/story?id=${props.data.key}`) }}>
                            <Eye className="mr-2 w-4 h-4" />
                            View Story
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { umutation.mutate({ token: token, storyID: props.data.key, isPublished: false }); }}>
                            <MonitorOff className="mr-2 h-4 w-4" />
                            Unpublish now
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600" onClick={() => setDeleteOpen(true)}>
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>

            <Delete content='published story.' fn={() => { dmutation.mutate({ token: token, storyID: props.data.key }) }} deleteOpen={deleteOpen} setDeleteOpen={setDeleteOpen} />
        </div>
    )
}
