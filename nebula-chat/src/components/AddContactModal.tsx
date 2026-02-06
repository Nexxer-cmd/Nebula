import { useState } from "react";
import { X, UserPlus, Search } from "lucide-react";

interface AddContactModalProps {
  onClose: () => void;
  onAdd: (code: string) => Promise<void>;
}

export default function AddContactModal({ onClose, onAdd }: AddContactModalProps) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    
    setLoading(true);
    await onAdd(code);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden p-6 animate-in zoom-in-95">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <UserPlus className="text-indigo-600" size={24} /> Add Contact
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
              Share ID
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="NEB-XXXX"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none font-mono text-lg uppercase transition-colors"
                autoFocus
              />
            </div>
            <p className="text-xs text-gray-500 mt-2 ml-1">
              Enter the unique Nebula ID shared by your friend.
            </p>
          </div>

          <button
            type="submit"
            disabled={!code.trim() || loading}
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl font-bold text-lg shadow-lg shadow-indigo-200 transition-all active:scale-95"
          >
            {loading ? "Searching..." : "Add Friend"}
          </button>
        </form>
      </div>
    </div>
  );
}