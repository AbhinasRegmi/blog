import { loginNavigation } from "@/lib/utils";
import React, { useEffect } from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog"
import { Link } from "react-router-dom";


export function NotAuthorized(props: {link?: string}) {
    const [open, setOpen] = React.useState<boolean>(false);

    useEffect(() => {
        let timer = setTimeout(() => setOpen(true), 1000);

        () => clearTimeout(timer);
    })
    return (
        <div>
            <AlertDialog open={open}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>401 Not Authorized</AlertDialogTitle>
                        <AlertDialogDescription>
                            You should be logged in to view this page.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-4">
                        <Link to='/'><AlertDialogCancel>Go to home</AlertDialogCancel></Link>
                        <AlertDialogAction autoFocus onClick={() => loginNavigation(props.link)}>Log In Now</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}