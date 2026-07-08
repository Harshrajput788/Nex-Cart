import { Routes,Route } from "react-router-dom";
import Dashboard from "./dashboarde/Dashboard";
import Navbar from "./navbar/Navbar";
import { useState } from "react";
import { X,Menu } from "lucide-react";
import Product from "./product/Product";
import Order from "./order/Order";
import SellerSettings from "./setting/Setting";
import AddProduct from "./product/addProduct/AddProduct";
import UpdateProducts from "./product/upateProduct/UpdateProducts";
import AddProductVarient from "./product/addVarient/AddProductVarient";
import ProductPage from "./product/ProductPage";
import SellerOrderById from "./order/OrderPage";


const SellerRoutes : React.FC = () =>{

    const [sidebarOpen,setSidebarOpen] = useState(false);

    return (
        <div className="w-full flex">
            <div className="lg:hidden bg-white absolute top-16">
                {
                    !sidebarOpen ? <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="lg:hidden p-2 rounded hover:bg-gray-100"
                    >
                        <Menu size={24}/>
                    </button> : <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="lg:hiddena fixed top-8 right-5 p-2 rounded z-100 hover:bg-gray-100"
                    >
                        <X size={24}/>
                    </button> 
                }
            </div>
            <div className={` ${sidebarOpen ? "flex" : "hidden"} lg:flex`}>
                <Navbar/>
            </div>
            <Routes>
                <Route path="/dashboard" element={<Dashboard/>} />
                <Route path="/product" element={<Product/>} />
                <Route path="/order" element={<Order/>} />
                <Route path="/order/:id" element={<SellerOrderById/>} />
                <Route path="/product/add-product" element={<AddProduct/>}/>
                <Route path="/product/update-product/:productId" element={<UpdateProducts/>} />
                <Route path="/setting" element={<SellerSettings/>} />
                <Route path="/product/:productId" element={<ProductPage/>} />
                <Route path="/product/add-product-variant/:productId" element={<AddProductVarient/>} />
            </Routes>   
        </div>
    )
}

export default SellerRoutes