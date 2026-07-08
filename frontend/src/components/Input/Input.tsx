interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  type:string;
  value?:string;
}

export const Input = ({type,label,value,error, ...props }: InputProps) => {
  return (
    <div className="flex flex-col mb-4 ,m m gap-1">
      <label className="text-sm font-mediumblock text-gray-700 font-medium mb-2">{label}</label>
      <input
      type={type}
        {...props}
        onChange={(e) =>{e.target.value != value ? "" : null}}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500
          ${error ? "border-red-500 focus:ring-red-300" : "border-gray-300 focus:ring-blue-300"}`}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
};