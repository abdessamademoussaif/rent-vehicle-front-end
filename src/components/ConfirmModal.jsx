import { AlertTriangle } from "lucide-react";

export default function ConfirmModal({ open, title, onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 -top-10">
      <div className="bg-white p-6 rounded-xl shadow-2xl w-[360px] transition-all border border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="text-yellow-500" size={24} />
          <h2 className="text-lg font-medium text-gray-700">{title}</h2>
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
