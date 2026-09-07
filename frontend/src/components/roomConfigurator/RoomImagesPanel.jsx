import { useRef } from "react";
import { Camera, ImagePlus, X } from "lucide-react";

export function RoomImagesPanel({ images, onAddImages, onRemoveImage }) {
  const inputRef = useRef(null);

  const handleFilesSelected = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length) onAddImages(files);
    // Reset so selecting the exact same file(s) again later still fires onChange.
    e.target.value = "";
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-800">
          <Camera className="h-4 w-4 text-blue-600" />
          Room photos {images.length > 0 && <span className="text-slate-400">({images.length})</span>}
        </h2>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex min-h-[40px] items-center gap-2 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 active:scale-[0.97]"
        >
          <ImagePlus className="h-3.5 w-3.5" />
          Add room images
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFilesSelected}
          className="hidden"
        />
      </div>

      <p className="mt-2 text-xs text-slate-400">
        Shoot photos of the actual room or pick them from your gallery — up to your device's picker. They're
        added to the PDF report (2 per page) and are never uploaded or stored anywhere; closing this page discards them.
      </p>

      {images.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {images.map((img, i) => (
            <div
              key={img.id}
              className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-slate-200 bg-slate-100"
            >
              <img src={img.previewUrl} alt={`Room photo ${i + 1}`} className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => onRemoveImage(img.id)}
                aria-label="Remove photo"
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900/70 text-white opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
