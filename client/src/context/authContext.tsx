import {createContext, useContext} from 'react';

export interface AuthData {
    email: string | null,
    imageUrl: string | null,
}
export interface AuthInterface extends AuthData {
    setAuth: ((i: AuthData) => void) | null
}
export const AuthContext = createContext<AuthInterface>({email: null, imageUrl: null, setAuth: null});

export function useAuthContext(){
    let context = useContext(AuthContext);
    if(context.setAuth){
        return context;
    }
    throw new Error('SetAuth Must be present.')
}