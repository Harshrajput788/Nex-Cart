import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import AdminDashboard from './dashboard/Dashboard';
import Navbar from './Navbar/Navbar';
import { Menu } from 'lucide-react';
import ProductPage from './Product/ProductPage';
import CategoriesPage from './category/Categories';
import { AddCategoryForm } from './category/AddCategory/AddCategory';
import ThumbnailManager from './thumbnails/Thumbnails';
import CustomersPage from './Customer/Customer';
import AdminSettings from './setting/Setting';
import AdminOrdersPage from './order/order';
import AdminOrderDetail from './order/OrderById';

function AdminRoutes() {

    const [sidebarOpen, setSideBarOpen] = useState(false);

    return (
        <div className='w-full flex'>
            <div className="lg:hidden bg-white absolute top-16">
                {
                    !sidebarOpen && <button
                        onClick={() => setSideBarOpen(!sidebarOpen)}
                        className="lg:hidden p-2 rounded hover:bg-gray-100"
                    >
                        <Menu size={24} />
                    </button>
                }
            </div>
            <div className={` ${sidebarOpen ? "flex" : "hidden"} lg:flex`}>
                <Navbar setSideBarOpen={setSideBarOpen} />
            </div>
            <div className='py-5 w-full'>
                <Routes>
                    <Route path='/dashboard' element={<AdminDashboard />} />
                    <Route path='/products' element={<ProductPage />} />
                    <Route path='/categories' element={<CategoriesPage />} />
                    <Route path='/categories/add-category' element={<AddCategoryForm />} />
                    <Route path='/thumbnails' element={<ThumbnailManager/>} />
                    <Route path='/customers' element={<CustomersPage/>} />
                    <Route path='/setting' element={<AdminSettings />} />
                    <Route path='/order' element={<AdminOrdersPage/>} />
                    <Route path='/order/:orderNumber' element={<AdminOrderDetail/>} />
                </Routes>
            </div>
        </div>
    )
}

export default AdminRoutes