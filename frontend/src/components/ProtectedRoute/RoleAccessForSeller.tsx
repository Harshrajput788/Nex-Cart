import React from "react";
import { useAppSelector } from "../../context/hook/Index";

interface Props {
    children: React.ReactNode
    role:string[],
}

const RoleAccessForSeller:React.FC<Props> = ({children,role}) =>{
    const {data} = useAppSelector(state => state.user);


    if(!role.includes(data?.role as string)){
            return <div className="w-full min-h-screen justify-center items-center flex">Unauthentication</div>
        } 

    return (
        children
    )
}

export default RoleAccessForSeller;