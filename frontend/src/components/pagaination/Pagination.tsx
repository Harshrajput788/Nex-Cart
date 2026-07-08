import React from "react";

interface props {
  page?:number,
  totalPages?:number,
  onChange?:Function
}

const Pagination:React.FC<props> = ({ page, totalPages, onChange }: any) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex gap-2 items-center justify-center mt-6">
      {Array.from({ length: totalPages }).map((_, i) => (
        <button
          key={i}
          onClick={() => onChange(i + 1)}
          className={page === i + 1 ? "font-bold text-sm w-10 h-10 border rounded-xl border-gray-200 mx-2 cursor-pointer" : "border border-gray-200 rounded-xl w-10 h-10 cursor-pointer mx-2"}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
