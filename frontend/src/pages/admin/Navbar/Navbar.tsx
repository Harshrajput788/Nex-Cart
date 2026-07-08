import { X } from 'lucide-react'
import { NavLink } from 'react-router-dom'

interface props {
    setSideBarOpen: (value: boolean) => void
}

const Navbar: React.FC<props> = ({ setSideBarOpen }) => {
    return (
        <div
            className=" translate-x-0'
                 fixed inset-y-0 left-0 ease-in-out z-50 w-full lg:w-64  border bg-white bar border-gray-300 rounded-xl text-gray-700 transition-transform duration-300 md:translate-x-0 lg:static"
        >
            <X onClick={() => setSideBarOpen(false)} className='absolute top-12 right-5 lg:hidden' size={20} />
            <div className="p-6 font-bold text-xl border-b border-gray-700">Seller </div>
            <nav className="mt-6 space-y-2 px-4">
                <NavLink to="/admin/dashboard" className={({ isActive }) => `block px-4 py-2 rounded ${isActive ? "bg-blue-500 text-white" : ""} hover:bg-blue-400 hover:text-white duration-500`}>Dashboard</NavLink>
                <NavLink to="/admin/products" className={({ isActive }) => `block px-4 py-2 rounded ${isActive ? "bg-blue-500 text-white" : ""} hover:bg-blue-400 hover:text-white duration-500`}>Products</NavLink>
                <NavLink to="/admin/categories" className={({ isActive }) => `block px-4 py-2 rounded ${isActive ? "bg-blue-500 text-white" : ""} hover:bg-blue-400 hover:text-white duration-500`}>Categoires</NavLink>
                <NavLink to="/admin/thumbnails" className={({ isActive }) => `block px-4 py-2 rounded ${isActive ? "bg-blue-500 text-white" : ""} hover:bg-blue-400 hover:text-white duration-500`}>Thumbnails</NavLink>
                <NavLink to="/admin/order" className={({ isActive }) => `block px-4 py-2 rounded ${isActive ? "bg-blue-500 text-white" : ""} hover:bg-blue-400 hover:text-white duration-500`}>Orders</NavLink>
                <NavLink to="/admin/customers" className={({ isActive }) => `block px-4 py-2 rounded ${isActive ? "bg-blue-500 text-white" : ""} hover:bg-blue-400 hover:text-white duration-500`}>Customers</NavLink>
                <NavLink to="/admin/setting" className={({ isActive }) => `block px-4 py-2 rounded ${isActive ? "bg-blue-500 text-white" : ""} hover:bg-blue-400 hover:text-white duration-500`}>Settings</NavLink>
            </nav>
        </div>
    )
}

export default Navbar