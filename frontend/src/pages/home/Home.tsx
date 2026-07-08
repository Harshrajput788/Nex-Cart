import Section from "../../components/section/Section"
import { getCategoreis } from "../../context/api/category";
import { RiExchangeFill } from "react-icons/ri";
import type { ICategory } from "../../Types/category";
import { FaCheckCircle, FaHeadphones } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import type { IProduct } from "../../Types/prodcuts";
import axios from "axios";
import type { ApiResponse } from "../../Types/Respone";
import ProductCardSkeleton from "../../components/productCardLoding/ProductsCardLoading";
import ProductCard from "../../components/card/Card";
import { backendUrl } from "../../context/api/url";

const Home: React.FC = () => {

  const fetchProducts = async (): Promise<IProduct[]> => {
    const res = await axios.get<ApiResponse<IProduct[]>>(backendUrl+"/api/v1/product/all?limit=10");
    return res.data.data;
  }

  const categoires = useQuery<ICategory[], Error>({
    queryKey: ["Categories"],
    queryFn: getCategoreis,
  })

  const products = useQuery<IProduct[], Error>({
    queryKey: ["HomeProduct"],
    queryFn: fetchProducts,
  })


  return (
    <>
      <Section />
      <div className="w-full flex flex-col mt-28 items-center justify-center p-4">
        <h2 className="text-2xl lg:text-4xl font-bold mb-4">Welcome to Our Store</h2>
        <p className="text-gray-600  text-center">
          Discover our latest collection and find the perfect items for you.
        </p>
        <div className="w-full grid sm:grid-cols-2 mg:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 px-10 my-10">
          {
            products.isLoading ? (
                Array.from({ length: 10 }).map((_, index) => (
                  <ProductCardSkeleton key={index} />
                ))
            ) :
              products.data?.map(product => (
                <ProductCard key={product._id} _id={product._id} name={product.name} image={product.images[0].url} price={product.price} 
                shortDescription={product.shortDescription} salePrice={product.salePrice}
                />
              ))
          }
        </div>
      </div>

      <div className="w-full flex flex-col my-10 items-center justify-center p-4">
        <h1 className="font-bold text-2xl lg:text-4xl">We have Multiple Categories</h1>
        <p className="my-5">Their are some catgoires for you</p>

        <div className="w-full justify-center flex flex-wrap px-10 my-10">
          {
            categoires.data?.map(category => (
              <div className="w-48 p-4 border cursor-pointer hover:scale-105 duration-200 transition-transform border-gray-300 m-5" key={category._id}>
                <h1 className="font-semibold">{category.name}</h1>
                <p>{category.description}</p>
              </div>
            ))
          }
        </div>

      </div>

      <div className="w-full flex flex-col my-10 items-center justify-center p-4">
        <h1 className="font-bold text-xl lg:text-4xl">OUR POLICY</h1>
        <p className="my-5">These are Our Campany Pocliy </p>

        <div className="w-full justify-center flex flex-wrap px-10 my-10">
          <div className="w-52 flex flex-col mx-5 my-4 items-center">
            <RiExchangeFill className="text-5xl my-2" />
            <h1 className="text-center my-1">Easy Exchange Pocliy</h1>
            <p className="text-gray-500 text-sm text-center" >We offer hassle free exchange Pocliy</p>
          </div>
          <div className="w-52 flex flex-col mx-5 my-4 items-center">
            <FaCheckCircle className="text-5xl my-2" />
            <h1 className="text-center my-1">7 Days return policy</h1>
            <p className="text-gray-500 text-sm text-center" >We provide 7 days free return Pocliy</p>
          </div>
          <div className="w-52 flex flex-col mx-5 my-4 items-center">
            <FaHeadphones className="text-5xl my-2" />
            <h1 className="text-center my-1">Best Costumer Support</h1>
            <p className="text-gray-500 text-sm text-center" >We provide 24/7 customer support</p>
          </div>
        </div>

      </div>
    </>
  )
}

export default Home;