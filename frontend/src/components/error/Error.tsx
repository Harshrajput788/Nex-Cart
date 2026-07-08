import { LuServerOff } from "react-icons/lu";
import Logo from "../logo/Logo";

function Error() {
    return (
        <div className='w-full h-screen flex justify-center items-center text-3xl font-bold'>
            <div className="absolute top-20 hover:text-gray-500 cursor-pointer duration-200">
                <Logo size="3xl" />
            </div>
            <div className="flex flex-col justify-center items-center">
                <LuServerOff className="text-6xl my-5"/>
                <p className="text-4xl">500 Server Error!</p>
            </div>
        </div>
    )
}

export default Error