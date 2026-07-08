import React from 'react'
import type { User } from '../../Types/user'
import { Calendar, CheckCircle, Mail, Phone, XCircle } from 'lucide-react';

interface Props {
    user: User
    onClose: (value: boolean) => void
}

const UserView: React.FC<Props> = ({ user, onClose }) => {

    const formatDateTime = (date: Date) => {
        return new Date(date).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };


    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case "ADMIN": return "bg-blue-100 text-blue-700 border-blue-200";
            case "SELLER": return "bg-purple-100 text-purple-700 border-purple-200";
            case "USER": return "bg-gray-100 text-gray-700 border-gray-200";
            default: return "bg-gray-100 text-gray-700 border-gray-200";
        }
    }

    return (
        <div className="fixed inset-0 bg-slate-900/40 drop-shadow-2xl bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">User Details</h2>
                    <button
                        onClick={() => onClose(false)}
                        className="text-gray-400 cursor-pointer hover:text-gray-600"
                    >
                        <XCircle className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 font-bold text-2xl">
                                {user.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </span>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">{user.fullName}</h3>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getRoleBadgeColor(user.role)}`}>
                                    {user.role}
                                </span>
                                {user.isVerified ? (
                                    <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                                        <CheckCircle className="w-4 h-4" />
                                        Verified
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1 text-red-600 text-sm font-medium">
                                        <XCircle className="w-4 h-4" />
                                        Unverified
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                    <Mail className="w-4 h-4" />
                                    Email
                                </label>
                                <p className="mt-1 text-gray-900">{user.email}</p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                    <Phone className="w-4 h-4" />
                                    Phone
                                </label>
                                <p className="mt-1 text-gray-900">{user.phone}</p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    Member Since
                                </label>
                                <p className="mt-1 text-gray-900">{formatDate(user.createdAt)}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500">User ID</label>
                                <p className="mt-1 text-gray-900 font-mono text-sm">{user._id}</p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500">Last Login</label>
                                <p className="mt-1 text-gray-900">
                                    {user.lastLoginAt ? formatDateTime(user.lastLoginAt as Date) : 'Never'}
                                </p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500">Last Updated</label>
                                <p className="mt-1 text-gray-900">{formatDateTime(user.updatedAt)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserView