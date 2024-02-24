import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { FaRegUser, FaRegBookmark } from "react-icons/fa";
import { RiArticleLine } from "react-icons/ri";
import { FaChartSimple } from "react-icons/fa6";
import React from "react";
import { Link } from "react-router-dom";

export function Profile() {
    const secondSection = [
        'Settings',
        'Refine recommendations',
        'Manage publications',
        'Help'
    ]

    const userEmail = 'testmail@gmail.com';
    const userProfile = '';

    return (
        <Sheet>
            <SheetTrigger>
                <Avatar className="hover:shadow-sm">
                    <AvatarImage src={userProfile} />
                    <AvatarFallback>mB</AvatarFallback>
                </Avatar>
            </SheetTrigger>
            <SheetContent>
                <ul className="py-6 h-full">
                    <SheetClose asChild className="w-full">
                        <Link to={'/me'}>
                            <ProfileItem>
                                <FaRegUser />
                                <p>Profile</p>
                            </ProfileItem>
                        </Link>
                    </SheetClose>
                    <ProfileItem>
                        <FaRegBookmark />
                        <p>Library</p>
                    </ProfileItem>
                    <ProfileItem>
                        <RiArticleLine className="text-xl" />
                        <p>Stories</p>
                    </ProfileItem>
                    <ProfileItem>
                        <FaChartSimple />
                        <p>Stats</p>
                    </ProfileItem>

                    <Separator />

                    {
                        secondSection.map((item) => <ProfileItem key={item}>{item}</ProfileItem>)
                    }

                    <Separator />

                    <ProfileItem>Sign out
                        <div className="text-sm tracking-wide">({userEmail})</div>
                    </ProfileItem>
                </ul>
            </SheetContent>
        </Sheet>


    )
}

function ProfileItem(props: { children: React.ReactNode, className?: string, disableTab?: boolean }) {
    return (
        <li tabIndex={props.disableTab ? -1 : 0} className={cn('flex items-center gap-3 px-6 py-2 text-lg text-muted-foreground hover:text-accent-foreground cursor-pointer hover:bg-accent/50', props.className)}>
            {props.children}
        </li>
    )
}