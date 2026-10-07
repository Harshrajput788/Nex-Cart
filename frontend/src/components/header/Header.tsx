import { FiShoppingCart } from "react-icons/fi";
import { LuUser } from "react-icons/lu";
import { HiMiniBars3BottomLeft } from "react-icons/hi2";
import { RxCross2 } from "react-icons/rx";
import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import Logo from "../logo/Logo";
import { useAppDispatch, useAppSelector } from "../../context/hook/Index";
import { logout } from "../../context/api/auth";
import { useGetCart } from "../../context/api/cart";

function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const dispatch = useAppDispatch();
  const { token, data } = useAppSelector((state) => state.user);
  const { data: userCartData, isLoading } = useGetCart(data?._id as string);

  // Build the nav once, so desktop and mobile always match
  const links = [
    { to: "/", label: "Home" },
    { to: "/shop", label: "Shop" },
    ...(data?.role === "SELLER" ? [{ to: "/seller/dashboard", label: "Dashboard" }] : []),
    ...(data?.role === "ADMIN" ? [{ to: "/admin/dashboard", label: "Admin" }] : []),
    { to: "/about", label: "About" },
    { to: "/contract", label: "Contact us" },
  ];

  // Add a soft shadow once the page scrolls
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the user menu when clicking outside
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // Lock page scroll while the mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const menuItem =
    "block w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors";

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full border-b transition-all duration-300 ${
          scrolled
            ? "bg-white/80 backdrop-blur-xl border-gray-200 shadow-sm"
            : "bg-white border-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
          {/* Logo */}
          <Link to="/" className="flex items-center transition-opacity hover:opacity-70">
            <Logo />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-9 lg:flex">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `group relative py-1 text-sm font-medium transition-colors ${
                    isActive ? "text-blue-600" : "text-gray-800 hover:text-blue-600"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {l.label}
                    <span
                      className={`absolute -bottom-0.5 left-0 h-0.5 w-full origin-left bg-blue-600 transition-transform duration-300 ${
                        isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                      }`}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {!token ? (
              <Link
                to="/login"
                className="rounded-full bg-gray-900 px-5 py-2 text-sm font-medium text-white transition-all duration-300 hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/25"
              >
                Log in
              </Link>
            ) : (
              <>
                {data?.role !== "ADMIN" && (
                  <Link
                    to="/user/cart"
                    aria-label="Cart"
                    className="relative rounded-full p-2.5 text-gray-800 transition-colors hover:bg-gray-100"
                  >
                    <FiShoppingCart className="text-xl" />
                    {!isLoading && !!userCartData?.totalItems && (
                      <span
                        key={userCartData.totalItems}
                        className="absolute right-0 top-0 flex h-5 min-w-5 animate-bounce items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-semibold text-white [animation-iteration-count:2]"
                      >
                        {userCartData.totalItems}
                      </span>
                    )}
                  </Link>
                )}

                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setMenuOpen((v) => !v)}
                    aria-label="Account menu"
                    aria-expanded={menuOpen}
                    className="rounded-full p-2.5 text-gray-800 transition-colors hover:bg-gray-100"
                  >
                    <LuUser className="text-xl" />
                  </button>

                  <div
                    className={`absolute right-0 top-full mt-2 w-52 origin-top-right overflow-hidden rounded-xl border border-gray-100 bg-white py-1.5 shadow-xl transition-all duration-200 ${
                      menuOpen
                        ? "visible scale-100 opacity-100"
                        : "invisible scale-95 opacity-0"
                    }`}
                  >
                    <Link onClick={() => setMenuOpen(false)} to="/user/" className={menuItem}>
                      Profile
                    </Link>
                    {data?.role !== "ADMIN" && (
                      <Link onClick={() => setMenuOpen(false)} to="/user/order" className={menuItem}>
                        Orders
                      </Link>
                    )}
                    {!data?.isVerified && (
                      <Link onClick={() => setMenuOpen(false)} to="/verify-email" className={menuItem}>
                        Verify account
                      </Link>
                    )}
                    <div className="my-1 border-t border-gray-100" />
                    <button
                      onClick={() => {
                        dispatch(logout());
                        setMenuOpen(false);
                      }}
                      className={`${menuItem} text-red-500 hover:text-red-600`}
                    >
                      Log out
                    </button>
                  </div>
                </div>
              </>
            )}

            <button
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
              className="rounded-full p-2.5 text-gray-800 transition-colors hover:bg-gray-100 lg:hidden"
            >
              <HiMiniBars3BottomLeft className="text-2xl" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer: overlay + sliding panel */}
      <div
        onClick={() => setDrawerOpen(false)}
        className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          drawerOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-72 max-w-[85%] flex-col bg-white p-6 shadow-2xl transition-transform duration-300 ease-out lg:hidden ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <Logo />
          <button
            onClick={() => setDrawerOpen(false)}
            aria-label="Close menu"
            className="rounded-full p-2 transition-colors hover:bg-gray-100"
          >
            <RxCross2 className="text-2xl" />
          </button>
        </div>

        <ul className="mt-10 flex flex-col gap-1">
          {links.map((l, i) => (
            <li
              key={l.to}
              style={{ transitionDelay: drawerOpen ? `${120 + i * 50}ms` : "0ms" }}
              className={`transition-all duration-300 ${
                drawerOpen ? "translate-x-0 opacity-100" : "translate-x-6 opacity-0"
              }`}
            >
              <NavLink
                to={l.to}
                onClick={() => setDrawerOpen(false)}
                className={({ isActive }) =>
                  `block rounded-lg px-4 py-3 text-lg font-medium transition-colors ${
                    isActive ? "bg-blue-50 text-blue-600" : "text-gray-800 hover:bg-gray-50"
                  }`
                }
              >
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
}

export default Header;