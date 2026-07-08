import { TypeBadge,StatusToggle } from "./Elemet";
import type { IThumbnail } from "../../Types/thumbnail";

interface ThumbnailCardProps {
  thumb: IThumbnail;
  onToggleActive: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const ThumbnailCard: React.FC<ThumbnailCardProps> = ({ thumb, onToggleActive, onEdit, onDelete }) => (
  <div className={`group relative bg-white rounded-2xl border shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 border-slate-100`}>
    <div className="absolute top-3 right-3 z-10">
      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${thumb.isActive ? "bg-green-100 text-green-700 border border-green-200" : "bg-slate-100 text-slate-500 border border-slate-200"}`}>
        {thumb.isActive ? "Live" : "Off"}
      </span>
    </div>

    <div className="relative h-44 overflow-hidden bg-slate-100">
      <img src={thumb.url} alt={thumb.heading ?? thumb.publicId} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
      <div className="absolute inset-x-0 bottom-0 h-20  from-black/50 to-transparent" />
      <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
        <span className="w-3 h-3 rounded-full border-2 border-white shadow" style={{ backgroundColor: thumb.color }} />
        <span className="text-black text-[10px] font-mono opacity-80">{thumb.color}</span>
      </div>
    </div>

    <div className="p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-bold text-slate-800 text-sm truncate">{thumb.heading || "—"}</p>
          <p className="text-xs text-slate-400 truncate mt-0.5">{thumb.paragraph || "No description"}</p>
        </div>
        <TypeBadge type={thumb.type} />
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-slate-100">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-slate-400 font-mono truncate max-w-24">{thumb.publicId}</span>
        </div>
        <div className="flex items-center gap-1">
          <StatusToggle isActive={thumb.isActive} onToggle={onToggleActive} />
          <button onClick={onEdit} className="ml-2 p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
          </button>
          <button onClick={onDelete} className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default ThumbnailCard