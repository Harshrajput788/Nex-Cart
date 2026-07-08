import { Link } from 'react-router-dom';
import React, { useState } from 'react'

interface props {
  _id: string;
  name: string;
  image: string;
  price: number;
  salePrice?: number;
  shortDescription?: string;
}

const ProductCard: React.FC<props> = (product) => {

  const [hovering, setHovering] = useState(false);

  return (
    <div
      className="relative w-56 bg-white rounded-2xl my-5 overflow-hidden border border-stone-100 transition-all duration-300 cursor-pointer group"
      style={{
        transform: hovering ? "translateY(-6px)" : "translateY(0)",
        boxShadow: hovering
          ? "0 20px 40px -10px rgba(0,0,0,0.12)"
          : "0 1px 3px rgba(0,0,0,0.05)",
      }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div className="relative h-56 bg-stone-50 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="px-3.5 pt-3 h-36 pb-4">
        <h3 className="text-[15px] text-stone-900 overflow-y-hidden leading-snug mb-2.5">
          {product.name}
        </h3>
        <p className="text-[10px] tracking-[0.08em] uppercase text-stone-400 mb-0.5 font-light">
          {product.shortDescription}
        </p>

        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-lg text-stone-900">₹{product.salePrice}</span>
          {product.price && (
            <span className="text-xs text-stone-400 line-through font-light">
              ₹{product.price}
            </span>
          )}
          {product.price && (
            <span className="text-[10px] text-emerald-600 font-medium ml-auto">
              {Math.round(((product.price - (product.salePrice ? product.salePrice : 0)) / product.price) * 100)}% off
            </span>
          )}
        </div>
      </div>
        <Link to={`/product/${product._id}`}><button
          onClick={(e) => { e.stopPropagation() }}
          className={`w-full h-10 rounded-lg bg-blue-500 cursor-pointer text-white text-[12px] font-medium transition-all duration-200 active:scale-[0.98]`}>
          View details</button></Link>
    </div>
  );
}

export default ProductCard;





