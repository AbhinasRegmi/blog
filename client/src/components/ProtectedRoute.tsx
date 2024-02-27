import { useAuthContext } from "@/context/authContext";
import { NotAuthorized } from "./pages/NotAuthorized";

export function ProtectedRoute(props: {children: React.ReactNode, link?: string}){
    const auth = useAuthContext();
   
    if(auth.email === null){
        return (
            <NotAuthorized link={props.link} />
        )
    }
    
    return (
        props.children
    )
}