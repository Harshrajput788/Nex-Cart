import Logo from "../../components/logo/Logo"
import {useForm} from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { useAppDispatch,useAppSelector } from "../../context/hook/Index"
import { signupSchema, type SignupFormData } from "../../schema/auth.schema";
import { Input } from "../../components/Input/Input";
import { createUser } from "../../context/api/auth";

function Register() {

  const dispatch = useAppDispatch();
  const {isLoading} = useAppSelector(state => state.user)

  const {register,handleSubmit,formState:{errors}} = useForm<SignupFormData>({
    resolver:zodResolver(signupSchema)
  })

  const onSubmit = async (data:SignupFormData) => {
    dispatch(createUser(data)); 
  }

  return  (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="absolute top-10 cursor-pointer duration-500 hover:text-gray-500">
        <Logo size="3xl" />
      </div>
      <div className="w-full max-w-md border border-gray-300 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl text-center my-2 font-bold mb-4">Register</h2>
        <form onSubmit={handleSubmit(onSubmit)}> 
          <Input
          type="text"
          {...register("fullName")}
          label="FullName"
          error={errors.fullName?.message}
          />
          <Input 
          type="email"
          label="Email"
          {...register("email")}
          error={errors.email?.message}
          />
          <Input 
          type="password"
          label="Password"
          {...register("password")}
          error={errors.password?.message}
          />
          <Input
          type="tel"
          {...register("phone")}
          label="Phone"
          error={errors.phone?.message}
          />
          <button
          disabled={isLoading}
            type="submit"
            className="w-full cursor-pointer duration-500 hover:bg-blue-300 bg-blue-500 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {isLoading ? "Creating..." : "Register"}
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="text-blue-500 hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register