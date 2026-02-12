import { X, Clock } from 'lucide-react';

function ClosedModal({ isOpen, onClose, closedMessage }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-[#1a1a1a] rounded-2xl p-6 md:p-8 max-w-sm w-full border border-gray-800 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          aria-label="Cerrar"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center">
            <Clock className="w-8 h-8 text-red-500" />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-white text-xl font-bold text-center mb-2">
          No te queremos perder
        </h3>

        {/* Message */}
        <p className="text-gray-400 text-center mb-6">
          {closedMessage}
        </p>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-full transition-colors"
        >
          Entendido
        </button>
      </div>
    </div>
  );
}

export default ClosedModal;
