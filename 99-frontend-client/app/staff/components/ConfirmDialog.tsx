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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <div className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
                <div className="px-6 py-5 border-b border-red-100 bg-red-50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-xl shadow-sm">
                            🗑️
                        </div>
                        <div>
                            <h2 className="text-red-800 font-bold">Delete Staff Member</h2>
                            <p className="text-red-500 text-xs font-medium mt-0.5">This action cannot be undone</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-white">
                    <p className="text-slate-600 text-sm font-medium leading-relaxed">
                        Are you sure you want to permanently delete{" "}
                        <span className="text-slate-800 font-bold">"{name}"</span> from the
                        system? All their data will be removed.
                    </p>

                    <div className="flex gap-3 mt-6">
                        <button
                            onClick={onCancel}
                            className="flex-1 py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-800 rounded-xl text-sm font-bold transition-all shadow-sm"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-md shadow-red-600/20 transition-all text-sm"
                        >
                            Yes, Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
