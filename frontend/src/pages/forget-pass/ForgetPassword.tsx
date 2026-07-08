import { useEffect } from "react";
import Logo from "../../components/logo/Logo";
import {useForm} from 'react-hook-form'
import { forgotPassword } from "../../context/api/forgetPassword";
import { useAppDispatch, useAppSelector } from "../../context/hook/Index";
import{resetPasswordSchema,type ResetPasswordInput } from "../../schema/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../../components/Input/Input";
import { useNavigate } from "react-router-dom";

function ForgetPassword() {

  const dispatch = useAppDispatch();

  const {isLoading,email,success,isError} = useAppSelector(state => state.forget)

  const {register,handleSubmit,formState:{errors}} = useForm<ResetPasswordInput>({resolver:zodResolver(resetPasswordSchema)});

  const navigate = useNavigate();

  useEffect(() =>{
    if(success) navigate("/login")
  },[success,navigate])

  useEffect(() =>{
    if(!email) navigate("/send-Forgot-password-code")
  },[email,navigate])

  useEffect(()=>{
    setTimeout(() => {
      console.log("Resend again")
    }, 4000);
  },[])

  console.log(isError)


  const onSubmit = (data:ResetPasswordInput) => {

    dispatch(forgotPassword(data));
  }

  return (
    <div className='w-full h-screen flex justify-center items-center'>
      <div className="absolute top-10 cursor-pointer duration-500 hover:text-gray-500">
        <Logo size="3xl" />
      </div>
      <div className='w-full max-w-md border border-gray-300 p-6 bg-white rounded-lg shadow-md'>
        <h2 className='text-2xl font-bold mb-4 my-2 text-center'>Fogot Password</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='mb-4 flex flex-col'>
            <label className="text-gray-500" htmlFor="Email">
              Email
            </label>
            <input type="email" {...register("email")} readOnly value={email} />
          </div>
          <div className='mb-4'>
            <Input
            type="code"
            label="Code"
            {...register('code')}
            error={errors.code?.message}
            />
          </div>
          <div className='mb-4'>
            <Input 
            type="password"
            label="New Password"
            {...register("newPassword")}
            error={errors.newPassword?.message}
            />
          </div>
          <div className='mb-4'>
            <Input
            type="password"
            label="Confrim Password"
            {...register("confirmPassword")}
            error={errors.confirmPassword?.message}
            />
          </div>
          <button
            disabled={isLoading}
            type='submit'
            className='w-full hover:bg-blue-300 cursor-pointer bg-blue-500 text-white py-2 px-4 rounded-md duration-500 focus:outline-none focus:ring-2 focus:ring-blue-500'
          >
            {isLoading ? "Forgoting...":"Forgot Password"}
          </button>
        </form>
        <div>
          <p className='text-gray-600 mt-2 text-center'>
            Don't Recived a Code?{' '}
            <a href='/register' className='text-blue-500 hover:underline'>
              <button>Resend</button>
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default ForgetPassword