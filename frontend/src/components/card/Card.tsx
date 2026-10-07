import { Link } from "react-router-dom";
import React from "react";
import { FiArrowUpRight } from "react-icons/fi";

interface props {
  _id: string;
  name: string;
  image: string;
  price: number;
  salePrice?: number;
  shortDescription?: string;
}

const ProductCard: React.FC<props> = ({ _id, name, image, price, salePrice, shortDescription }) => {
  // Only treat it as a sale when salePrice is a real, lower number
  const onSale = !!salePrice && salePrice < price;
  const current = onSale ? salePrice : price;
  const discount = onSale ? Math.round(((price - salePrice!) / price) * 100) : 0;

  return (
    <Link
      to={`/product/${_id}`}
      className="group relative block w-full overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all duration-300 hover:-translate-y-1.5 hover:border-gray-200 hover:shadow-2xl hover:shadow-gray-900/10 focus-visible:ring-2 focus-visible:ring-blue-500"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img
          src={image}
          alt={name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />

        {onSale && (
          <span className="absolute left-3 top-3 rounded-full bg-emerald-500 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm">
            {discount}% off
          </span>
        )}

        {/* Slides up on hover (desktop); on touch the whole card is the link */}
        <span className="absolute inset-x-3 bottom-3 hidden translate-y-4 items-center justify-center gap-1.5 rounded-xl bg-gray-900/90 py-2.5 text-sm font-medium text-white opacity-0 backdrop-blur transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 md:flex">
          View details
          <FiArrowUpRight />
        </span>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="line-clamp-1 font-medium text-gray-900 transition-colors group-hover:text-blue-600">
          {name}
        </h3>
        {shortDescription && (
          <p className="mt-1 line-clamp-1 text-sm text-gray-500">{shortDescription}</p>
        )}
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-lg font-semibold text-gray-900">₹{current}</span>
          {onSale && <span className="text-sm text-gray-400 line-through">₹{price}</span>}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;