import { useState, useEffect } from "react";
import "./Section.css"
import type { Thumbnail } from "./interface";
import { useQuery } from "@tanstack/react-query";
import { getThumbanails } from "../../context/api/thumbnails";
import { useNavigate } from "react-router-dom";


function Section() {

  const [thumbnail, setThumbnail] = useState<Thumbnail>(); 

  const {data,isLoading,isError,error} = useQuery<Thumbnail[],Error>({
    queryKey:["thumbnails"],
    queryFn:getThumbanails,
  })

  const navigate = useNavigate();


  useEffect(() =>{
    if(data) setThumbnail(data[0]);
  },[data])

  if(isLoading){
    return <div className="w-full h-screen flex justify-center items-center">Loading...</div>
  }

  if(isError){
    return <div className="w-full h-screen flex items-center">{error.message}</div>
  }

  if(data?.length === 0){
    return <div className="w-full h-screen flex justify-center items-center">Not Thumnails</div>
  }


  return (
    <>
      <section className="relative md:mt-24 xl:mt-60 lg:mt-40 mt-16 bg-white overflow-hidden ">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                    w-70 h-75 rounded-full opacity-30 blur-3xl pointer-events-none
                    md:left-[60%] md:w-105 md:h-100
                    sm:w-125 sm:h-50"
          style={{
            background: "radial-gradient(ellipse, #22d3ee 0%, #3b82f6 40%, transparent 70%)",
          }}
        />

        <div
          className="
          relative z-10
          flex flex-col items-center text-center
          sm:flex-row sm:items-center sm:text-left
          min-h-85 sm:min-h-65 md:min-h-85
          px-6 sm:px-10 md:px-16 py-8 md:py-10
          gap-4 sm:gap-0
        "
        >

          <div className="flex flex-col items-center sm:items-start gap-4 sm:w-[38%] md:w-[30%] order-2 sm:order-1 container">
            <span
              className="bg-amber-500 text-gray-900 text-xs font-extrabold px-3 py-1 rounded-sm tracking-widest uppercase"
            >
              NEW
            </span>

            <h1
              className="
              font-black leading-none uppercase
              text-3xl sm:text-2xl md:text-4xl
            "
              style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "-0.5px" }}
            >
              {thumbnail?.heading} 
            </h1>

            <button
              onClick={() => navigate(`/shop?category=${thumbnail?.categoryId}&limit=20&page=1`)}
              className="
              bg-[#156ADA] w-32 h-10 hover:bg-blue-300 duration-500 active:scale-95
              text-white text-xs font-bold tracking-widest uppercase
              px-6 py-2.5 rounded-xl cursor-pointer
              transition-all shadow-md hover:shadow-blue-300
            "
            >
              Shop Now
            </button>
          </div>

          <div
            className="
            relative flex-1 flex items-center justify-center
            order-1 sm:order-2
            h-50 sm:h-55 md:h-100
          "
          >
             <img
              src={thumbnail?.url}
              className="image 
              relative z-10 drop-shadow-2xl
              w-55 sm:w-62 md:w-90
              h-fit
              hover:scale-105 transition-transform duration-500
            "
              style={{ filter: `drop-shadow(0 20px 40px ${thumbnail?.color})` }}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>

          <div
            className="
            hidden md:flex flex-col justify-center
            w-[28%] text-left text-gray-500 text-sm leading-relaxed
            order-3
          "
          >
            <p className="w-72 paragraph">
              {thumbnail?.paragraph}
            </p>
          </div>
        </div>
      </section>
      <div className="mt-16 mx-2 absolute sm:relative flex sm:justify-self-start justify-self-center">
        {
          data?.map(thumbnail1 => (
            <div className={`w-14 mx-2 duration-200 flex justify-center items-center ${thumbnail?._id === thumbnail1._id ? "border-blue-500 border-2" : "border-gray-300 border"} hover:border-blue-500 cursor-pointer rounded-xl h-14`} onClick={() => { setThumbnail(thumbnail1) }} key={thumbnail1._id}>
              <img className="w-12 h-12" src={thumbnail1.url} alt="" />
            </div>
          ))
        }
      </div>
    </>
  )
}

export default Section