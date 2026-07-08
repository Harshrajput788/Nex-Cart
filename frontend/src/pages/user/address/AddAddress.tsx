import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { addressSchema, type AddressFormData } from '../../../schema/address';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../../../components/Input/Input';
import { useAppDispatch, useAppSelector } from '../../../context/hook/Index';
import { createUserAddress } from '../../../context/api/address';
import { useNavigate } from 'react-router-dom';
import "./index.css"
import { X } from 'lucide-react';

interface AddAddressProps {
  setAddress: (value: boolean) => void;
}

const AddAddress: React.FC<AddAddressProps> = ({setAddress}) => {

    const{address,isLoading} = useAppSelector(state => state.addreess);

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver:zodResolver(addressSchema)
    });

    const navigate = useNavigate();

    useEffect(()=>{
        if(address) {
            navigate("/user/")
        }
    },[address,navigate])

    const dispatch = useAppDispatch();

    const onSubmit = (data:AddressFormData) => {
        dispatch(createUserAddress(data));

        
    };

    return (
        <div className="min-h-screen color absolute min-w-full right-0 z-10 py-12 px-4">
            <div className="max-w-md mx-auto animationPop bg-white rounded-lg shadow p-6">
               <div className='w-full h-14 justify-between flex items-center'>
                 <h1 className="text-2xl font-bold mb-6">Add Address</h1>
                 <X onClick={() => setAddress(false)} className="cursor-pointer" size={28} />
               </div>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                    <div>
                        <Input
                        type='text'
                        {...register("addressLine1")}
                        label='Address Link 1'
                        error={errors.addressLine1?.message}
                        />
                    </div>

                    <div>
                        <Input
                        type='text'
                        {...register("addressLine2")}
                        label='Address Link 2'
                        error={errors.addressLine2?.message}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Input
                            type='text'
                            label='City'
                            {...register("city")}
                            error={errors.city?.message}
                            />
                        </div>

                        <div>
                            <Input
                            type='text'
                            label='State'
                            {...register("state")}
                            error={errors.state?.message}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Input
                            type='text'
                            {...register("postalCode")}
                            label='Postal Code'
                            error={errors.postalCode?.message}
                            />
                        </div>

                        <div>
                            <Input
                            type='text'
                            {...register("country")}
                            label='Country'
                            error={errors.country?.message}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-700 transition"
                    >
                        {isLoading ? "Adding..." :"Add Address"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddAddress