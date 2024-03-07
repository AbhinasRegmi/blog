import { View } from "../View";

export function Home(){
    return (
        <div className="w-full flex divide-x relative -z-0">
            <div className="p-4 w-4/6 pr-12 pl-24">
                <View />
            </div>
            <div className="w-2/6 p-4 shrink-0 fixed bottom-0 right-0 top-16">
                Sidebar will be later updated.
            </div>

        </div>
    )
}