// Jay shree ganeshay namah;
import { Routes, Route } from "react-router-dom"
import Body from "./pages/Routes"
import { ForgetPassword, Login, Register, SendForgetPasswordCode, VerifictionEmail } from "./pages"
import { ToastContainer } from 'react-toastify'
import Protect from "./components/ProtectedRoute/Protect"
import TokenProtect from "./components/ProtectedRoute/tokenProtect"
import { useAppDispatch } from "./context/hook/Index"
import { useEffect, useState } from "react"
import ScrollToTheTop from "./components/scroll/ScrollToTheTop"
import { getProfile } from "./context/api/auth"

function App() {

  const dispatch = useAppDispatch();

  const [loading,setLoading] = useState(true);

  useEffect(() => {
    dispatch(getProfile()).finally(() => setLoading(false));
  }, []);

  if(loading) return <div className="w-full min-h-screen justify-center items-center flex">Loading...</div>


  return (
    <div>
      <ScrollToTheTop />
      <ToastContainer />
      <Routes>
        <Route path="/*" element={<Body />} />
        <Route path="/login" element={
          <TokenProtect>
            <Login />
          </TokenProtect>
        } />
        <Route path="/register" element={
          <TokenProtect>
            <Register />
          </TokenProtect>
        } />
        <Route path="/verify-email" element={
          <Protect>
            <VerifictionEmail />
          </Protect>
        } />
        <Route path="/send-forgot-password-code" element={
          <TokenProtect>
            <SendForgetPasswordCode />
          </TokenProtect>
        } />
        <Route path="/forgot-password" element={
          <TokenProtect>
            <ForgetPassword />
          </TokenProtect>
        } />
      </Routes>
    </div>

  )
}
export default App
