"use client";

export default function ConfirmDialog({
    name,
    onConfirm,
    onCancel,
}: {
    name: string;
    onConfirm: () => void;
    onCancel: () => void;
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-800 bg-red-900/20">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center text-xl">
                            🗑️
                        </div>
                        <div>
                            <h2 className="text-white font-bold">Delete Staff Member</h2>
                            <p className="text-slate-400 text-sm">This action cannot be undone</p>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    <p className="text-slate-300 text-sm leading-relaxed">
                        Are you sure you want to permanently delete{" "}
                        <span className="text-white font-semibold">{name}</span> from the
                        system? All their data will be removed.
                    </p>

                    <div className="flex gap-3 mt-5">
                        <button
                            onClick={onCancel}
                            className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white rounded-xl text-sm font-medium transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className="flex-1 py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-semibold rounded-xl shadow-lg shadow-red-900/30 transition-all text-sm"
                        >
                            Yes, Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
