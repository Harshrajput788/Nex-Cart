import Logo from '../../components/logo/Logo'
import {useForm} from 'react-hook-form'
import type { SendForgetFormData } from '../../schema/auth.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { sendForgetEmail } from '../../schema/auth.schema'
import { sendForgetPassword } from '../../context/api/forgetPassword'
import { useAppDispatch, useAppSelector } from '../../context/hook/Index'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input } from '../../components/Input/Input'

function SendForgetPasswordCode() {

  const {handleSubmit,register,formState:{errors}} = useForm<SendForgetFormData>({resolver:zodResolver(sendForgetEmail)});
  const dispatch= useAppDispatch();

  const {email} = useAppSelector(state => state.forget);
  const nav = useNavigate();

  useEffect(()=>{
    if(email != "")nav("/forgot-password")
  },[email,nav])

  const onSubmit = (data:SendForgetFormData) => {
    dispatch(sendForgetPassword(data))
  } 

  return (
    <div className='w-full h-screen flex justify-center items-center'>
      <div className="absolute top-10 cursor-pointer duration-500 hover:text-gray-500">
        <Logo size="3xl" />
      </div>
      <div className='w-full max-w-md border border-gray-300 p-6 bg-white rounded-lg shadow-md'>
        <h2 className='text-2xl font-bold mb-4 my-2 text-center'>Send Forget Password Code</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='mb-4'>
            <Input
            type='email'
            label='Email'
            {...register("email")}
            error={errors.email?.message}/>
          </div>
          <button
            type='submit'
            className='w-full hover:bg-blue-300 cursor-pointer bg-blue-500 text-white py-2 px-4 rounded-md duration-500 focus:outline-none focus:ring-2 focus:ring-blue-500'
          >
            Send Code
          </button>
        </form>
        <div>
          <p className='text-gray-600 mt-2 text-center'>
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

export default SendForgetPasswordCode