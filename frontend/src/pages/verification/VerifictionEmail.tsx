import { Input } from "../../components/Input/Input"
import Logo from "../../components/logo/Logo"
import { verifictionCode, type VerifictionCodeFormData } from "../../schema/auth.schema"
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../context/hook/Index"
import { sendVerifictionCode, VerifyEmail } from "../../context/api/auth"
import { useNavigate } from "react-router-dom"


function VerifictionEmail() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [canResend, setCanResend] = useState(false);

  const { isLoading, data, token } = useAppSelector(state => state.user);

  const { register, handleSubmit, formState: { errors } } =
    useForm<VerifictionCodeFormData>({
      resolver: zodResolver(verifictionCode),
    });

  const onSubmit = (formData: VerifictionCodeFormData) => {
    dispatch(VerifyEmail(formData));
  };

  useEffect(() => {
    dispatch(sendVerifictionCode());

    const timer = setTimeout(() => {
      setCanResend(true);
    }, 60000 * 5);

    return () => clearTimeout(timer);
  }, [dispatch]);

  useEffect(() => {
    if (token && data?.isVerified) {
      navigate("/");
    }
  }, [data, token, navigate]);

  const handleResend = () => {
    if (!canResend) return;

    dispatch(sendVerifictionCode());
    setCanResend(false);

    setTimeout(() => {
      setCanResend(true);
    }, 60000 * 5);
  };

  return (<div className='w-full h-screen flex justify-center items-center'> <div className="absolute top-10 cursor-pointer duration-500 hover:text-gray-500"> <Logo size="3xl" /> </div> <div className='w-full max-w-md border border-gray-300 p-6 bg-white rounded-lg shadow-md'> <h2 className='text-2xl font-bold mb-4 my-2 text-center'>Verify Your Email</h2> <form onSubmit={handleSubmit(onSubmit)}> <div className='mb-4'> <Input type="text" label="code" {...register("code")} error={errors.code?.message} /> </div> <button disabled={isLoading} type='submit' className='w-full hover:bg-blue-300 cursor-pointer bg-blue-500 text-white py-2 px-4 rounded-md duration-500 focus:outline-none focus:ring-2 focus:ring-blue-500' > Verifiy Email </button> </form> <div> <p className="text-center text-gray-600 mt-3">
    Didn’t receive a code?{" "}
    <button
      onClick={handleResend}
      disabled={!canResend}
      className={`${canResend ? "text-blue-500" : "text-gray-400 cursor-not-allowed"
        } hover:underline`}
    >
      Resend
    </button>
  </p> </div> </div> </div>)
}

export default VerifictionEmail