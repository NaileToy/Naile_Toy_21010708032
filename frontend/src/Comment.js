import { MdOutlineCancel } from "react-icons/md";
export default function Comment({text, user}) {
    return (
        <div className="sm:flex">
            <div className="mb-4 flex-shrink-0 sm:mb-0 sm:mr-2">
                <img
                    className="h-10 w-10 rounded-full object-cover"
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60"
                />
            </div>
            <div className="w-full">
                <div className="flex flex-row justify-between  items-center">
                    <h4 className="text-sm font-bold">{user}</h4>
                    <button>
                        <MdOutlineCancel className="text-md"/>
                    </button>
                </div>
                <p className="mt-0.5 text-xs">
                    {text}
                </p>
            </div>
        </div>
    );
}
