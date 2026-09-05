import { useEffect, useState } from "react";
import { FileDown, ShieldCheck, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";

export function ExportDialog({ open, onOpenChange, onExport, exporting }) {
  const [roomName, setRoomName] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (open) {
      setRoomName("");
      setCustomerName("");
      setCreatedBy("");
      setTouched(false);
    }
  }, [open]);

  const roomNameValid = roomName.trim().length > 0;
  const nameValid = customerName.trim().length > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched(true);
    if (!roomNameValid || !nameValid || exporting) return;
    onExport({ roomName: roomName.trim(), customerName: customerName.trim(), createdBy: createdBy.trim() });
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !exporting && onOpenChange(next)}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileDown className="h-5 w-5 text-blue-600" />
            Export configuration
          </DialogTitle>
          <DialogDescription>
            These details personalize the header of your PDF report.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="rc-export-room-name" className="text-xs font-medium text-slate-600">
              Room name <span className="text-blue-600">*</span>
            </label>
            <input
              id="rc-export-room-name"
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="e.g. Executive Boardroom"
              autoFocus
              className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 shadow-sm outline-none transition-colors focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
            {touched && !roomNameValid && (
              <span className="text-xs font-medium text-red-500">Room name is required.</span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="rc-export-customer" className="text-xs font-medium text-slate-600">
              Customer name <span className="text-blue-600">*</span>
            </label>
            <input
              id="rc-export-customer"
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g. Acme Corporation"
              className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 shadow-sm outline-none transition-colors focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
            {touched && !nameValid && (
              <span className="text-xs font-medium text-red-500">Customer name is required.</span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="rc-export-author" className="text-xs font-medium text-slate-600">
              Created by <span className="text-slate-400">(optional)</span>
            </label>
            <input
              id="rc-export-author"
              type="text"
              value={createdBy}
              onChange={(e) => setCreatedBy(e.target.value)}
              placeholder="e.g. Your name"
              className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 shadow-sm outline-none transition-colors focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="flex items-start gap-2.5 rounded-lg border border-emerald-100 bg-emerald-50 px-3.5 py-3">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
            <p className="text-xs leading-relaxed text-emerald-800">
              Your privacy is protected: these details are used only to personalize the PDF generated in your
              browser. Nothing is saved, stored, or sent to any server — once you close this page, the
              information is gone.
            </p>
          </div>

          <div className="mt-1 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={exporting}
              className="flex min-h-[40px] items-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition-colors hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={exporting}
              className="flex min-h-[40px] items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-70 active:scale-[0.98]"
            >
              {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />}
              {exporting ? "Generating PDF…" : "Export PDF"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
