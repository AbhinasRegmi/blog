import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

import { FaExternalLinkAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

export function StoryNotFound() {
    return (
        <div className="pt-[15rem] w-full text-4xl select-none flex justify-center items-center gap-3">
            <div>
                Story Not Found.
            </div>
            <div className="text-sm">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger className="hover:bg-slate-300/40 p-3 rounded-full"><Link to={'/'}><FaExternalLinkAlt /></Link></TooltipTrigger>
                        <TooltipContent>
                            <p>Go to back to Home</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </div>
    )
}