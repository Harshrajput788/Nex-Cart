import React from "react";
import { useAppSelector } from "../../context/hook/Index";
import { Navigate } from "react-router-dom";

interface IProtect {
    children: React.ReactNode
}

const Protect: React.FC<IProtect> = ({ children }) => {

    const { token } = useAppSelector(state => state.user);

    if (!token) {
        return <Navigate to={"/login"} />
    }


    return (
        children
    )
}

export default Protect;