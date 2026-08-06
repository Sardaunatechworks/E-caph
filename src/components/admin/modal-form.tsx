'use client';

import { X } from 'lucide-react';

interface ModalFormProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function ModalForm({ isOpen, onClose, title, children }: ModalFormProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs font-sans animate-in fade-in-50 duration-150">
      <div className="bg-white rounded-[10px] border border-[#E2E8F0] brand-shadow-lg w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F7FAF8]">
          <h3 className="text-lg font-bold text-[#0092DF]">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-[4px] hover:bg-slate-200 text-[#64748B] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
}
