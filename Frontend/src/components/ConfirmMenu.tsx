interface ConfirmModalProps {
  title: string;
  message: string;
  confirmText: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmColor?: string;
}

export default function ConfirmModal({
  title,
  message,
  confirmText,
  onConfirm,
  onCancel,
  confirmColor,
}: ConfirmModalProps) {
  return (
    <div className="fixed inset-0 items-center justify-center z-50 bg-black/50 flex">
      <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md">

        <h2 className="text-lg font-semibold mb-4">{title}</h2>

        <p className="mb-5">{message}</p>

        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 font-medium rounded ${confirmColor || 'bg-red-500 hover:bg-red-700 text-white'}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
