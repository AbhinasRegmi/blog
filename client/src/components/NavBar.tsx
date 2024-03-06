import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { FaRegEdit, FaRegBell, FaSearch } from "react-icons/fa";
import { Profile } from "@/components/Profile";
import { useAuthContext } from "@/context/authContext";
import { loginNavigation } from "@/lib/utils";


export function NavBar() {
    let auth = useAuthContext();
    return (
        <div className={'sticky top-0 left-0 backdrop-blur-sm bg-white/50 shadow-sm border-b flex justify-between w-screen'}>
            <ul className={'px-2 lg:px-6 flex justify-between w-full pt-2 md:pt-0'}>
                <li className="flex items-center gap-8">
                    <div className="pb-4">
                        <Link to={'/'}>
                            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                                myBlog
                            </h1>
                        </Link>
                    </div>
                    <div className="hidden lg:block">
                        {/* On Enter Press Redirect to Search Pages. */}
                        <Input type="text" placeholder="Search" />
                    </div>
                </li>
                <li className="flex items-center gap-3 lg:gap-6">
                    <Link onClick={(e) => {
                        if (!auth.email) {
                            e.preventDefault();
                            loginNavigation('/new-story');
                        }
                    }} to={'/new-story'} className="hidden lg:block">
                        <div className="flex items-center gap-1 text-muted-foreground hover:text-accent-foreground cursor-pointer p-2 hover:bg-accent/50 rounded-md">
                            <FaRegEdit />
                            <p className="text-sm">
                                Write
                            </p>
                        </div>
                    </Link>

                    <Link to={'search'} className="lg:hidden">
                        <div className="text-muted-foreground text-lg self-center">
                            <FaSearch />
                        </div>
                    </Link>

                    <Link onClick={(e) => {
                        if (!auth.email) {
                            e.preventDefault();
                            loginNavigation('/me/notifications');
                        }
                    }} to={'/me/notifications'}>
                        <div className="items-center text-xl text-muted-foreground hover:text-accent-foreground hover:bg-accent/50 p-2 rounded-full">
                            <FaRegBell />
                        </div>
                    </Link>
                    <Profile />
                </li>
            </ul>
        </div>
    )
}