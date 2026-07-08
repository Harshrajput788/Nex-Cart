import { Plus } from "lucide-react";
import type { ThumbnailType ,IThumbnail} from "../../Types/thumbnail";
import { useState } from "react";
import { useUpdateThumbnailsByAdmin } from "../../context/api/thumbnails";

interface StatCardProps { label: string; value: number | string; icon: React.ReactNode; accent: string }
export const StatCard: React.FC<StatCardProps> = ({ label, value, icon, accent }) => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${accent}`}>{icon}</div>
    <div>
      <p className="text-2xl font-black text-slate-800 leading-none">{value}</p>
      <p className="text-xs text-slate-500 mt-1 font-medium">{label}</p>
    </div>
  </div>
);


const TYPE_CONFIG: Record<ThumbnailType, { label: string; color: string; bg: string; dot: string }> = {
  PRODUCT:    { label: "Product",    color: "text-blue-700",   bg: "bg-blue-50 border-blue-200",   dot: "bg-blue-500"   },
  CATEGORY:   { label: "Category",   color: "text-sky-700",    bg: "bg-sky-50 border-sky-200",     dot: "bg-sky-500"    },
  BANNER:     { label: "Banner",     color: "text-indigo-700", bg: "bg-indigo-50 border-indigo-200", dot: "bg-indigo-500" },
  COLLECTION: { label: "Collection", color: "text-cyan-700",   bg: "bg-cyan-50 border-cyan-200",   dot: "bg-cyan-500"   },
};



interface TypeBadgeProps { type: ThumbnailType }
export const TypeBadge: React.FC<TypeBadgeProps> = ({ type }) => {
  const cfg = TYPE_CONFIG[type];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.bg} ${cfg.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
};

interface StatusToggleProps { isActive: boolean; onToggle: () => void }
export const StatusToggle: React.FC<StatusToggleProps> = ({ isActive, onToggle }) => (
  <button
    onClick={onToggle}
    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 ${
      isActive ? "bg-blue-600" : "bg-slate-200"
    }`}
    aria-label="Toggle active status"
  >
    <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${isActive ? "translate-x-4" : "translate-x-0.5"}`} />
  </button>
);

interface ModalProps {
  thumb: Partial<IThumbnail> ;
  onClose: () => void;
  onSave: (data: Partial<IThumbnail>) => void;
}

export const ThumbnailModal: React.FC<ModalProps> = ({ thumb, onClose }) => {
  const [form, setForm] = useState<Partial<IThumbnail>>({
    _id:"",
    heading: "",
    paragraph: "",
    type: "BANNER",
    color: "#2563eb",
    isActive: true,
    url: "",
    publicId: "",
    categoryId: "",
    createdBy: "admin",
    ...thumb,
  });

  const {mutate:updateThum,isPending} = useUpdateThumbnailsByAdmin(() => onClose)

  const inputCls = "w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all";

  const setF = <K extends keyof IThumbnail>(k: K, v: IThumbnail[K]) =>
    setForm(p => ({ ...p, [k]: v }));


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

        <div className="p-6 space-y-4">
          {form.url && (
            <div className="relative h-36 rounded-2xl overflow-hidden bg-slate-100">
              <img src={form.url} alt="preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0  from-black/40 to-transparent" />
              <div className="absolute bottom-2 left-3 flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full border-2 border-white" style={{ backgroundColor: form.color }} />
                <span className="text-white text-xs font-semibold">{form.heading}</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Image URL <span className="text-blue-500">*</span></label>
              <input type="url" value={form.url} onChange={e => setF("url", e.target.value)} placeholder="https://..." className={inputCls} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Public ID <span className="text-blue-500">*</span></label>
              <input type="text" value={form.publicId} onChange={e => setF("publicId", e.target.value)} placeholder="thumb_001" className={inputCls} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Type <span className="text-blue-500">*</span></label>
              <select value={form.type} onChange={e => setF("type", e.target.value as ThumbnailType)} className={`${inputCls} cursor-pointer`}>
                {(["PRODUCT", "CATEGORY", "BANNER", "COLLECTION"] as ThumbnailType[]).map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Heading</label>
              <input type="text" value={form.heading} onChange={e => setF("heading", e.target.value)} placeholder="Banner title" className={inputCls} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Category ID</label>
              <input type="text" readOnly value={form.categoryId as string} placeholder="cat_001" className={`${inputCls} outline-none ring-none`} />
            </div>
            <div className="col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Paragraph</label>
              <textarea value={form.paragraph} onChange={e => setF("paragraph", e.target.value)} rows={2} placeholder="Short description..." className={`${inputCls} resize-none`} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Accent Color</label>
              <div className="flex items-center gap-2">
                <input type="color" value={form.color} onChange={e => setF("color", e.target.value)} className="w-10 h-10 rounded-xl border border-slate-200 cursor-pointer p-1" />
                <input type="text" value={form.color} onChange={e => setF("color", e.target.value)} className={`${inputCls} font-mono`} />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Status</label>
              <div className="flex items-center gap-3 mt-2">
                <StatusToggle isActive={form.isActive ?? true} onToggle={() => setF("isActive", !form.isActive)} />
                <span className={`text-sm font-semibold ${form.isActive ? "text-green-600" : "text-slate-400"}`}>
                  {form.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button disabled={isPending} onClick={() => {updateThum(form)}} className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-200 transition-colors flex items-center gap-2">
            <Plus size={20}/>
             {
              isPending ? "Updating...." : "Update"
            }
          </button>
        </div>
      </div>
    </div>
  );
};