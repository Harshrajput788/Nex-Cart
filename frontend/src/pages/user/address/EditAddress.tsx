import { useEffect, useState } from 'react';
import "./index.css"
import type { IAddress } from '../../../Types/address';

interface EditAddressProps {
    initialAddress: IAddress;
    onSubmit?: (address: IAddress) => void;
    setEditAddress:(value:boolean) => void;
}

export default function EditAddress({
    initialAddress,
    onSubmit,
    setEditAddress
}: EditAddressProps) {
    const [address, setAddress] = useState<IAddress>(initialAddress);

    useEffect(() => {
        setAddress(initialAddress);
    }, [initialAddress]);

    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = event.target;
        setAddress((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSubmit?.(address);
    };

    return (
        <div className="min-h-screen w-full justify-self-center absolute  z-10 color px-4 py-8 sm:px-6 lg:px-8">
            <div className="rounded-3xl lg:w-1/2 w-full border justify-self-center animationPop border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-semibold text-slate-900">
                        Edit Address
                    </h1>
                    <p className="mt-2 text-sm text-slate-600">
                        Update your address details for shipping and billing.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6 lg:grid-cols-2">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-slate-700">
                                Address line 1
                            </label>
                            <input
                                name="addressLine1"
                                value={address.addressLine1}
                                onChange={handleChange}
                                required
                                className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:bg-white"
                                placeholder="123 Main St"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-slate-700">
                                Address line 2
                            </label>
                            <input
                                name="addressLine2"
                                value={address.addressLine2}
                                onChange={handleChange}
                                className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:bg-white"
                                placeholder="Apartment, suite, unit, building"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700">
                                City
                            </label>
                            <input
                                name="city"
                                value={address.city}
                                onChange={handleChange}
                                required
                                className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:bg-white"
                                placeholder="New York"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700">
                                State
                            </label>
                            <input
                                name="state"
                                value={address.state}
                                onChange={handleChange}
                                required
                                className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:bg-white"
                                placeholder="NY"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700">
                                Postal code
                            </label>
                            <input
                                name="postalCode"
                                value={address.postalCode}
                                onChange={handleChange}
                                required
                                className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:bg-white"
                                placeholder="10001"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700">
                                Country
                            </label>
                            <input
                                name="country"
                                value={address.country}
                                onChange={handleChange}
                                required
                                className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:bg-white"
                                placeholder="United States"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-slate-700">
                                Landmark
                            </label>
                            <input
                                name="landmark"
                                value={address.landmark}
                                onChange={handleChange}
                                className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:bg-white"
                                placeholder="Near Central Park"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={() => setEditAddress(false)}
                            className="rounded-2xl border border-slate-300 cursor-pointer duration-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="rounded-2xl bg-blue-500 cursor-pointer duration-200 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-300"
                        >
                            Save address
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}