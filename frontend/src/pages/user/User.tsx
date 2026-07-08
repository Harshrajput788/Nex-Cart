import { Route, Routes } from 'react-router-dom'
import Cart from './cart/Cart'
import Profile from './profile/Profile'
import ChangePassword from './changePassword/ChangePassword'
import Order from '../order/Order'
import CreateOrderPage from '../order/CreateOrder'
import { useAppSelector } from '../../context/hook/Index'
import ViewOrder from '../order/ViewOrder'

function User() {

  const { isOrder } = useAppSelector(state => state.order);

  return (
    <div>
      <Routes>
        <Route path='/' element={<Profile />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/change-password' element={<ChangePassword />} />
        <Route path='/order' element={<Order />} />
        <Route path='/order/:orderId' element={<ViewOrder />} />
        {isOrder && <Route path='/order-create' element={<CreateOrderPage />} />
        }
        <Route path='*' element={<div>Not Found</div>} />
      </Routes>
    </div>
  )
}

export default User