import { useState, type ChangeEvent } from "react";
import { StatCard, ThumbnailModal } from "../../../components/Thumbnails/Elemet";
import { DeleteModal } from "../../../components/Thumbnails/DeleteUI";
import type { IThumbnail, ThumbnailType } from "../../../Types/thumbnail";
import ThumbnailCard from "../../../components/Thumbnails/ThumbnailCard";
import { useThumbnails } from "../../../context/api/thumbnails";
import { CreateThumbanail } from "../../../components/Thumbnails/Create";

type SortKey = "type" | "isActive" | "heading";

interface FilterState {
    search: string;
    type: ThumbnailType | "ALL";
    status: "ALL" | "ACTIVE" | "INACTIVE";
}


const TYPE_CONFIG: Record<ThumbnailType, { label: string; color: string; bg: string; dot: string }> = {
    PRODUCT: { label: "Product", color: "text-blue-700", bg: "bg-blue-50 border-blue-200", dot: "bg-blue-500" },
    CATEGORY: { label: "Category", color: "text-sky-700", bg: "bg-sky-50 border-sky-200", dot: "bg-sky-500" },
    BANNER: { label: "Banner", color: "text-indigo-700", bg: "bg-indigo-50 border-indigo-200", dot: "bg-indigo-500" },
    COLLECTION: { label: "Collection", color: "text-cyan-700", bg: "bg-cyan-50 border-cyan-200", dot: "bg-cyan-500" },
};


const ThumbnailManager: React.FC = () => {

    const { data, isLoading } = useThumbnails();

    const [thumbnails, setThumbnails] = useState<IThumbnail[]>(data ? data : [] as IThumbnail[]);
    const [filters, setFilters] = useState<FilterState>({ search: "", type: "ALL", status: "ALL" });
    const [create, setCreate] = useState(false);
    const [deleteId, setDelete] = useState("");
    const [modal, setModal] = useState<{ mode: "add" | "edit"; thumb: Partial<IThumbnail> | null } | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<string[] | null>(null);
    const [del, setDel] = useState(false);
    const [sortKey, setSortKey] = useState<SortKey>("heading");


    const filtered = thumbnails
        .filter(t => {
            const q = filters.search.toLowerCase();
            const matchSearch = !q || t.heading?.toLowerCase().includes(q) || t.publicId.toLowerCase().includes(q) || t.paragraph?.toLowerCase().includes(q);
            const matchType = filters.type === "ALL" || t.type === filters.type;
            const matchStatus = filters.status === "ALL" || (filters.status === "ACTIVE" ? t.isActive : !t.isActive);
            return matchSearch && matchType && matchStatus;
        })
        .sort((a, b) => {
            if (sortKey === "isActive") return Number(b.isActive) - Number(a.isActive);
            return (a[sortKey] ?? "").toString().localeCompare((b[sortKey] ?? "").toString());
        });


    const handleToggleActive = (id: string) =>
        setThumbnails(prev => prev.map(t => t._id === id ? { ...t, isActive: !t.isActive } : t));

    const handleSave = (data: Partial<IThumbnail>) => {
        if (data._id) {
            setThumbnails(prev => prev.map(t => t._id === data._id ? { ...t, ...data } as IThumbnail : t));
        } else {
            const newThumb: IThumbnail = { ...data, _id: Date.now().toString(), isDeleted: false } as IThumbnail;
            setThumbnails(prev => [newThumb, ...prev]);
        }
        setModal(null);
    };


    const stats = {
        total: thumbnails.length,
        active: thumbnails.filter(t => t.isActive).length,
        banners: thumbnails.filter(t => t.type === "BANNER").length,
        collections: thumbnails.filter(t => t.type === "COLLECTION").length,
    };

    return (
        <div className="min-h-screen bg-blue-200/6">

            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Home Thumbnails</h1>
                        <p className="text-slate-500 text-sm mt-1">Manage banner images and promotional content displayed on the homepage</p>
                    </div>
                    <button
                        onClick={() => setCreate(true)}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 shadow-md shadow-blue-200 transition-all active:scale-95 shrink-0"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        Add Thumbnail
                    </button>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard label="Total Thumbnails" value={stats.total}
                        icon={<svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                        accent="bg-blue-50" />
                    <StatCard label="Active" value={stats.active}
                        icon={<svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                        accent="bg-green-50" />
                    <StatCard label="Banners" value={stats.banners}
                        icon={<svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" /></svg>}
                        accent="bg-indigo-50" />
                    <StatCard label="Collections" value={stats.collections}
                        icon={<svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>}
                        accent="bg-cyan-50" />
                </div>

                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            <input
                                type="text"
                                placeholder="Search by heading, ID..."
                                value={filters.search}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setFilters(f => ({ ...f, search: e.target.value }))}
                                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                        </div>

                        <select
                            value={filters.type}
                            onChange={(e: ChangeEvent<HTMLSelectElement>) => setFilters(f => ({ ...f, type: e.target.value as FilterState["type"] }))}
                            className="px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
                        >
                            <option value="ALL">All Types</option>
                            {(["PRODUCT", "CATEGORY", "BANNER", "COLLECTION"] as ThumbnailType[]).map(t => (
                                <option key={t} value={t}>{TYPE_CONFIG[t].label}</option>
                            ))}
                        </select>

                        <select
                            value={filters.status}
                            onChange={(e: ChangeEvent<HTMLSelectElement>) => setFilters(f => ({ ...f, status: e.target.value as FilterState["status"] }))}
                            className="px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
                        >
                            <option value="ALL">All Status</option>
                            <option value="ACTIVE">Active</option>
                            <option value="INACTIVE">Inactive</option>
                        </select>

                        <select
                            value={sortKey}
                            onChange={(e: ChangeEvent<HTMLSelectElement>) => setSortKey(e.target.value as SortKey)}
                            className="px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
                        >
                            <option value="heading">Sort: Name</option>
                            <option value="type">Sort: Type</option>
                            <option value="isActive">Sort: Status</option>
                        </select>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-500">
                        Showing <span className="font-bold text-slate-700">{filtered.length}</span> of <span className="font-bold text-slate-700">{thumbnails.length}</span> thumbnails
                    </p>
                </div>
                        {filtered.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-24 text-center">
                                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                                    <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                </div>
                                <p className="text-slate-600 font-bold text-lg">No thumbnails found</p>
                                <p className="text-slate-400 text-sm mt-1">Try adjusting your filters or add a new thumbnail</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                                {
                                    isLoading ? <div className="w-full py-10 text-center">
                                        <p>Loading...</p>
                                    </div> : filtered.map(thumb => (
                                        <div onClick={() => { setDelete(thumb._id), setDel(true) }}>
                                            <ThumbnailCard
                                                key={thumb._id}
                                                thumb={thumb}
                                                onToggleActive={() => handleToggleActive(thumb._id)}
                                                onEdit={() => setModal({ mode: "edit", thumb })}
                                                onDelete={() => setDeleteTarget([thumb._id])}
                                            />
                                        </div>
                                    ))
                                }
                            </div>
                        )}
            </main>

            {modal && (
                <ThumbnailModal
                    thumb={modal.thumb ? modal.thumb : {} as IThumbnail}
                    onClose={() => setModal(null)}
                    onSave={handleSave}
                />
            )}
            {create && (
                <CreateThumbanail onClose={setCreate} />
            )}
            {(deleteTarget && del) && (
                <DeleteModal
                    id={deleteId}
                    count={deleteTarget.length}
                    onClose={setDel}
                />
            )}
        </div>
    );
};

export default ThumbnailManager;