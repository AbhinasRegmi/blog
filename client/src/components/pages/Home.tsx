import { View } from "../View";

export function Home(){
    return (
        <div className="flex divide-x gap-1">
            <div className="w-full px-4 lg:px-16">
                <View />
            </div>
            <div className="w-1/2 sticky right-0 top-20 bottom-0 h-[600px] hidden lg:block">
                
            </div>
        </div>
    )
}