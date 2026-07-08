import { FiShoppingCart } from "react-icons/fi";
import { LuUser } from "react-icons/lu";
import { HiMiniBars3BottomLeft } from "react-icons/hi2";
import Logo from "../logo/Logo";
import { RxCross2 } from "react-icons/rx";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../context/hook/Index";
import { logout } from "../../context/api/auth";
import { useGetCart } from "../../context/api/cart";

function Header() {
  const [bar, setBar] = useState(false);

  const dispatch = useAppDispatch();


  const [userBar, setUserBar] = useState<string>("hidden");

  const { token, data } = useAppSelector(state => state.user);

  const { data: userCartData,isLoading } = useGetCart(data?._id as string);


  const handleChangeUserBar = () => {
    if (userBar === "hidden") {
      setUserBar("block");
    } else {
      setUserBar("hidden");
    }
  }


  return (
    <>
      <header className="w-full h-16 justify-between flex items-center p-4">
        <div className="md:flex w-1/2 lg:w-1/3 hidden cursor-pointer hover:text-gray-600 duration-500 items-center gap-4">
          <Logo size="3xl" margin="10" />
        </div>
        <div className="md:hidden block items-center gap-4">
          <Logo />
        </div>

        <div className="hidden list-none text-sm justify-between w-1/3 h-full lg:flex">
          <li className="cursor-pointer hover:text-gray-300 duration-500"><NavLink to={"/"} className={({ isActive }) => `block ${isActive ? "text-blue-500" : "text-black"}`} >Home</NavLink></li>
          <li className="cursor-pointer hover:text-gray-300 duration-500"><NavLink to={"/shop"} className={({ isActive }) => `block ${isActive ? 'text-blue-500' : "text-black"}`}>Shop</NavLink> </li>
          {
            data?.role === "SELLER" && <li onClick={() => setBar(false)} className="cursor-pointer hover:text-gray-300 duration-500"><NavLink to={"/seller/dashboard"} className={({ isActive }) => `block ${isActive ? 'text-blue-500' : "text-black"}`}>Dashboard</NavLink> </li>
          }
          {
            data?.role === "ADMIN" && <li onClick={() => setBar(false)} className="cursor-pointer hover:text-gray-300 duration-500"><NavLink to={"/admin/dashboard"} className={({ isActive }) => `block ${isActive ? 'text-blue-500' : "text-black"}`}>Admin</NavLink> </li>
          }
          <li className="cursor-pointer hover:text-gray-300 duration-500"><NavLink to={"/about"} className={({ isActive }) => `block ${isActive ? 'text-blue-500' : "text-black"}`}>About</NavLink> </li>
          <li className="cursor-pointer hover:text-gray-300 duration-500"><NavLink to={"/contract"} className={({ isActive }) => `block ${isActive ? 'text-blue-500' : "text-black"}`}>Contract us</NavLink> </li>
        </div>

        {!token ? (
          <div className="flex w-1/2 lg:w-1/3 justify-end  ">
            <Link to={"/login"} className="sm:mx-5 justify-self-start">
              <button className="w-24 text-white h-9 bg-blue-500 rounded-xs cursor-pointer hover:bg-blue-300 duration-200">Login</button>
            </Link>
            <HiMiniBars3BottomLeft onClick={() => setBar(true)} className="  text-lg lg:hidden flex md:text-2xl cursor-pointer hover:text-gray-600 duration-500 " />
          </div>
        ) : (
          <>
            <div className="flex w-1/2 lg:w-1/3 justify-end ">
              <div className="flex w-full md:justify-between md:w-1/3 justify-end md:mx-10">
                <Link to={"/user/cart"}>
                  {
                    data?.role !== "ADMIN" && <>
                      <FiShoppingCart className=" text-lg mx-2 md:text-2xl cursor-pointer hover:text-gray-600 duration-500" />{
                        !isLoading && <div className="absolute top-2 w-5 bg-blue-400 text-white ml-6 text-[10px] h-5 items-center justify-center rounded-4xl flex">{userCartData?.totalItems}</div>
                      }
                    </>
                  }
                </Link>
                <div>
                  <LuUser onClick={handleChangeUserBar} className=" text-lg md:text-2xl mx-2 cursor-pointer  hover:text-gray-600 duration-500" />

                  <div className={`w-48 h-auto absolute z-20 xl:right-20  2xl:right-40 top-16 right-2 bg-white shadow-md flex flex-col px-6 ${userBar}`}>
                    <Link onClick={handleChangeUserBar} to={"/user/"} className="w-full text-center py-2 hover:bg-gray-200 duration-500">Profile</Link>
                    {
                      data?.role !== "ADMIN" && <Link onClick={handleChangeUserBar} to={"/user/order"} className="w-full text-center py-2 hover:bg-gray-200 duration-500">Orders</Link>

                    }
                    {
                      !data?.isVerified && <Link onClick={handleChangeUserBar} to={"/verify-email"} className="w-full text-center py-2 hover:bg-gray-200 duration-500">Verify Account</Link>
                    }
                    <button onClick={() => { dispatch(logout()), handleChangeUserBar }} className="w-full  text-center py-2 hover:bg-gray-200 duration-500">Logout</button>
                  </div>
                </div>
                <HiMiniBars3BottomLeft onClick={() => setBar(true)} className="  text-lg lg:hidden flex md:text-2xl cursor-pointer hover:text-gray-600 duration-500 " />
              </div>
            </div>
          </>
        )}

      </header>
      <RxCross2 onClick={() => setBar(false)} className={`text-2xl lg:hidden absolute top-8  right-6 cursor-pointer z-30 ${bar ? "block" : "hidden"}`} />
      <nav className={`w-full lg:hidden h-screen z-20 fixed top-0 bg-white shadow-md flex flex-col items-center px-6 ${bar ? "block" :"hidden"}`}>
        <div className="text-xl flex-row font-bold h-1/2 py-10">
          <Logo />
        </div>
        <ul className="flex justify-center flex-col items-center gap-6">
          <li onClick={() => setBar(false)} className="cursor-pointer hover:text-gray-300 duration-500"><NavLink to={"/"} className={({ isActive }) => `block ${isActive ? "text-blue-500" : "text-black"}`} >Home</NavLink></li>
          <li onClick={() => setBar(false)} className="cursor-pointer hover:text-gray-300 duration-500"><NavLink to={"/shop"} className={({ isActive }) => `block ${isActive ? 'text-blue-500' : "text-black"}`}>Shop</NavLink> </li>
          {
            data?.role === "SELLER" && <li onClick={() => setBar(false)} className="cursor-pointer hover:text-gray-300 duration-500"><NavLink to={"/seller/dashboard"} className={({ isActive }) => `block ${isActive ? 'text-blue-500' : "text-black"}`}>Dashboard</NavLink> </li>
          }
          {
            data?.role === "ADMIN" && <li onClick={() => setBar(false)} className="cursor-pointer hover:text-gray-300 duration-500"><NavLink to={"/admin/dashboard"} className={({ isActive }) => `block ${isActive ? 'text-blue-500' : "text-black"}`}>Admin</NavLink> </li>
          }
          <li onClick={() => setBar(false)} className="cursor-pointer hover:text-gray-300 duration-500"><NavLink to={"/about"} className={({ isActive }) => `block ${isActive ? 'text-blue-500' : "text-black"}`}>About</NavLink> </li>
          <li onClick={() => setBar(false)} className="cursor-pointer hover:text-gray-300 duration-500"><NavLink to={"/contract"} className={({ isActive }) => `block ${isActive ? 'text-blue-500' : "text-black"}`}>Contract us</NavLink> </li>
        </ul>
      </nav>
    </>
  )
}

export default Header