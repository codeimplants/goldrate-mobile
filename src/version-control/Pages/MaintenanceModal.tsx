type MaintenanceModalProps = {
    open: boolean;
};

export default function MaintenanceModal({
    open,
}: MaintenanceModalProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
            <div className="text-center text-black max-w-sm p-6">
                <h2 className="text-2xl font-bold">We’ll Be Back Soon</h2>
                <p className="mt-3 text-black">
                    The app is currently under maintenance.
                    Please try again later.
                </p>
            </div>
        </div>
    );
}
