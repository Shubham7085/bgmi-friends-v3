import { motion } from "framer-motion";
import { Camera, ChevronRight, ImageIcon } from "lucide-react";

interface GalleryImage {
  id: string;
  url: string;
  caption?: string;
  friendIgn?: string;
}

interface GalleryPreviewProps {
  images: GalleryImage[];
  onViewAll: () => void;
  totalCount: number;
}

export default function GalleryPreview({
  images,
  onViewAll,
  totalCount,
}: GalleryPreviewProps) {
  return (
    <div className="px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className="w-1 h-5 rounded-full"
            style={{ background: "linear-gradient(180deg, #EC4899, #A78BFA)" }}
          />
          <span
            className="text-xs font-black uppercase tracking-widest"
            style={{ color: "#EC4899" }}
          >
            Gallery
          </span>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onViewAll}
          className="flex items-center gap-1 text-xs font-bold"
          style={{ color: "#00F0FF" }}
        >
          View All ({totalCount})
          <ChevronRight size={12} />
        </motion.button>
      </div>

      {/* Scroll container */}
      <div className="overflow-x-auto no-scrollbar -mx-1 px-1">
        <div className="flex gap-3 pb-2" style={{ width: "max-content" }}>
          {images.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center rounded-2xl gap-2"
              style={{
                width: 140,
                height: 180,
                background: "rgba(255,255,255,0.03)",
                border: "1px dashed rgba(255,255,255,0.1)",
              }}
            >
              <ImageIcon size={24} className="text-gray-600" />
              <span className="text-[10px] text-gray-600">No photos yet</span>
            </motion.div>
          ) : (
            images.slice(0, 6).map((img, i) => (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.08 * i }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="relative rounded-2xl overflow-hidden flex-shrink-0"
                style={{
                  width: 130,
                  height: 170,
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <img
                  src={img.url}
                  alt={img.caption ?? "Memory"}
                  className="w-full h-full object-cover"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                {/* Caption */}
                <div className="absolute bottom-0 left-0 right-0 p-2">
                  {img.friendIgn && (
                    <div className="text-[9px] font-bold text-cyan-400 mb-0.5">
                      @{img.friendIgn}
                    </div>
                  )}
                  {img.caption && (
                    <div className="text-[10px] text-white/80 leading-tight line-clamp-2">
                      {img.caption}
                    </div>
                  )}
                </div>

                {/* Top glow */}
                <div
                  className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center"
                  style={{
                    background: "rgba(0,0,0,0.5)",
                    backdropFilter: "blur(4px)",
                  }}
                >
                  <Camera size={10} className="text-white/60" />
                </div>
              </motion.div>
            ))
          )}

          {/* "More" card */}
          {totalCount > 6 && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ y: -4 }}
              onClick={onViewAll}
              className="relative rounded-2xl flex-shrink-0 flex flex-col items-center justify-center gap-2"
              style={{
                width: 130,
                height: 170,
                background:
                  "linear-gradient(135deg, rgba(0,240,255,0.06), rgba(139,92,246,0.06))",
                border: "1px solid rgba(0,240,255,0.15)",
              }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-black"
                style={{
                  background: "rgba(0,240,255,0.1)",
                  color: "#00F0FF",
                  border: "1px solid rgba(0,240,255,0.3)",
                }}
              >
                +{totalCount - 6}
              </div>
              <span className="text-xs text-gray-400">More</span>
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}
