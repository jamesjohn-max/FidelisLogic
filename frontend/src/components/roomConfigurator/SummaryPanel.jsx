import { useMemo, useState } from "react";
import { Copy, Check, ClipboardList } from "lucide-react";
import { toast } from "../ui/sonner";
import { buildConfigBrief, LAYOUTS, DEVICE_LABELS, CAMERA_FEATURES, refCode } from "../../lib/roomConfiguratorEngine";

function StatRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 py-1.5 text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-slate-800">{value}</span>
    </div>
  );
}

export function SummaryPanel({ state }) {
  const [copied, setCopied] = useState(false);
  const brief = useMemo(() => buildConfigBrief(state), [state]);
  const layoutLabel = LAYOUTS.find((l) => l.id === state.layout)?.label || state.layout;
  const { room, table, chairCount, devices } = state;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(brief);
      setCopied(true);
      toast.success("Configuration copied to clipboard");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Couldn't copy — select and copy the text manually");
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-800">
          <ClipboardList className="h-4 w-4 text-blue-600" />
          Configuration brief
        </h2>
        <button
          onClick={handleCopy}
          className="flex min-h-[40px] items-center gap-2 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 active:scale-[0.97]"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy configuration"}
        </button>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">Room</h3>
          <StatRow label="Size" value={`${room.length.toFixed(1)} × ${room.width.toFixed(1)} × ${room.height.toFixed(1)} m`} />
          <StatRow label="Layout" value={layoutLabel} />
          <StatRow label="Seating" value={`${chairCount} chairs`} />
          <StatRow label="Walls" value={state.wallMaterials?.join(", ") || "None selected"} />
          <StatRow label="Floor" value={state.floorType} />
          <StatRow label="Ceiling" value={state.ceilingType} />
        </div>
        <div>
          <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">Table</h3>
          <StatRow label="Size" value={`${table.length.toFixed(1)} × ${table.width.toFixed(1)} m`} />
          <StatRow label="Orientation" value={table.orientation === 0 ? "Landscape" : "Portrait"} />
          <StatRow label="Top" value={state.tableTopMaterial} />
          <StatRow label="Platform" value={state.platform} />
        </div>
        <div>
          <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">Devices</h3>
          <StatRow label={DEVICE_LABELS.display} value={devices.display.length ? `${devices.display.map((d, i) => `${refCode("display", i)}: ${d.sizeInches}"`).join(", ")}` : "0"} />
          <StatRow label={DEVICE_LABELS.camera} value={devices.camera.length ? `${devices.camera.map((c, i) => `${refCode("camera", i)}: ${c.isTableCam ? "Neat 360°" : `${c.fov}°`}`).join(", ")}` : "0"} />
          <StatRow
            label="Camera features"
            value={
              state.cameraFeatures?.length
                ? state.cameraFeatures.map((id) => CAMERA_FEATURES.find((f) => f.id === id)?.label || id).join(", ")
                : "None selected"
            }
          />
          <StatRow label={DEVICE_LABELS.microphone} value={devices.microphone.length ? `${devices.microphone.map((_, i) => refCode("microphone", i)).join(", ")} — ${state.audioPreference}` : "0"} />
          <StatRow label={DEVICE_LABELS.speaker} value={devices.speaker.length ? `${devices.speaker.map((_, i) => refCode("speaker", i)).join(", ")}` : "0"} />
        </div>
        <div>
          <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">Room controls</h3>
          <StatRow label={DEVICE_LABELS.touchPanel} value={devices.touchPanel.length ? devices.touchPanel.map((_, i) => refCode("touchPanel", i)).join(", ") : "Not included"} />
          <StatRow label={DEVICE_LABELS.contentSharing} value={devices.contentSharing.length ? devices.contentSharing.map((_, i) => refCode("contentSharing", i)).join(", ") : "Not included"} />
          <StatRow label={DEVICE_LABELS.door} value={devices.door.length ? devices.door.map((d, i) => `${refCode("door", i)}: ${d.edge}`).join(", ") : "0"} />
          <StatRow label={DEVICE_LABELS.bookingPanel} value={devices.bookingPanel.length ? devices.bookingPanel.map((d, i) => `${refCode("bookingPanel", i)}: ${d.edge}`).join(", ") : "Not included"} />
        </div>
      </div>

      <details className="mt-4 rounded-lg border border-slate-100 bg-slate-50 open:pb-3">
        <summary className="cursor-pointer select-none px-3 py-2.5 text-xs font-semibold text-slate-500 hover:text-slate-700">
          View full text brief
        </summary>
        <pre className="mx-3 mt-1 max-h-72 overflow-auto whitespace-pre-wrap rounded-md bg-white p-3 text-xs leading-relaxed text-slate-600">{brief}</pre>
      </details>
    </div>
  );
}
