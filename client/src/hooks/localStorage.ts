import {useState} from 'react';

export function useLocalStorage(){
    const [storageToken, setStorage] = useState<string>(get());

    function get(): string{
        let token = window.localStorage.getItem('token') ?? "";
        
        return token;
    }

    const setStorageToken = (state: string) => {
        setStorage(state);
        window.localStorage.setItem('token', state)
    }

    return {storageToken, setStorageToken}
}