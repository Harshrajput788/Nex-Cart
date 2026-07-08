import type { User } from '../../../Types/user';
import { useState } from 'react';
import { updateUserByAdmin } from '../../../context/api/auth';

interface EditFormProps {
    user: User;
    setShowEditModal: (value: boolean) => void;
}

const EditForm: React.FC<EditFormProps> = ({ user, setShowEditModal }) => {

    type UpdateUser = {
        _id: string;
        fullName: string;
        phone: string;
        isVerified: boolean;
        role: User['role'];
    }

    const { mutate: updateUserData } = updateUserByAdmin(() => setShowEditModal(false));

    const [updateUser, setUpdateUser] = useState<UpdateUser>({
        _id: user._id,
        fullName: user.fullName,
        phone: user.phone,
        isVerified: user.isVerified,
        role: user.role
    });

    const handleSaveChanges = () => {
        updateUserData({ id: updateUser._id, data: updateUser });
        setShowEditModal(false);
    };

    return (
        <div className="fixed inset-0 bg-slate-900/40  backdrop-blur-sm z-50 flex items-center justify-center px-4">
            <div className="w-11/12 md:w-1/3 bg-white p-5 rounded-lg">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input type="text" onChange={(e) => setUpdateUser({...updateUser, fullName: e.target.value})} defaultValue={updateUser.fullName} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <input type="text" onChange={(e) => setUpdateUser({...updateUser, phone: e.target.value})} defaultValue={updateUser.phone} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Verified</label>
                    <input type="checkbox" checked={updateUser.isVerified} onChange={(e) => setUpdateUser({...updateUser, isVerified: e.target.checked ? true : false})} className="mt-1" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Role</label>
                    <select value={updateUser.role} onChange={(e) => setUpdateUser({...updateUser, role: e.target.value as User['role']})} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="USER">User</option>

                        <option value="SELLER">Seller</option>
                    </select>
                </div>
                <div className="flex items-center my-3 gap-2">
                    <button 
                        className="px-4 py-2 cursor-pointer bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        onClick={handleSaveChanges}
                    >
                        Save Changes
                    </button>
                    <button 
                        className="px-4 py-2 cursor-pointer bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                        onClick={() => setShowEditModal(false)}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}

export default EditForm;