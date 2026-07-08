import { useDeleteThumbnailByAdmin } from "../../context/api/thumbnails";

interface DeleteModalProps { id:string,count: number; onClose: (value:boolean) => void }
export const DeleteModal: React.FC<DeleteModalProps> = ({ id ,count, onClose }) => {

  const {mutate:deleteThumbnail,isPending} = useDeleteThumbnailByAdmin(() => onClose(false));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 text-center space-y-5">
        <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto">
          <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
        </div>
        <div>
          <h3 className="text-lg font-black text-slate-800">Delete {count > 1 ? `${count} Thumbnails` : "Thumbnail"}?</h3>
          <p className="text-sm text-slate-500 mt-1">This action cannot be undone. The {count > 1 ? "thumbnails" : "thumbnail"} will be permanently removed.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => onClose(false)} className="flex-1 cursor-pointer py-2.5 rounded-xl text-sm font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors">Cancel</button>
          <button disabled={isPending} onClick={() => {deleteThumbnail(id)}} className="flex-1 cursor-pointer py-2.5 rounded-xl text-sm font-bold text-white bg-red-500 hover:bg-red-600 transition-colors">{
            isPending ? "Deleting..." : "Delete"
            }
          </button>
        </div>
      </div>
    </div>
  )
}