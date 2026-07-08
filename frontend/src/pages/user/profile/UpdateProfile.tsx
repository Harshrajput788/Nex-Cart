import React, { useState } from "react";
import { useAppSelector } from "../../../context/hook/Index";

const UpdateProfile: React.FC = ({
}) => {

    const {data} = useAppSelector(state=>state.user)

    const [fullName, setFullName] = useState(data?.fullName || "");
    const [email, setEmail] = useState(data?.email || "");
    const [phone, setPhone] = useState(data?.phone || "");
    const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
        "idle"
    );

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setStatus("saving");

        try {
            await new Promise((resolve) => setTimeout(resolve, 800));

            setStatus("saved");
        } catch {
            setStatus("error");
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-3xl bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
                <div className=" from-sky-500 to-indigo-600 px-6 py-8 sm:px-10">
                    <h1 className="text-2xl sm:text-3xl font-semibold">
                        Update Profile
                    </h1>
                    <p className="mt-2 text-sm sm:text-base max-w-2xl">
                        Edit your profile information for user ID{" "}
                        <span className="font-medium">{data?._id}</span>.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="px-6 py-8 sm:px-10 sm:py-10 space-y-6"
                >
                    <div className="grid gap-6 md:grid-cols-2">
                        <label className="flex flex-col">
                            <span className="text-sm font-medium text-slate-700">
                                Full name
                            </span>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(event) => setFullName(event.target.value)}
                                placeholder="Jane Doe"
                                className="mt-2 px-4 py-3 rounded-2xl border border-slate-300 bg-slate-50 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none transition"
                            />
                        </label>

                        <label className="flex flex-col">
                            <span className="text-sm font-medium text-slate-700">Email</span>
                            <input
                                type="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                placeholder="jane@example.com"
                                className="mt-2 px-4 py-3 rounded-2xl border border-slate-300 bg-slate-50 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none transition"
                            />
                        </label>
                    </div>

                    <label className="flex flex-col">
                        <span className="text-sm font-medium text-slate-700">Phone</span>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(event) => setPhone(event.target.value)}
                            placeholder="+1 (555) 123-4567"
                            className="mt-2 px-4 py-3 rounded-2xl border border-slate-300 bg-slate-50 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none transition"
                        />
                    </label>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            {status === "saved" && (
                                <p className="text-sm text-emerald-600">
                                    Profile updated successfully.
                                </p>
                            )}
                            {status === "error" && (
                                <p className="text-sm text-rose-600">
                                    Something went wrong. Please try again.
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={status === "saving"}
                            className="inline-flex items-center justify-center rounded-2xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                        >
                            {status === "saving" ? "Saving..." : "Save changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateProfile;