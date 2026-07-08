import { LuShoppingBag } from "react-icons/lu";
import { Link } from "react-router-dom";

function Logo({ size = "lg", margin = "0" }) {
  return (
    <Link to={"/"}>
      <div className={`flex cursor-pointer items-center mx-${margin}  `}>
        <LuShoppingBag className={`text-${size}`} />
        <h1 className={`text-${size} font-semibold`}>NexCart</h1>
      </div>
    </Link>
  )
}

export default Logo