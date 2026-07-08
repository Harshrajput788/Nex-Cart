import {  NavLink } from 'react-router-dom'
import './navbar.css'

function Navbar() {
    return (
        <div
            className=" translate-x-0'
                 fixed inset-y-0 left-0 ease-in-out z-50 w-full lg:w-64  border bg-white bar border-gray-300 rounded-xl text-gray-700 transition-transform duration-300 md:translate-x-0 lg:static"
        >
            <div className="p-6 font-bold text-xl border-b border-gray-700">Seller </div>
            <nav className="mt-6 space-y-2 px-4">
                <NavLink to="/seller/dashboard" className={({isActive})=>`block px-4 py-2 rounded ${isActive ? "bg-blue-500 text-white" : ""} hover:bg-blue-400 hover:text-white duration-500`}>Dashboard</NavLink>
                <NavLink to="/seller/product" className={({isActive})=>`block px-4 py-2 rounded ${isActive ? "bg-blue-500 text-white" : ""} hover:bg-blue-400 hover:text-white duration-500`}>Products</NavLink>
                <NavLink to="/seller/order" className={({isActive})=>`block px-4 py-2 rounded ${isActive ? "bg-blue-500 text-white" : ""} hover:bg-blue-400 hover:text-white duration-500`}>Orders</NavLink>
                <NavLink to="/seller/setting" className={({isActive})=>`block px-4 py-2 rounded ${isActive ? "bg-blue-500 text-white" : ""} hover:bg-blue-400 hover:text-white duration-500`}>Settings</NavLink>
            </nav>
        </div>
    )
}

export default Navbar