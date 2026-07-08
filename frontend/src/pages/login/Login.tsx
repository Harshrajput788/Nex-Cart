import Logo from "../../components/logo/Logo"
import {useForm} from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { signinSchema,type SigninFormData } from "../../schema/auth.schema"
import { loginUser } from "../../context/api/auth"
import { useAppDispatch,useAppSelector } from "../../context/hook/Index"
import { Input } from "../../components/Input/Input"

function Login() {
  const {handleSubmit,register,formState:{errors}} = useForm<SigninFormData>({
    resolver:zodResolver(signinSchema)
  })


  const {isLoading} = useAppSelector(state => state.user)

  const dispatch = useAppDispatch();



  const onSubmit = (data:SigninFormData) =>{
    dispatch(loginUser(data));
  }

  return (
    <div className='w-full h-screen flex justify-center items-center'>
      <div className="absolute top-10 cursor-pointer duration-500 hover:text-gray-500">
        <Logo size="3xl" />
      </div>
      <div className='w-full max-w-md border border-gray-300 p-6 bg-white rounded-lg shadow-md'>
        <h2 className='text-2xl font-bold mb-4 my-2 text-center'>Login</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
          type="email"
          label="Email"
          {...register("email")}
          error={errors.email?.message}
          />
          <div className='mb-4'>
            <Input
            type="password"
            label="Password"
            {...register("password")}
            error={errors.password?.message}
            />
            <div>
              <a href='/send-forgot-password-code' className='text-blue-500 hover:underline text-sm mt-2 block'>
                Forgot Password?
              </a>
            </div>
          </div>
          <button
            type='submit'
            disabled={isLoading}            
            className='w-full hover:bg-blue-300 cursor-pointer bg-blue-500 text-white py-2 px-4 rounded-md duration-500 focus:outline-none focus:ring-2 focus:ring-blue-500'
          >
            {isLoading ? "Login..." : "Login"}
          </button>
        </form>
        <div className='mt-4 text-center'>
          <p className='text-gray-600'>
            Don't have an account?{' '}
            <a href='/register' className='text-blue-500 hover:underline'>
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login