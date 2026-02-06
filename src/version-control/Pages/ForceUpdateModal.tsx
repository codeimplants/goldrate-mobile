type ForceUpdateModalProps = {
    open: boolean;
    onUpdate: () => void;
};

export default function ForceUpdateModal({
    open,
    onUpdate,
}: ForceUpdateModalProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
            <div className="text-center max-w-sm p-6">
                <h2 className="text-2xl font-bold text-red-600">Update Required</h2>
                <p className="text-gray-600 mt-3">
                    Your app version is no longer supported.
                    Please update to continue using the app.
                </p>

                <button
                    onClick={onUpdate}
                    className="mt-6 w-full py-3 rounded-xl bg-red-600 text-white font-semibold"
                >
                    Update Now
                </button>
            </div>
        </div>
    );
}
