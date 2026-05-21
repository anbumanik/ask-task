import React from 'react';
import { AlertTriangle } from 'lucide-react';

const ConfirmModal = React.memo(({ isOpen, onClose, onConfirm, title, message, isLoading = false }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
      ></div>

      {/* Modal Box */}
      <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl border border-rose-500/20 bg-slate-900/90 text-left align-middle shadow-2xl transition-all glass-panel">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{title}</h3>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">{message}</p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 border-t border-slate-800/40 bg-slate-950/40 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-xl border border-slate-700 bg-slate-800/40 px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-slate-800 hover:text-slate-100 transition-all"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-500 active:bg-rose-700 shadow-lg shadow-rose-600/20 disabled:opacity-55 transition-all"
          >
            {isLoading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Deleting...
              </>
            ) : (
              'Delete Employee'
            )}
          </button>
        </div>
      </div>
    </div>
  );
});

ConfirmModal.displayName = 'ConfirmModal';

export default ConfirmModal;
