import React from 'react'
import { useState } from 'react';
import type { OrderStatus } from '../../../Types/order';
import { STATUS_META } from '../../admin/order/PageComponent';
import { useUpdateOrderStatus } from '../../../context/api/order';

interface props {
  id: string,
  onClose: (value: boolean) => void;
  current: OrderStatus
}

const ORDER_STATUSES: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "RETURNED",
];

const UpdateStatus: React.FC<props> = ({ id, onClose, current }) => {

  const [selected, setSelected] = useState<OrderStatus>(current);
  const {mutate:udpateStatus,isPending} = useUpdateOrderStatus(() => onClose(false));
  const [reason, setReason] = useState("");


  const needsReason = selected === "CANCELLED" || selected === "RETURNED";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-blue-950/40 backdrop-blur-sm" onClick={() => onClose(false)}/>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className=" from-blue-700 to-blue-500 px-6 py-4 flex items-center justify-between">
          <h3 className="text-white font-bold">Update Order Status</h3>
          <button onClick={() => onClose(false)} className="text-blue-200 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {ORDER_STATUSES.map((s) => {
              const m = STATUS_META[s];
              const isSelected = selected === s;
              return (
                <button
                  key={s}
                  onClick={() => setSelected(s)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all text-left ${isSelected
                    ? `${m.bg} ${m.color} ${m.border}`
                    : "bg-white border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-600"
                    }`}
                >
                  <span className={`w-2 h-2 rounded-full  ${m.dot}`} />
                  {m.label}
                </button>
              );
            })}
          </div>

          {needsReason && (
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Reason <span className="text-red-400">*</span>
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={`Why is this order being ${selected.toLowerCase()}?`}
                rows={3}
                className="w-full text-sm border border-blue-200 rounded-xl px-3 py-2.5 text-blue-900 placeholder:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
              />
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button
              onClick={() => onClose(false)}
              className="flex-1 py-2.5 border border-blue-200 text-blue-600 text-sm font-semibold rounded-xl hover:bg-blue-50 transition-colors"
            >
              Cancel
            </button>
            <button
              disabled={isPending}
              onClick={() =>{udpateStatus({orderId:id,status:selected})}}
              className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-colors"
            >
              {isPending ? "Updateing..." : "Apply Update"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateStatus