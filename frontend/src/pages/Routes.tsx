import { Header, Footer } from '../components'
import Home from './home/Home'
import About from './about/About'
import User from './user/User'
import Shop from './shop/Shop'
import { Routes,Route } from 'react-router-dom'
import Protect from '../components/ProtectedRoute/Protect'
import SellerRoutes from './seller/SellerRoutes'
import RoleAccessForSeller from '../components/ProtectedRoute/RoleAccessForSeller'
import Contract from './contract/Contract'
import FAQPage from './FAQ/FAQ'
import ProductPage from './productPage/ProductPage'
import AdminRoutes from './admin/AdminRoutes'

function Body() {

    return (
        <div>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path='/product/:id' element={<ProductPage />} />
                <Route path='/shop' element={<Shop />} />
                <Route path='/contract' element={<Contract />} />
                <Route path='/user/*' element={
                    <Protect>
                        <User/>
                    </Protect>
                } />
                <Route path='/seller/*' element={<RoleAccessForSeller role={["SELLER"]}>
                    <SellerRoutes/>
                </RoleAccessForSeller>}/>
                <Route path='/admin/*' element={<RoleAccessForSeller role={["ADMIN"]}>
                    <AdminRoutes/>
                </RoleAccessForSeller>}/>
                <Route path='/faq' element={<FAQPage/>}/>
                <Route path='*' element={<div>Not Found</div>} />
            </Routes>
            <Footer />
        </div>
    )
}

export default Body