'use client';

import { X, Download, FileText, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { DownloadResource } from '@/types/database';

interface PDFViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  resource: DownloadResource | null;
}

export function PDFViewerModal({ isOpen, onClose, resource }: PDFViewerModalProps) {
  if (!isOpen || !resource) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-[12px] shadow-2xl border border-[#E2E8F0] w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="bg-[#003D60] text-white p-4 sm:p-6 flex items-center justify-between border-b border-[#005A8D] shrink-0">
          <div className="flex items-center gap-3 pr-4">
            <div className="w-10 h-10 rounded-[8px] bg-[#86C127] text-white flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-white leading-tight line-clamp-1">
                {resource.title}
              </h3>
              <p className="text-xs text-slate-300">
                Category: <span className="text-[#86C127] font-semibold">{resource.category}</span> • Size: {resource.file_size || 'PDF Document'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a href={resource.file_url} download target="_blank" rel="noopener noreferrer">
              <Button size="sm" className="bg-[#E67817] hover:bg-[#d56d13] text-white font-bold text-xs">
                <Download className="w-4 h-4 mr-1.5" /> Download PDF
              </Button>
            </a>
            <button
              onClick={onClose}
              className="p-2 rounded-[6px] hover:bg-white/10 text-slate-200 hover:text-white transition-colors"
              aria-label="Close PDF Viewer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Modal Body: Embedded PDF iframe */}
        <div className="flex-1 bg-slate-100 relative overflow-hidden">
          <iframe
            src={resource.file_url}
            title={resource.title}
            className="w-full h-full border-none"
          />
        </div>

        {/* Modal Footer Bar */}
        <div className="p-3 bg-white border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#64748B] shrink-0 px-6">
          <span>Official e-CAPH PDF Publication</span>
          <a
            href={resource.file_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0092DF] hover:underline font-bold inline-flex items-center gap-1"
          >
            Open in new tab <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
