import {useState} from 'react';

export function useLocalStorage(){
    const [storageToken, setStorage] = useState<string | null>(get());

    function get(){
        let token = window.localStorage.getItem('token');
        
        return token;
    }

    const setStorageToken = (state: string) => {
        setStorage(state);
        window.localStorage.setItem('token', state)
    }

    return {storageToken, setStorageToken}
}

export function useLocalToken(){
    const token = window.localStorage.getItem('token');

    if(!token){
        throw new Error("Token Not Found in Local Storage.")
    }
    return token
}