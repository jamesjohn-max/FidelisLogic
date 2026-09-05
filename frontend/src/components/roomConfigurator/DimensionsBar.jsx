import { useEffect, useRef, useState } from "react";
import { Minus, Plus, RectangleHorizontal, RectangleVertical } from "lucide-react";
import { clamp, ROOM_LIMITS, CHAIR_LIMITS, getTableLimits, getChairLimits, POD_RADIUS_LIMITS } from "../../lib/roomConfiguratorEngine";

const formatNum = (v, decimals) => {
  const n = Number(v.toFixed(decimals));
  return String(n);
};

// A controlled numeric input that still lets you type freely: the displayed text is
// local state, decoupled from the clamped committed value, so clamping on every
// keystroke can't fight what you're typing. The value is parsed and clamped on blur
// (or Enter), not on every change.
function NumberField({ label, value, min, max, step, unit, onChange, decimals = 1, disabled = false }) {
  const [text, setText] = useState(() => formatNum(value, decimals));
  const focusedRef = useRef(false);

  useEffect(() => {
    if (!focusedRef.current) setText(formatNum(value, decimals));
  }, [value, decimals]);

  const commit = (raw) => {
    const n = parseFloat(raw);
    const next = Number.isFinite(n) ? clamp(Number(n.toFixed(decimals)), min, max) : value;
    onChange(next);
    setText(formatNum(next, decimals));
  };

  const bump = (delta) => {
    const next = clamp(Number((value + delta).toFixed(decimals)), min, max);
    onChange(next);
    setText(formatNum(next, decimals));
  };

  return (
    <div className={`flex min-w-[132px] flex-1 flex-col gap-1 ${disabled ? "opacity-40" : ""}`}>
      <label className="text-[11px] font-medium uppercase tracking-wide text-slate-500">{label}</label>
      <div className="flex h-10 items-center rounded-lg border border-slate-200 bg-white shadow-sm">
        <button
          type="button"
          aria-label={`Decrease ${label}`}
          disabled={disabled}
          onClick={() => bump(-step)}
          className="flex h-full w-9 shrink-0 items-center justify-center rounded-l-lg text-slate-500 transition-transform duration-100 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 disabled:cursor-not-allowed active:scale-90 active:bg-slate-200"
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        <input
          type="text"
          inputMode="decimal"
          value={text}
          disabled={disabled}
          onFocus={(e) => {
            focusedRef.current = true;
            e.currentTarget.select();
          }}
          onChange={(e) => setText(e.target.value)}
          onBlur={(e) => {
            focusedRef.current = false;
            commit(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.currentTarget.blur();
            if (e.key === "Escape") { setText(formatNum(value, decimals)); e.currentTarget.blur(); }
          }}
          onWheel={(e) => e.currentTarget.blur()}
          className="h-full w-full min-w-0 border-x border-slate-100 bg-transparent text-center text-sm font-semibold text-slate-800 outline-none disabled:cursor-not-allowed"
        />
        <button
          type="button"
          aria-label={`Increase ${label}`}
          disabled={disabled}
          onClick={() => bump(step)}
          className="flex h-full w-9 shrink-0 items-center justify-center rounded-r-lg text-slate-500 transition-transform duration-100 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 disabled:cursor-not-allowed active:scale-90 active:bg-slate-200"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
      <span className="text-[11px] text-slate-400">{unit}</span>
    </div>
  );
}

// Matches NumberField's stepper chrome but drives an add/remove device count
// instead of a numeric value, since the door isn't dimensioned — it's placed.
function DoorControl({ count, onAdd, onRemove }) {
  return (
    <div className="flex min-w-[132px] flex-1 flex-col gap-1">
      <label className="text-[11px] font-medium uppercase tracking-wide text-slate-500">Door</label>
      <div className="flex h-10 items-center rounded-lg border border-slate-200 bg-white shadow-sm">
        <button
          type="button"
          aria-label="Remove Door"
          onClick={onRemove}
          disabled={count === 0}
          className="flex h-full w-9 shrink-0 items-center justify-center rounded-l-lg text-slate-500 transition-transform duration-100 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 disabled:cursor-not-allowed disabled:opacity-30 disabled:active:scale-100 active:scale-90 active:bg-slate-200"
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        <span className="flex h-full flex-1 items-center justify-center border-x border-slate-100 text-sm font-semibold text-slate-800">
          {count}
        </span>
        <button
          type="button"
          aria-label="Add Door"
          onClick={onAdd}
          className="flex h-full w-9 shrink-0 items-center justify-center rounded-r-lg text-slate-500 transition-transform duration-100 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 active:scale-90 active:bg-blue-200"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
      <span className="text-[11px] text-slate-400">Click + then tap a wall</span>
    </div>
  );
}

export function DimensionsBar({
  room,
  table,
  chairCount,
  layout,
  onRoomChange,
  onTableChange,
  onChairCountChange,
  onToggleOrientation,
  layoutSupportsTable,
  lengthApplicable = true,
  widthApplicable = true,
  doorCount,
  onAddDoor,
  onRemoveDoor,
  selectedPodDiameter,
  selectedPodRadiusLimits = POD_RADIUS_LIMITS,
  onResizeSelectedPod,
}) {
  const tableLimits = getTableLimits(room);
  const chairLimits = getChairLimits(layout, room, table);
  // Rotating swaps which raw table dimension sits on which room axis. If the
  // swapped footprint is bigger than the room itself along that axis, the table
  // would stick out through the walls, so block the rotation instead.
  const orientationWouldOverflow = table.width > room.length || table.length > room.width;
  const orientationDisabled = !layoutSupportsTable || orientationWouldOverflow;
  // Open Collaboration: once a pod is selected, the length/width controls resize
  // that one table (a round pod has a single size — diameter — so both fields
  // edit the same value) instead of the room's shared table dimensions.
  const podSelected = selectedPodDiameter != null;
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-end gap-3">
        <NumberField label="Room length" value={room.length} min={ROOM_LIMITS.length[0]} max={ROOM_LIMITS.length[1]} step={0.1} unit="meters" onChange={(v) => onRoomChange({ ...room, length: v })} />
        <NumberField label="Room width" value={room.width} min={ROOM_LIMITS.width[0]} max={ROOM_LIMITS.width[1]} step={0.1} unit="meters" onChange={(v) => onRoomChange({ ...room, width: v })} />
        <NumberField label="Room height" value={room.height} min={ROOM_LIMITS.height[0]} max={ROOM_LIMITS.height[1]} step={0.1} unit="meters" onChange={(v) => onRoomChange({ ...room, height: v })} />
        <DoorControl count={doorCount} onAdd={onAddDoor} onRemove={onRemoveDoor} />

        <div className="mx-1 hidden h-10 w-px self-end bg-slate-200 sm:block" />

        <NumberField
          label="Table length"
          value={podSelected ? selectedPodDiameter : table.length}
          min={podSelected ? selectedPodRadiusLimits[0] * 2 : tableLimits.length[0]}
          max={podSelected ? selectedPodRadiusLimits[1] * 2 : tableLimits.length[1]}
          step={0.1}
          unit={podSelected ? `meters · pod diameter, max ${(selectedPodRadiusLimits[1] * 2).toFixed(1)}` : `meters · max ${tableLimits.length[1].toFixed(1)}`}
          disabled={podSelected ? false : !lengthApplicable}
          onChange={(v) => (podSelected ? onResizeSelectedPod(v) : onTableChange({ ...table, length: v }))}
        />
        <NumberField
          label="Table width"
          value={podSelected ? selectedPodDiameter : table.width}
          min={podSelected ? selectedPodRadiusLimits[0] * 2 : tableLimits.width[0]}
          max={podSelected ? selectedPodRadiusLimits[1] * 2 : tableLimits.width[1]}
          step={0.1}
          unit={podSelected ? `meters · pod diameter, max ${(selectedPodRadiusLimits[1] * 2).toFixed(1)}` : `meters · max ${tableLimits.width[1].toFixed(1)}`}
          disabled={podSelected ? false : !widthApplicable}
          onChange={(v) => (podSelected ? onResizeSelectedPod(v) : onTableChange({ ...table, width: v }))}
        />

        <div className="flex min-w-[132px] flex-1 flex-col gap-1">
          <label className="text-[11px] font-medium uppercase tracking-wide text-slate-500">Orientation</label>
          <button
            type="button"
            disabled={podSelected || orientationDisabled}
            onClick={onToggleOrientation}
            title={!podSelected && orientationWouldOverflow && layoutSupportsTable ? "Rotating would push the table past the walls" : undefined}
            className="flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 shadow-sm transition-[background-color,transform] duration-100 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100 active:scale-[0.97] active:bg-slate-100"
          >
            {table.orientation === 0 ? <RectangleHorizontal className="h-4 w-4" /> : <RectangleVertical className="h-4 w-4" />}
            {table.orientation === 0 ? "Landscape" : "Portrait"}
          </button>
          <span className="text-[11px] text-slate-400">
            {podSelected
              ? "Round pod — no orientation"
              : orientationWouldOverflow && layoutSupportsTable
              ? "Too large to rotate here"
              : "Table orientation"}
          </span>
        </div>

        <div className="mx-1 hidden h-10 w-px self-end bg-slate-200 sm:block" />

        <NumberField
          label="Chairs"
          value={chairCount}
          min={chairLimits[0]}
          max={chairLimits[1]}
          step={1}
          decimals={0}
          unit={
            chairLimits[1] > CHAIR_LIMITS[1]
              ? `people · fills room (max ${chairLimits[1]})`
              : chairLimits[1] < CHAIR_LIMITS[1]
              ? `people · max ${chairLimits[1]} (ergonomic spacing)`
              : "people"
          }
          onChange={(v) => onChairCountChange(Math.round(v))}
        />
      </div>
    </div>
  );
}
