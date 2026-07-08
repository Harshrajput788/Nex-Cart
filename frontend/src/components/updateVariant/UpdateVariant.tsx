import { useQuery } from "@tanstack/react-query"
import React, { useEffect, useState } from "react"
import type { IProductVariant } from "../../Types/productVarient"
import { getVariantById, useUpdateProductVariantbySeller } from "../../context/api/varient"
import type { AttributeField } from "../../Types/productVarient"
import { X } from "lucide-react"

interface props {
    id: string,
    setUpadeVariant: (value: boolean) => void,
}

const UpdateVariant: React.FC<props> = ({ id, setUpadeVariant }) => {

    const { data, isLoading, isError } = useQuery<IProductVariant>({
        queryKey: ["variant", id],
        queryFn: () => getVariantById(id)
    })

    const [attributes, setAttributes] = useState<AttributeField[]>([]);

    const {mutate:UpdateVariant,isPending} = useUpdateProductVariantbySeller(id,() =>{setUpadeVariant(false)});

    const [form, setForm] = useState({
        sku: data?.sku || "",
        attributes: data?.attributes || {} as AttributeField,
        price: data?.price || 0,
        salePrice: data?.salePrice || 0,
    })

    useEffect(() => {
        if (data?.attributes) {
            Object.entries(data.attributes).map(([k, v]) => {
                setAttributes((prev) => [...prev, { id: Date.now(), key: k, value: v }]);
            })
        }
    }, [])

    const handleAddAttribute = () => {
        setAttributes((prev) => [
            ...prev,
            { id: Date.now(), key: "", value: "" },
        ]);
    };

     const handleInputChange = (
        field: keyof IProductVariant,
        value: string | number | boolean | undefined
    ) => {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleRemoveAttribute = (id: number) => {
        setAttributes((prev) => prev.filter((attr) => attr.id !== id));
    };

    const handleAttributeChange = (
        id: number,
        field: "key" | "value",
        value: string
    ) => {
        setAttributes((prev) =>
            prev.map((attr) =>
                attr.id === id ? { ...attr, [field]: value } : attr
            )
        );
    };

    const handleSubmit = (event:React.FormEvent<HTMLFormElement>) =>{
        event.preventDefault();
        const formattedAttributes: Record<string, string> = {};
        attributes.forEach((attr) => {
            if (attr.key.trim()) {
                formattedAttributes[attr.key.trim()] = attr.value.trim();
            }
        });

        const payload = {
            price:form.price,
            salePrice:form.salePrice,
            attributes: formattedAttributes,
        };
        
        UpdateVariant(payload);

    }

    if (isLoading) return <div className="w-full color flex justify-center items-center color min-h-screen fixed ">Loading...</div>
    if (isError) {
        setUpadeVariant(false);
        return;
    }

    return (
        <div className="z-50 w-full backdrop-blur-sm flex items-center color min-h-screen fixed top-0">
            <div className="w-11/12 p-5 lg:w-1/3 bg-white border border-gray-100 rounded-xl">
                <div className="w-full h-20 items-center flex justify-between">
                                    <h1 className="text-2xl uppercase font-semibold">Upadte Product Variant</h1>
                                    <X className="cursor-pointer" onClick={()=> setUpadeVariant(false)}/>
                </div>
                <hr className="px-4 text-gray-300 my-4" />
                <form onSubmit={handleSubmit}>
                    <label className="p-3 flex flex-col text-black">
                    Sku
                    <input onChange={(e)=>handleInputChange("sku",e.target.value)} type="text" className="w-full h-9 my-2 focus:outline-gray-200 border border-gray-200 text-black" value={form.sku} />
                </label>
                <label className="p-3 flex flex-col text-black">
                    Price
                    <input type="text" onChange={(e) =>handleInputChange("price",Number(e.target.value))} className="w-full h-9 my-2 focus:outline-gray-200 border border-gray-200 text-black" value={form.price} />
                </label>
                <label className="p-3 flex flex-col text-black">
                    SalePrice
                    <input type="text" onChange={(e) =>handleInputChange("salePrice",Number(e.target.value))} className="w-full h-9 my-2 focus:outline-gray-200 border border-gray-200 text-black" value={form.salePrice} />
                </label>
                <div className="space-y-6">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-medium text-slate-900">
                                    Attributes
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    Add custom attribute pairs for this variant.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={handleAddAttribute}
                                className="rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                            >
                                Add attribute
                            </button>
                        </div>
                        <div className="mt-5 space-y-4">
                            {attributes.map((attr) => (
                                <div
                                    key={attr.id}
                                    className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-[1.2fr_1.2fr_auto]"
                                >
                                    <label className="block">
                                        <span className="text-sm font-medium text-slate-700">
                                            Attribute
                                        </span>
                                        <input
                                            type="text"
                                            value={attr.key}
                                            onChange={(e) =>
                                                handleAttributeChange(attr.id, "key", e.target.value)
                                            }
                                            placeholder="e.g. Color"
                                            className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        />
                                    </label>
                                    <label className="block">
                                        <span className="text-sm font-medium text-slate-700">
                                            Value
                                        </span>
                                        <input
                                            type="text"
                                            value={attr.value}
                                            onChange={(e) =>
                                                handleAttributeChange(attr.id, "value", e.target.value)
                                            }
                                            placeholder="e.g. Navy"
                                            className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        />
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveAttribute(attr.id)}
                                        className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-2xl bg-red-50 px-4 text-sm font-semibold text-red-600 transition hover:bg-red-100 sm:w-auto"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
                <div className="w-full text-white justify-end flex py-10 px-3 gap-5">
                    <button onClick={() => setUpadeVariant(false)} className="w-20 h-10 text-black rounded-xl bg-gray-200 hover:bg-gray-100 cursor-pointer duration-200">Cancel</button>
                     <button disabled={isPending} className="w-28 text-sm rounded-xl h-10 bg-blue-500 hover:bg-blue-300 cursor-pointer duration-200">{isPending?"Updating...":"Update Variant"}</button>
                </div>
                </form>
            </div>


        </div>
    )
}
export default UpdateVariant