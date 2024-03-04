import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";
import { YouAreLoggedOut, cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { FaRegUser, FaRegBookmark } from "react-icons/fa";
import { RiArticleLine } from "react-icons/ri";
import { FaChartSimple } from "react-icons/fa6";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "@/context/authContext";
import { loginNavigation } from "@/lib/utils";
import { useLocalStorage } from "@/hooks/localStorage";


export function Profile() {

    const secondSection = [
        'Settings',
        'Refine recommendations',
        'Manage publications',
        'Help'
    ]

    const userData = useAuthContext();
    let { setStorageToken } = useLocalStorage();
    let { setAuth } = useAuthContext();
    const [sheetOpen, setSheetOpen] = useState<boolean>(false);

    return (
        <Sheet open={userData.email ? sheetOpen : false}
            onOpenChange={() => {
                userData.email && setSheetOpen(!sheetOpen);
            }}
        >
            <SheetTrigger onClick={() => {
                if (!userData.email) {
                    loginNavigation();
                }
            }}>
                <Avatar className="hover:shadow-sm">
                    <AvatarImage src={userData.imageUrl ?? undefined} />
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
                        <Link onClick={()=>setSheetOpen(p=>!p)} to={'/me/stories'} className="flex items-center gap-[0.75rem]">
                            <RiArticleLine className="text-xl" />
                            <p>Stories</p>
                        </Link>
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

                    <Link to={'/'} onClick={() => {
                        setStorageToken('');
                        if (setAuth) {
                            setAuth({ email: null, imageUrl: null });
                        }
                        setSheetOpen(!sheetOpen);
                        YouAreLoggedOut();
                    }}>
                        <ProfileItem>Sign out
                            <div className="text-sm tracking-wide">({userData.email ?? 'Please Log in'})</div>
                        </ProfileItem>
                    </Link>
                </ul>
            </SheetContent>
        </Sheet>

    )
}

function ProfileItem(props: { children: React.ReactNode, className?: string, disableTab?: boolean, onClick?: () => void }) {
    return (
        <li onClick={props.onClick} tabIndex={props.disableTab ? -1 : 0} className={cn('flex items-center gap-3 px-6 py-2 text-lg text-muted-foreground hover:text-accent-foreground cursor-pointer hover:bg-accent/50', props.className)}>
            {props.children}
        </li>
    )
}