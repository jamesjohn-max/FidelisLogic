import { Video, Radar } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { CAMERA_FOVS } from "../../lib/roomConfiguratorEngine";

export function CameraFovDialog({ open, onOpenChange, onChoose, onChooseTableCam }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Video className="h-5 w-5 text-blue-600" />
            Choose camera field of view
          </DialogTitle>
          <DialogDescription>Select a FOV, then click the grid to place the camera.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-3 gap-2 pt-1">
          {CAMERA_FOVS.map((fov) => (
            <button
              key={fov}
              onClick={() => onChoose(fov)}
              className="flex min-h-[64px] flex-col items-center justify-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-3 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 active:scale-[0.97]"
            >
              <span className="text-base font-semibold">{fov}°</span>
              <span className="text-[11px] text-slate-400">FOV</span>
            </button>
          ))}
        </div>
        <div className="pt-1">
          <button
            onClick={onChooseTableCam}
            className="flex min-h-[56px] w-full items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-3 text-left shadow-sm transition-colors hover:border-blue-400 hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 active:scale-[0.99]"
          >
            <Radar className="h-5 w-5 shrink-0 text-blue-600" />
            <span>
              <span className="block text-sm font-semibold text-slate-800">Neat 360° Table Camera</span>
              <span className="block text-xs text-slate-500">Full-room coverage from the center of the table</span>
            </span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
