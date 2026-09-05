import { Monitor } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { DISPLAY_SIZES } from "../../lib/roomConfiguratorEngine";

export function DisplaySizeDialog({ open, onOpenChange, onChoose }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5 text-blue-600" />
            Choose display size
          </DialogTitle>
          <DialogDescription>Select a screen size, then click the grid to place it.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-3 gap-2 pt-1">
          {DISPLAY_SIZES.map((size) => (
            <button
              key={size}
              onClick={() => onChoose(size)}
              className="flex min-h-[64px] flex-col items-center justify-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-3 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 active:scale-[0.97]"
            >
              <span className="text-base font-semibold">{size}"</span>
              <span className="text-[11px] text-slate-400">diagonal</span>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
