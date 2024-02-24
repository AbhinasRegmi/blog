import { Outlet } from "react-router-dom";
import { NavBar } from "./components/NavBar";
import { Toaster } from "@/components/ui/sonner";
import { useSearchParams} from "react-router-dom";
import { useEffect } from "react";
import { useLocalStorage } from "./hooks/localStorage";


export function App() {
  const { setStorageToken } = useLocalStorage();
  let [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    let token = searchParams.get('token');
    if(token){
      setStorageToken(token);
      setSearchParams('');
    }
  }, [])

  return (
    <div>
      <NavBar />
      <Outlet />
      <Toaster />
    </div>
  )
}