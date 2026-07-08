import React, { useState } from 'react';
import { Search, Download, MoreVertical, Phone, Calendar, Shield, CheckCircle, XCircle, Edit, Trash2, Eye } from 'lucide-react';
import UserView from '../../../components/view/UserView';
import { useGetAllUserByAdmin, deleteProfile } from '../../../context/api/auth';
import type { User } from '../../../Types/user';
import { useSearchParams } from "react-router-dom";
import EditForm from './Form';
import AlertBox from "../../../components/Alert/Alert";

const usePagination = () => {
    const [params, setParams] = useSearchParams();

    const query = {
        page: Number(params.get("page")) || 1,
        limit: Number(params.get("limit")) || 20,
    };

    const updateQuery = (updates: Partial<typeof query>) => {
        const next = { ...query, ...updates };

        Object.entries(next).forEach(([key, value]) => {
            if (!value) params.delete(key);
            else params.set(key, String(value));
        });

        setParams(params);
    };

    return { query, updateQuery };
};

const CustomersPage: React.FC = () => {

    const { query, updateQuery } = usePagination();

    const { data, isLoading, isError, error } = useGetAllUserByAdmin(query);

    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter] = useState<string>("ALL");
    const [verifiedFilter, setVerifiedFilter] = useState<string>("ALL");
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [showUserModal, setShowUserModal] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [editUser, setEditUser] = useState<User | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [totalPage] = useState(Math.floor(data?.total as number / Number(query.limit)))

    const filteredUsers = data?.users.filter(user => {
        const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.phone.includes(searchTerm);

        const matchesRole = roleFilter === "ALL" || user.role === roleFilter;
        const matchesVerified = verifiedFilter === "ALL" ||
            (verifiedFilter === "VERIFIED" && user.isVerified) ||
            (verifiedFilter === "UNVERIFIED" && !user.isVerified);

        return matchesSearch && matchesRole && matchesVerified;
    });

    const stats = {
        total: data?.users.length,
        admins: data?.users.filter(u => u.role === "ADMIN").length,
        sellers: data?.users.filter(u => u.role === "SELLER").length,
        customers: data?.users.filter(u => u.role === "USER").length,
        verified: data?.users.filter(u => u.isVerified).length,
    };

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case "ADMIN": return "bg-blue-100 text-blue-700 border-blue-200";
            case "SELLER": return "bg-purple-100 text-purple-700 border-purple-200";
            case "USER": return "bg-gray-100 text-gray-700 border-gray-200";
            default: return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const handleViewUser = (user: User) => {
        setSelectedUser(user);
        setShowUserModal(true);
    };

    const handleDeleteUser = (user: User) => {
        setSelectedUser(user);
        setShowDelete(true);
    };

    const deleteProfileCall = deleteProfile();


    if (isError) return <div className='w-full h-screen flex justify-center items-center'>Error Occurr {error.message}</div>

    if (data?.users.length === 0) return <div className="bg-white flex flex-col justify-center items-center h-screen rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No users found</h3>
        <p className="text-gray-600">Try adjusting your search or filters</p>
    </div>

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">

                {showEditModal && <EditForm user={editUser as User} setShowEditModal={setShowEditModal} />}
                {showDelete && <AlertBox id={selectedUser?._id as string} name={selectedUser?.fullName as string} setDelete={setShowDelete} mutation={deleteProfileCall} />}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Customers & Users</h1>
                    <p className="text-gray-600">Manage and monitor all platform users</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Users</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{data?.total}</p>
                            </div>
                            <div className="bg-blue-100 p-3 rounded-lg">
                                <Shield className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Verified</p>
                                <p className="text-2xl font-bold text-green-600 mt-1">{stats.verified}</p>
                            </div>
                            <div className="bg-green-50 p-3 rounded-lg">
                                <CheckCircle className="w-6 h-6 text-green-500" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search by name, email, or phone..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                            </div>
                        </div>


                        <div className="w-full lg:w-48">
                            <select
                                value={verifiedFilter}
                                onChange={(e) => setVerifiedFilter(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 cursor-pointer rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            >
                                <option value="ALL">All Status</option>
                                <option value="VERIFIED">Verified</option>
                                <option value="UNVERIFIED">Unverified</option>
                            </select>
                        </div>

                        <div className="flex gap-2">
                            <button className="px-4 py-2 cursor-pointer bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                                <Download className="w-5 h-5" />
                                <span className="hidden sm:inline">Export</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="hidden md:block bg-white h-120 rounded-lg shadow-sm border border-gray-200 lg:overflow-y-auto">
                    {isLoading ? <div className='w-full flex justify-center h-full items-center'>Loading...</div> :
                        filteredUsers?.length === 0 ? (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                                <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Search className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No users found</h3>
                                <p className="text-gray-600">Try adjusting your search or filters</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredUsers?.map((user) => (
                                            <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                            <span className="text-blue-600 font-medium text-sm">
                                                                {user.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                                                            </span>
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                                                            <div className="text-sm text-gray-500">{user.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{user.phone}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {user.isVerified ? (
                                                        <span className="flex items-center gap-1 text-green-600">
                                                            <CheckCircle className="w-4 h-4" />
                                                            <span className="text-sm font-medium">Verified</span>
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center gap-1 text-red-600">
                                                            <XCircle className="w-4 h-4" />
                                                            <span className="text-sm font-medium">Unverified</span>
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {user.lastLoginAt ? formatDate(user.lastLoginAt) : 'Never'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {formatDate(user.createdAt)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => handleViewUser(user)}
                                                            className="text-blue-600 cursor-pointer hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                                                            title="View Details"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                        <button onClick={() => { setEditUser(user); setShowEditModal(true); }} className="text-gray-600 cursor-pointer hover:text-gray-900 p-1 rounded hover:bg-gray-100" title="Edit">
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button onClick={() => handleDeleteUser(user)} className="text-red-600 cursor-pointer hover:text-red-900 p-1 rounded hover:bg-red-50" title="Delete">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )
                    }
                </div>

                {
                    isLoading ? <div className='w-full flex justify-center h-full items-center'>Loading...</div> : <div className="md:hidden space-y-4">

                        {filteredUsers?.length === 0 ? (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                                <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Search className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No users found</h3>
                                <p className="text-gray-600">Try adjusting your search or filters</p>
                            </div>
                        ) : filteredUsers?.map((user) => (
                            <div key={user._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                                            <span className="text-blue-600 font-medium">
                                                {user.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-900">{user.fullName}</h3>
                                            <p className="text-xs text-gray-500">{user.email}</p>
                                        </div>
                                    </div>
                                    <button className="text-gray-400 hover:text-gray-600">
                                        <MoreVertical className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="space-y-2 mb-3">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Phone className="w-4 h-4 text-gray-400" />
                                        <span className="text-gray-600">{user.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        <span className="text-gray-600">Joined {formatDate(user.createdAt)}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 mb-3">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getRoleBadgeColor(user.role)}`}>
                                        {user.role}
                                    </span>
                                    {user.isVerified ? (
                                        <span className="flex items-center gap-1 text-green-600 text-xs font-medium">
                                            <CheckCircle className="w-3 h-3" />
                                            Verified
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1 text-red-600 text-xs font-medium">
                                            <XCircle className="w-3 h-3" />
                                            Unverified
                                        </span>
                                    )}
                                </div>

                                <div className="flex gap-2 pt-3 border-t border-gray-200">
                                    <button
                                        onClick={() => handleViewUser(user)}
                                        className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium flex items-center justify-center gap-1"
                                    >
                                        <Eye className="w-4 h-4" />
                                        View
                                    </button>
                                    <button onClick={() => { setEditUser(user); setShowEditModal(true); }} className="flex-1 px-3 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium flex items-center justify-center gap-1">
                                        <Edit className="w-4 h-4" />
                                        Edit
                                    </button>
                                    <button onClick={() => handleDeleteUser(user)} className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                }

                {filteredUsers?.length as number > 0 && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mt-6">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="text-sm text-gray-600">
                                Showing <span className="font-medium">{filteredUsers?.length}</span> of <span className="font-medium">{data?.total}</span> users
                            </div>
                            <div className="flex gap-2">
                                <button disabled={query.page === 1} onClick={() => { updateQuery({ page: query.page - 1 }) }} className="px-4 cursor-pointer py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                                    Previous
                                </button>
                                <button disabled={totalPage === query.page} onClick={() => { updateQuery({ page: query.page + 1 }) }} className="px-4 cursor-pointer py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {showUserModal && selectedUser && (
                <UserView onClose={setShowUserModal} user={selectedUser} />
            )}
        </div>
    );
};

export default CustomersPage;