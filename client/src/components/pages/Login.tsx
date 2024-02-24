import { Navigate } from "react-router-dom";
import { serverBaseUrl, clientBaseUrl } from "@/lib/data";

export function Login(){
    return <Navigate to={`${serverBaseUrl}/auth/login?next=${clientBaseUrl}`} replace={true} />
}