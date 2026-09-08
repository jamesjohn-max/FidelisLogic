import { useState } from "react";
import {
  ChevronDown,
  Plus,
  Minus,
  Check,
  RectangleHorizontal,
  Circle,
  Users,
  Rows3,
  AlignJustify,
  Grid2x2,
  Monitor,
  Video,
  Mic,
  Speaker,
  Tablet,
  Share2,
  DoorOpen,
  CalendarCheck2,
} from "lucide-react";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "../ui/collapsible";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import {
  LAYOUTS,
  PLATFORMS,
  AUDIO_PREFERENCES,
  WALL_MATERIALS,
  FLOOR_TYPES,
  CEILING_TYPES,
  TABLE_TOP_MATERIALS,
  DEVICE_LABELS,
  DEVICE_ORDER,
  CAMERA_FEATURES,
} from "../../lib/roomConfiguratorEngine";
import {
  TrackActiveSpeakerIllustration,
  StaticWideViewIllustration,
  MultiSpeakerFramingIllustration,
  IndividualTilesIllustration,
} from "./cameraFeatureIllustrations";

const CAMERA_FEATURE_ILLUSTRATIONS = {
  trackActiveSpeaker: TrackActiveSpeakerIllustration,
  staticWideView: StaticWideViewIllustration,
  multiSpeakerFraming: MultiSpeakerFramingIllustration,
  individualTiles: IndividualTilesIllustration,
};

const LAYOUT_ICONS = {
  rectangular: RectangleHorizontal,
  oval: Circle,
  ushape: Users,
  classroom: Rows3,
  theater: AlignJustify,
  collaboration: Grid2x2,
};

const DEVICE_ICONS = {
  display: Monitor,
  camera: Video,
  microphone: Mic,
  speaker: Speaker,
  touchPanel: Tablet,
  contentSharing: Share2,
  door: DoorOpen,
  bookingPanel: CalendarCheck2,
};

function Section({ title, summary, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Collapsible open={open} onOpenChange={setOpen} className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <CollapsibleTrigger asChild>
        <button
          type="button"
          className="flex min-h-[52px] w-full items-center justify-between gap-3 rounded-xl px-4 py-3 text-left transition-colors hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 active:bg-slate-100"
        >
          <span>
            <span className="block text-sm font-semibold text-slate-800">{title}</span>
            {summary && <span className="block text-xs text-slate-500">{summary}</span>}
          </span>
          <ChevronDown className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
        <div className="border-t border-slate-100 px-4 py-4">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  );
}

