import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { NavBar } from "./components/NavBar";
import { Toaster as Sooner } from "@/components/ui/sonner";
import {Toaster} from "@/components/ui/toaster"
import { useSearchParams } from "react-router-dom";
import { AuthContext } from '@/context/authContext';
import { useLocalStorage } from "@/hooks/localStorage";
import { getUserData } from "@/api/login";
import { AuthData } from "@/context/authContext";
import { SessionExpired } from "./lib/utils";


export function App() {
  const [auth, setAuth] = useState<AuthData>({ email: null, token: null, imageUrl: null });
  const { storageToken, setStorageToken } = useLocalStorage();
  let [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    let token = searchParams.get('token');
    if (token) {
      setStorageToken(token);
      setSearchParams('');

      getUserData(token)
        .then((data) => {
          let userData = data.data as AuthData;
          console.log(userData);
          setAuth({ email: userData.email, token: userData.token, imageUrl: userData.imageUrl });
        })
        .catch(() => {
          SessionExpired();
          setStorageToken('');
          setAuth({ email: null, token: null, imageUrl: null });
        })

    } else if (storageToken) {
      getUserData(storageToken)
        .then((data) => {
          let userData = data.data as AuthData;
          setAuth({ email: userData.email, token: userData.token, imageUrl: userData.imageUrl });
        })
        .catch(() => {
          SessionExpired();
          setStorageToken('');
          setAuth({ email: null, token: null, imageUrl: null });
        })
    } else {
      setAuth({ email: null, token: null, imageUrl: null });
    }

  }, [])

  return (
    <AuthContext.Provider value={{ ...auth, setAuth: setAuth }}>
      <div>
        <NavBar />
        <Outlet />
        <Toaster />
        <Sooner />
      </div>
    </AuthContext.Provider>
  )
}