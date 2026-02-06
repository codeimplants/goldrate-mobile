type SoftUpdateModalProps = {
    open: boolean;
    onUpdate: () => void;
    onSkip: () => void;
};

export default function SoftUpdateModal({
    open,
    onUpdate,
    onSkip,
}: SoftUpdateModalProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40">
            <div className="w-full max-w-md bg-white rounded-t-2xl p-6 animate-slideUp">
                <h2 className="text-xl font-semibold">Update Available</h2>
                <p className="text-gray-600 mt-2">
                    A new version of the app is available. Update now for the best experience.
                </p>

                <div className="flex gap-3 mt-5">
                    <button
                        onClick={onSkip}
                        className="flex-1 py-2 rounded-lg border border-gray-300 text-gray-700"
                    >
                        Later
                    </button>
                    <button
                        onClick={onUpdate}
                        className="flex-1 py-2 rounded-lg bg-blue-600 text-white"
                    >
                        Update
                    </button>
                </div>
            </div>
        </div>
    );
}