function DeviceRow({ category, count, onAdd, onRemove }) {
  const Icon = DEVICE_ICONS[category];
  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          <Icon className="h-4 w-4" />
        </span>
        <span className="text-sm font-medium text-slate-700">{DEVICE_LABELS[category]}</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label={`Remove ${DEVICE_LABELS[category]}`}
          onClick={() => onRemove(category)}
          disabled={count === 0}
          className="flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-slate-500 transition-transform duration-100 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 disabled:cursor-not-allowed disabled:opacity-30 disabled:active:scale-100 active:scale-90 active:bg-slate-200"
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        <span className="w-6 text-center text-sm font-semibold tabular-nums text-slate-800">{count}</span>
        <button
          type="button"
          aria-label={`Add ${DEVICE_LABELS[category]}`}
          onClick={() => onAdd(category)}
          className="flex h-9 w-9 items-center justify-center rounded-md border border-blue-200 bg-blue-50 text-blue-700 transition-transform duration-100 hover:bg-blue-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 active:scale-90 active:bg-blue-200"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

export function ControlsPanel({
  layout,
  onLayoutChange,
  devices,
  onAddDevice,
  onRemoveDevice,
  platform,
  onPlatformChange,
  audioPreference,
  onAudioPreferenceChange,
  wallMaterials,
  onToggleWallMaterial,
  floorType,
  onFloorTypeChange,
  ceilingType,
  onCeilingTypeChange,
  tableTopMaterial,
  onTableTopMaterialChange,
  cameraFeatures,
  onToggleCameraFeature,
  additionalNotes,
  onAdditionalNotesChange,
}) {
  const deviceSectionOrder = DEVICE_ORDER.filter((c) => c !== "door");
  const totalDevices = deviceSectionOrder.reduce((sum, c) => sum + devices[c].length, 0);
  const currentLayout = LAYOUTS.find((l) => l.id === layout);

  return (
    <div className="flex flex-col gap-3">
      <Section title="Furniture layout" summary={currentLayout?.label}>
        <div className="grid grid-cols-2 gap-2">
          {LAYOUTS.map((l) => {
            const Icon = LAYOUT_ICONS[l.id];
            const active = l.id === layout;
            return (
              <button
                key={l.id}
                type="button"
                onClick={() => onLayoutChange(l.id)}
                aria-pressed={active}
                className={`flex min-h-[44px] flex-col items-start gap-1.5 rounded-lg border px-3 py-2.5 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 active:scale-[0.98] ${
                  active
                    ? "border-blue-500 bg-blue-50 text-blue-800 shadow-sm"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <Icon className={`h-4 w-4 ${active ? "text-blue-600" : "text-slate-400"}`} />
                <span className="text-xs font-semibold leading-tight">{l.label}</span>
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-xs leading-relaxed text-slate-400">{currentLayout?.hint}</p>
      </Section>

      <Section
        title="Room finishes"
        summary={`${wallMaterials.length} wall material${wallMaterials.length === 1 ? "" : "s"}, ${floorType.split(" / ")[0]} floor`}
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-600">Wall material (select one or more)</label>
            <div className="flex flex-wrap gap-1.5">
              {WALL_MATERIALS.map((m) => {
                const active = wallMaterials.includes(m);
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => onToggleWallMaterial(m)}
                    aria-pressed={active}
                    className={`flex min-h-[36px] items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 active:scale-[0.97] ${
                      active
                        ? "border-blue-500 bg-blue-50 text-blue-800"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    {active && <Check className="h-3 w-3" />}
                    {m}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-600">Floor</label>
            <Select value={floorType} onValueChange={onFloorTypeChange}>
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FLOOR_TYPES.map((f) => (
                  <SelectItem key={f} value={f}>{f}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-600">Ceiling</label>
            <Select value={ceilingType} onValueChange={onCeilingTypeChange}>
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CEILING_TYPES.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-600">Conference table top</label>
            <Select value={tableTopMaterial} onValueChange={onTableTopMaterialChange}>
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TABLE_TOP_MATERIALS.map((m) => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Section>

      <Section title="Platform &amp; audio" summary={platform}>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-600">Conferencing platform</label>
            <Select value={platform} onValueChange={onPlatformChange}>
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PLATFORMS.map((p) => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-600">Audio preference</label>
            <Select value={audioPreference} onValueChange={onAudioPreferenceChange}>
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {AUDIO_PREFERENCES.map((p) => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Section>

      <Section title="Devices" summary={`${totalDevices} placed`}>
        <div className="divide-y divide-slate-100">
          {deviceSectionOrder.map((cat) => (
            <DeviceRow key={cat} category={cat} count={devices[cat].length} onAdd={onAddDevice} onRemove={onRemoveDevice} />
          ))}
        </div>
        <p className="mt-3 text-xs leading-relaxed text-slate-400">
          Click + to arm a component, then click the grid to place it. Click - to remove the selected (or most recent) item.
        </p>
      </Section>

      <Section
        title="Camera Features"
        summary={cameraFeatures.length ? `${cameraFeatures.length} selected` : "None selected"}
      >
        <div className="flex flex-col gap-1.5">
          {CAMERA_FEATURES.map((feature) => {
            const Illustration = CAMERA_FEATURE_ILLUSTRATIONS[feature.id];
            const active = cameraFeatures.includes(feature.id);
            return (
              <button
                key={feature.id}
                type="button"
                onClick={() => onToggleCameraFeature(feature.id)}
                aria-pressed={active}
                title={feature.description}
                className={`flex items-center gap-2.5 rounded-lg border p-2 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 active:scale-[0.99] ${
                  active
                    ? "border-blue-500 bg-blue-50 shadow-sm"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <div className="h-9 w-14 shrink-0 overflow-hidden rounded-md border border-slate-100 bg-white">
                  <Illustration />
                </div>
                <span
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                    active ? "border-blue-600 bg-blue-600 text-white" : "border-slate-300 bg-white"
                  }`}
                >
                  {active && <Check className="h-3 w-3" />}
                </span>
                <div className="min-w-0 flex-1">
                  <div className={`text-xs font-semibold leading-tight ${active ? "text-blue-800" : "text-slate-800"}`}>
                    {feature.label}
                  </div>
                  <p className="truncate text-[10px] leading-snug text-slate-500">{feature.description}</p>
                </div>
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-xs leading-relaxed text-slate-400">
          Select the AV camera behaviors you want for this room — more than one can be enabled on cameras that support switching modes.
        </p>
      </Section>

      <Section
        title="Additional notes"
        summary={additionalNotes?.trim() ? `${additionalNotes.trim().length} characters` : "None added"}
      >
        <textarea
          rows={3}
          value={additionalNotes}
          onChange={(e) => onAdditionalNotesChange(e.target.value)}
          placeholder="Anything else the site survey or install team should know..."
          className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition-colors focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        />
        <p className="mt-3 text-xs leading-relaxed text-slate-400">
          Included in the configuration brief and the exported PDF report.
        </p>
      </Section>
    </div>
  );
}
