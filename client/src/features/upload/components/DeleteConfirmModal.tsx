import { AlertTriangle, X } from "lucide-react";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, loading }: DeleteModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-start mb-4">
          <div className="bg-red-50 p-3 rounded-2xl text-red-600">
            <AlertTriangle size={24} />
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        <h3 className="text-xl font-bold text-slate-900 mb-2">Brisanje nalaza</h3>
        <p className="text-slate-500 mb-6 leading-relaxed">
          Da li ste sigurni? Ova akcija je trajna i nećete moći da povratite podatke iz ovog nalaza.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Odustani
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-3 px-4 rounded-xl font-semibold bg-red-500 hover:bg-red-600 text-white transition-all shadow-lg shadow-red-200 active:scale-95 disabled:opacity-50"
          >
            {loading ? "Brišem..." : "Obriši"}
          </button>
        </div>
      </div>
    </div>
  );
};