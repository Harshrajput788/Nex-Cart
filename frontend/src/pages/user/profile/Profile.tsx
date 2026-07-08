import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../context/hook/Index';
import { updateProfile } from '../../../context/api/auth';
import AddAddress from '../address/AddAddress';
import { deleteUserAddress, fetchUserAddress } from '../../../context/api/address';
import { useQuery } from '@tanstack/react-query';
import type { IAddress } from '../../../Types/address';
import { EditIcon, Trash2 } from 'lucide-react';
import EditAddress from '../address/EditAddress';


interface editUser {
  fullName: string,
  phone: string,
}

type TabType = 'personal' | 'address' | 'security';

const ProfileComponent: React.FC = ({
}) => {

  const { user } = useAppSelector(state => state);

  const [activeTab, setActiveTab] = useState<TabType>('personal');
  const [is2FAEnabled, setIs2FAEnabled] = useState(true);

  const [form, setForm] = useState<editUser>({
    fullName: "",
    phone: ""
  })

  const [editAddress,setEditAddress] = useState(false);

  const [address, setAddress] = useState(false);

  const [edit, setEdit] = useState(false)

  const dispatch = useAppDispatch();

  const { data, isLoading } = useQuery<IAddress>({
    queryKey: ["address", user.data?._id],
    queryFn: () => fetchUserAddress()
  })

  useEffect(() => {
    if (user.data) {
      setForm({
        fullName: user.data.fullName,
        phone: user.data.phone
      })
    }
  }, [user])

  const enableEdit = (value: string) => {
    if (value !== user.data?.phone && value !== user.data?.fullName) {
      setEdit(true);
    } else {
      setEdit(false);
    }
  }


  return (
    <div className="min-h-screen w-full p-4 md:p-8">
      {address && <AddAddress setAddress={setAddress} />}
      {editAddress && <EditAddress setEditAddress={setEditAddress} initialAddress={data? data : {} as IAddress}/>}
      <style>{`        
        * { font-family: 'DM Sans', sans-serif; }
        .playfair { font-family: 'Playfair Display', serif; }
        
        .avatar-ring {
          background: conic-gradient(from 0deg, #2563eb, #60a5fa, #1e40af, #3b82f6, #2563eb);
          animation: spin 4s linear infinite;
        }
        
        .card-hover { 
          transition: transform 0.2s ease, box-shadow 0.2s ease; 
        }
        
        .card-hover:hover { 
          transform: translateY(-2px); 
          box-shadow: 0 12px 32px rgba(37,99,235,0.12); 
        }
        
        .badge-verified {
          background: linear-gradient(135deg, #2563eb, #60a5fa);
        }
        
        .tab-active {
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          color: white;
        }
        
        .tab-inactive { 
          color: #64748b; 
        }
        
        .tab-inactive:hover { 
          background: #eff6ff; 
          color: #2563eb; 
        }
        
      
        
        .gradient-header {
          background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #3b82f6 100%);
        }
        
        .input-focus:focus { 
          outline: none; 
          border-color: #2563eb; 
          box-shadow: 0 0 0 3px rgba(37,99,235,0.1); 
        }
      `}</style>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl overflow-hidden shadow-xl shadow-blue-100/50 border border-blue-50">

          <div className="gradient-header h-32 md:h-44 relative">
          </div>

          <div className="px-6 md:px-10 pb-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-14 mb-6 gap-4">
              <div className="flex items-end gap-4">
                <div className="relative ">
                  <div className="avatar-ring w-24 h-24 md:w-28 md:h-28 rounded-full ">
                    <div className="w-full h-full rounded-full flex items-center justify-center border-4 border-white">
                      <span className="text-white text-2xl md:text-3xl font-semibold">
                        {user.data?.fullName[0]}
                      </span>
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white shadow-sm" />
                </div>
                <div className="mb-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="playfair text-2xl md:text-3xl text-slate-800 font-semibold">
                      {user.data?.fullName}
                    </h1>
                    {user.data?.isVerified && (
                      <span className="badge-verified text-white text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Verified
                      </span>
                    )}
                  </div>
                  <p className="text-blue-500 text-sm font-medium mt-0.5">{user.data?.email}</p>
                </div>
              </div>
              <div className="flex gap-2 sm:mb-1">
                <span className={`text-xs font-semibold px-3 py-1.5 rounded-xl tracking-wide border`}>
                  {user.data?.role}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-8">
              <div className="card-hover bg-blue-50 rounded-2xl p-4 text-center border border-blue-100/80 cursor-default">
                <p className="text-2xl font-bold text-blue-700">
                  {user.data?.createdAt ? Math.floor((Date.now() - new Date(user.data.createdAt).getTime()) / (1000 * 60 * 60 * 24)) : 0}
                </p>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Days Active</p>
              </div>
            </div>

            <div className="flex gap-2 mb-6 p-1 bg-slate-100 rounded-xl w-full overflow-x-auto">
              <button
                onClick={() => setActiveTab('personal')}
                className={`${activeTab === 'personal' ? 'tab-active' : 'tab-inactive'} flex-1 min-w-max text-sm font-medium px-4 py-2 rounded-lg transition-all`}
              >
                Personal Info
              </button>
              <button
                onClick={() => setActiveTab('address')}
                className={`${activeTab === 'address' ? 'tab-active' : 'tab-inactive'} flex-1 min-w-max text-sm font-medium px-4 py-2 rounded-lg transition-all`}
              >
                Addresses
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`${activeTab === 'security' ? 'tab-active' : 'tab-inactive'} flex-1 min-w-max text-sm font-medium px-4 py-2 rounded-lg transition-all`}
              >
                Security
              </button>
            </div>

            {activeTab === 'personal' && (
              <div className="section-fade">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-blue-600 uppercase tracking-widest">
                      Full Name
                    </label>
                    <input
                      className="input-focus w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 text-sm transition-all"
                      value={form.fullName}
                      onChange={(e) => { setForm((prev) => ({ ...prev, fullName: e.target.value })), enableEdit(e.target.value) }}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-blue-600 uppercase tracking-widest">
                      Email Address
                    </label>
                    <div
                      className="input-focus w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 text-sm transition-all"
                    >
                      {user.data?.email}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-blue-600 uppercase tracking-widest">
                      Phone
                    </label>
                    <input
                      className="input-focus w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 text-sm transition-all"
                      value={form.phone}
                      type='number'
                      onChange={(e) => { setForm((prev) => ({ ...prev, phone: e.target.value })), enableEdit(e.target.value) }}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-blue-600 uppercase tracking-widest">
                      Role
                    </label>
                    <div className="w-full bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-blue-700 text-sm font-medium flex items-center justify-between">
                      <span>{user.data?.role}</span>
                      <span className="w-2 h-2 bg-blue-400 rounded-full" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-blue-600 uppercase tracking-widest">
                      Account Status
                    </label>
                    <div className={`w-full ${user.data?.isVerified ? 'bg-green-50 border-green-100 text-green-700' : 'bg-yellow-50 border-yellow-100 text-yellow-700'} border rounded-xl px-4 py-3 text-sm font-medium flex items-center gap-2`}>
                      <div className={`w-2 h-2 ${user.data?.isVerified ? 'bg-green-500' : 'bg-yellow-500'} rounded-full animate-pulse`} />
                      {user.data?.isVerified ? 'Active & Verified' : 'Pending Verification'}
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex gap-3 justify-end">
                  <button
                    onClick={() => {setForm({ fullName: user.data?.fullName || "", phone: user.data?.phone || "" }),setEdit(false )}}
                    className="px-5 py-2.5 text-sm font-medium text-slate-500 hover:text-slate-700 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all"
                  >
                    Cancel
                  </button>
                  {edit ? (
                    <button
                      onClick={() => dispatch(updateProfile(form))}
                      className="px-6 py-2.5 text-sm font-semibold text-white rounded-xl transition-all hover:shadow-lg hover:shadow-blue-200"
                      style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)' }}
                    >
                      Save Changes
                    </button>
                  ) : (
                    <button
                      className="px-6 py-2.5 text-sm font-semibold text-white rounded-xl transition-all hover:shadow-lg"
                      style={{ background: 'gray' }}
                    >
                      Save Changes
                    </button>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'address' && (
              <div className="section-fade w-full">
                <div className="space-y-4 w-full">
                  <div
                    className={`card-hover w-full relative rounded-2xl p-5 border cursor-default overflow-hidden ${' from-blue-600 to-blue-700  border-blue-500'
                      }`}
                  >

                    {
                      isLoading ? <div className='w-full'>Loading</div> : <div className='w-full flex justify-between bg-gray-100 px-3 py-2 '>
                      <div className='w-11/12 flex gap-1 flex-col'>
                        <p>{data?.addressLine1}</p>
                        <p>{data?.addressLine2}</p>
                        <p>{data?.city}</p>
                        <p>{data?.postalCode}</p>
                        <p>{data?.state}</p>
                        <p>{data?.country}</p>
                      </div>
                      <div className={` ${!data ? "hidden" : "flex"} gap-3 justify-self-end`}>
                        <EditIcon onClick={() => setEditAddress(true)} className='cursor-pointer text-blue-300' size={18} />
                        <Trash2 onClick={() => { dispatch(deleteUserAddress(data?._id || "")) }} className='cursor-pointer text-red-300' size={18} />
                      </div>
                    </div>
                    }
                  </div>

                  <button
                    onClick={() => setAddress(true)}
                    className="w-full border-2 border-dashed border-blue-200 hover:border-blue-400 bg-blue-50/50 hover:bg-blue-50 text-blue-500 hover:text-blue-600 rounded-2xl p-5 text-sm font-semibold flex items-center justify-center gap-2 transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add New Address
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="section-fade">
                <div className="space-y-5">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-700">Password</p>
                      </div>
                    </div>
                    <button
                      className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      Change
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${user.data?.isVerified ? 'bg-green-100' : 'bg-yellow-100'
                        }`}>
                        <svg className={`w-5 h-5 ${user.data?.isVerified ? 'text-green-600' : 'text-yellow-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-700">Email Verification</p>
                        <p className={`text-xs ${user.data?.isVerified ? 'text-green-500' : 'text-yellow-500'}`}>
                          {user.data?.email}
                        </p>
                      </div>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${user.data?.isVerified
                      ? 'text-green-600 bg-green-50 border-green-100'
                      : 'text-yellow-600 bg-yellow-50 border-yellow-100'
                      }`}>
                      {user.data?.isVerified ? 'Verified' : 'Unverified'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-700">Two-Factor Auth</p>
                        <p className="text-xs text-slate-400">Extra layer of protection</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={is2FAEnabled}
                        onChange={(e) => {
                          setIs2FAEnabled(e.target.checked);
                        }}
                      />
                      <div className="w-10 h-6 bg-slate-300 peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:bg-blue-600 relative transition-colors">
                        <div
                          className="absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform shadow-sm"
                          style={{ transform: is2FAEnabled ? 'translateX(16px)' : 'translateX(0)' }}
                        />
                      </div>
                    </label>
                  </div>

                  <div className="p-4 bg-red-50 rounded-2xl border border-red-100">
                    <p className="text-sm font-semibold text-red-600 mb-1">Danger Zone</p>
                    <p className="text-xs text-slate-500 mb-3">
                      Deleting your account is permanent and cannot be undone.
                    </p>
                    <button
                      className="text-sm font-semibold text-red-500 hover:text-red-600 border border-red-200 hover:border-red-300 bg-white hover:bg-red-50 px-4 py-2 rounded-lg transition-all"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div >
  );
};

export default ProfileComponent;