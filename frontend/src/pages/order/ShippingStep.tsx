import type { IShippingAddress } from "../../Types/order";
import { FieldInput } from "./Component";

const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh",
  "Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka",
  "Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram",
  "Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
  "Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
  "Andaman and Nicobar Islands","Chandigarh","Delhi","Jammu and Kashmir",
  "Ladakh","Lakshadweep","Puducherry",
];
 
export default function ShippingStep({
  address, onChange, onNext,
}: {
  address: IShippingAddress;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onNext: () => void;
}) {
  const isValid =
    address.fullName && address.phone && address.addressLink1 &&
    address.city && address.state && address.postalCode && address.country;

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-800 mb-1">Delivery address</h2>
      <p className="text-sm text-gray-400 mb-6">Where should we send your order?</p>

      <div className="grid grid-cols-2 gap-4">
        <FieldInput label="Full name" name="fullName" value={address.fullName} onChange={onChange} placeholder="Rahul Sharma" required />
        <FieldInput label="Phone number" name="phone" value={address.phone} onChange={onChange} type="tel" placeholder="9876543210" required half />
        <FieldInput label="Address line 1" name="addressLink1" value={address.addressLink1} onChange={onChange} placeholder="Street, building, area" required />
        <FieldInput label="Address line 2" name="addressLink2" value={address.addressLink2 as string} onChange={onChange} placeholder="Landmark, floor (optional)" />
        <FieldInput label="City" name="city" value={address.city} onChange={onChange} placeholder="Mumbai" required half />
        <div className="col-span-1">
          <label className="block text-xs font-medium text-gray-500 mb-1.5">
            State<span className="text-blue-600 ml-0.5">*</span>
          </label>
          <select
            name="state"
            value={address.state}
            onChange={onChange}
            required
            className="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg text-gray-800
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              transition-all hover:border-gray-300 appearance-none"
          >
            <option value="">Select state</option>
            {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <FieldInput label="Postal code" name="postalCode" value={address.postalCode} onChange={onChange} placeholder="400001" required half />
        <FieldInput label="Country" name="country" value={address.country} onChange={onChange} placeholder="India" required half />
      </div>

      <button
        onClick={onNext}
        disabled={!isValid}
        className="mt-8 w-full py-3 px-6 rounded-xl text-sm font-semibold transition-all
          bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.99]
          disabled:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed"
      >
        Continue to payment
      </button>
    </div>
  );
}