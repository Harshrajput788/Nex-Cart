import React, { useState } from 'react'
import "./index.css"
import { X } from 'lucide-react'
import { useUpdateImagesById } from '../../context/api/Product'

interface props {
    id: string,
    setUploadImage: (value: boolean) => void
}

const UploadImage: React.FC<props> = ({ id, setUploadImage }) => {

    const [images, setImages] = useState<File[]>([]);
    const [imagePreview, setImagePreview] = useState<string[]>([])

    const {mutate:uploadImages,isPending} = useUpdateImagesById(id,() => setUploadImage(false));

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const files = Array.from(e.target.files);
        setImages(files);

        setImagePreview(files.map(file => URL.createObjectURL(file)));
    };

    const handleUploadImages = () =>{

        const formData = new FormData();

        images.forEach(file => {
            formData.append("Images", file);
        });

        uploadImages(formData);
    }

    return (
        <div className='w-full min-h-screen bg-slate-900/40 backdrop-blur-sm color flex fixed top-0 justify-self-center z-50 justify-center px-10 items-center'>
            <div className='w-full lg:w-1/3 bg-gray-50 border border-gray-200 rounded-xl  px-4 py-5'>
                <div className='flex w-full justify-between'>
                    <h1 className='uppercase font-semibold'>Upload Product Images</h1>
                    <X onClick={() => setUploadImage(false)} size={18} className='hover:text-gray-200 duration-200 cursor-pointer' />

                </div>
                <div className='flex w-full gap-1 justify-center items-center h-40 border my-4 overflow-x-scroll lg:overflow-x-hidden rounded-xl bg-gray-100 border-gray-200'>
                    {
                        imagePreview.length > 0 && imagePreview.map((preview, index) => (
                            <img
                                src={preview}
                                key={index}
                                alt={`Preview ${index}`}
                                className="w-20 h-20 object-cover rounded-lg"
                            />
                        ))
                    }
                </div>
                <input type="file"
                    multiple
                    onChange={handleImageChange}
                    accept="image/*"
                    className='my-5'
                />
                {
                    imagePreview.length > 0 && <div className='w-full flex justify-end'>
                        <button disabled={isPending} onClick={handleUploadImages} className='w-28 bg-blue-500 rounded-xl text-white h-10 hover:bg-blue-300 duration-200 cursor-pointer text-sm'>{
                    isPending ? "Uploading..." : "Upload Images"
                    }</button>
                    </div>
                }
            </div>

        </div>
    )
}

export default UploadImage