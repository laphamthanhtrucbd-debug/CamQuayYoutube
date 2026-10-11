import React, { useState } from 'react';
import { CapturedMediaItem } from '../../types/effects';
import { Download, Trash2, Play, Image as ImageIcon, X } from 'lucide-react';
import { triggerFileDownload } from '../../recording/photoCapture';

interface GalleryProps {
  items: CapturedMediaItem[];
  onDelete: (id: string) => void;
}

export const Gallery: React.FC<GalleryProps> = ({ items, onDelete }) => {
  const [selectedItem, setSelectedItem] = useState<CapturedMediaItem | null>(null);

  if (items.length === 0) {
    return (
      <div className="p-4 bg-zinc-900/50 border border-zinc-800/80 rounded-2xl text-center">
        <p className="text-xs text-zinc-400">
          Chưa có ảnh hoặc video nào được lưu trong phiên này. Nhấn <strong className="text-zinc-200">Chụp ảnh</strong> hoặc <strong className="text-zinc-200">Bắt đầu quay</strong> để ghi lại hình ảnh đã qua xử lý làm đẹp.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-zinc-300">
          <span className="font-semibold text-zinc-100">Thư viện phiên làm việc</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono-num text-zinc-400">{items.length} tệp</span>
        </div>
        <span className="text-[11px] text-zinc-500">
          Nhấn vào ảnh/video để xem trước hoặc tải xuống máy
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="group relative aspect-video bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden"
          >
            {item.type === 'photo' ? (
              <img
                src={item.url}
                alt={item.filename}
                onClick={() => setSelectedItem(item)}
                className="w-full h-full object-cover cursor-pointer group-hover:scale-105 transition-transform"
              />
            ) : (
              <div
                onClick={() => setSelectedItem(item)}
                className="w-full h-full relative cursor-pointer"
              >
                <video
                  src={item.url}
                  preload="metadata"
                  onLoadedData={(e) => {
                    const v = e.currentTarget;
                    if (v.currentTime === 0) {
                      v.currentTime = 0.05;
                    }
                  }}
                  className="w-full h-full object-cover"
                  muted
                  playsInline
                />
                <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
                  <Play className="w-6 h-6 text-white fill-white" />
                </div>
              </div>
            )}

            <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/85 via-black/50 to-transparent flex items-center justify-between text-[11px] text-zinc-200">
              <div className="flex items-center gap-1 truncate">
                {item.type === 'photo' ? (
                  <ImageIcon className="w-3 h-3 text-rose-400 shrink-0" />
                ) : (
                  <Play className="w-3 h-3 text-rose-400 shrink-0" />
                )}
                <span className="font-mono-num truncate">
                  {item.type === 'video' && item.durationSec ? `${item.durationSec}s` : item.timestamp}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerFileDownload(item.url, item.filename);
                  }}
                  title="Lưu xuống máy tính"
                  className="p-1 hover:text-rose-400 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(item.id);
                    if (selectedItem?.id === item.id) setSelectedItem(null);
                  }}
                  title="Xóa khỏi danh sách"
                  className="p-1 hover:text-red-400 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-6"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden p-4 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2 text-xs text-zinc-300">
                <span className="font-semibold text-zinc-100">{selectedItem.filename}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono-num text-zinc-400">{selectedItem.timestamp}</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="p-1.5 text-zinc-400 hover:text-white rounded-lg bg-zinc-900 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="aspect-video bg-black rounded-xl overflow-hidden flex items-center justify-center">
              {selectedItem.type === 'photo' ? (
                <img
                  src={selectedItem.url}
                  alt={selectedItem.filename}
                  className="max-h-[70vh] w-auto object-contain"
                />
              ) : (
                <video
                  src={selectedItem.url}
                  controls
                  autoPlay
                  className="max-h-[70vh] w-auto object-contain"
                />
              )}
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => triggerFileDownload(selectedItem.url, selectedItem.filename)}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Lưu xuống máy tính ({selectedItem.filename})</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
