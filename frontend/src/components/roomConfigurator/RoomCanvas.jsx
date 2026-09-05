import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { X, Trash2 } from "lucide-react";
import {
  GRID_STEP,
  ROOM_MARGIN,
  DEVICE_LABELS,
  clamp,
  generateFovPolygon,
  fovEdgeRays,
  displayWidthMeters,
  angleFromVector,
  refLabel,
  nearestGridPoint,
  rotateBy,
} from "../../lib/roomConfiguratorEngine";
import "./roomConfigurator.css";

// Device icons use the same blue as their icon in the Devices list (text-blue-600),
// so a device reads the same color on the canvas as it does in the panel.
const NEUTRAL_FILL = "#2563EB";
const NEUTRAL_STROKE = "#1D4ED8";
const NEUTRAL_ACCENT = "#E2E8F0";
const SELECTED_FILL = "#2563EB";
const SELECTED_STROKE = "#1D4ED8";
const SELECTED_ACCENT = "#DBEAFE";

// Realistic top-down office chair: curved backrest peeking out behind a rounded
// seat, with small armrest nubs — reads as an actual chair, not a plain block.
const ChairIcon = ({ selected }) => {
  const seatFill = selected ? "#DBEAFE" : "#EEF1F6";
  const accentFill = selected ? "#93C5FD" : "#B9C3D1";
  const stroke = selected ? "#2563EB" : "#7C8BA1";
  const sw = selected ? 0.026 : 0.018;
  return (
    <g>
      <path
        d="M -0.16 0.06 A 0.185 0.185 0 0 0 0.16 0.06"
        fill="none"
        stroke={accentFill}
        strokeWidth={0.12}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
      <rect x={-0.17} y={-0.18} width={0.34} height={0.3} rx={0.08} fill={seatFill} stroke={stroke} strokeWidth={sw} vectorEffect="non-scaling-stroke" />
      <rect x={-0.245} y={-0.07} width={0.065} height={0.16} rx={0.028} fill={accentFill} stroke={stroke} strokeWidth={0.011} vectorEffect="non-scaling-stroke" />
      <rect x={0.18} y={-0.07} width={0.065} height={0.16} rx={0.028} fill={accentFill} stroke={stroke} strokeWidth={0.011} vectorEffect="non-scaling-stroke" />
    </g>
  );
};

// Wall-mounted screen: proportional-width bar (per the chosen diagonal) with small
// corner brackets, reading as a TV/display symbol rather than a plain line.
const DisplayIcon = ({ widthM, selected }) => {
  const fill = selected ? SELECTED_FILL : NEUTRAL_FILL;
  const stroke = selected ? SELECTED_STROKE : NEUTRAL_STROKE;
  const tick = Math.min(0.09, widthM * 0.18);
  return (
    <g>
      <rect x={-widthM / 2} y={-0.045} width={widthM} height={0.09} rx={0.025} fill={fill} stroke={stroke} strokeWidth={0.016} vectorEffect="non-scaling-stroke" />
      <line x1={-widthM / 2} y1={-0.045} x2={-widthM / 2} y2={-0.045 - tick} stroke={stroke} strokeWidth={0.02} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      <line x1={widthM / 2} y1={-0.045} x2={widthM / 2} y2={-0.045 - tick} stroke={stroke} strokeWidth={0.02} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      <circle cx={0} cy={0} r={0.032} fill={selected ? SELECTED_ACCENT : NEUTRAL_ACCENT} />
    </g>
  );
};

// Camera body + lens + viewfinder hump, like a compact camcorder silhouette.
const CameraIcon = ({ selected, isTableCam }) => {
  const fill = selected ? SELECTED_FILL : NEUTRAL_FILL;
  const stroke = selected ? SELECTED_STROKE : NEUTRAL_STROKE;
  const accent = selected ? SELECTED_ACCENT : NEUTRAL_ACCENT;
  if (isTableCam) {
    return (
      <g>
        <circle r={0.075} fill={fill} stroke={stroke} strokeWidth={0.009} vectorEffect="non-scaling-stroke" />
        <circle r={0.03} fill={accent} />
        <circle r={0.115} fill="none" stroke={stroke} strokeWidth={0.01} strokeDasharray="0.02 0.025" vectorEffect="non-scaling-stroke" />
      </g>
    );
  }
  return (
    <g>
      <rect x={-0.075} y={-0.045} width={0.15} height={0.09} rx={0.0225} fill={fill} stroke={stroke} strokeWidth={0.0085} vectorEffect="non-scaling-stroke" />
      <rect x={-0.0275} y={-0.0775} width={0.055} height={0.0375} rx={0.009} fill={fill} stroke={stroke} strokeWidth={0.0075} vectorEffect="non-scaling-stroke" />
      <circle cx={0} cy={0} r={0.0325} fill={accent} stroke={stroke} strokeWidth={0.006} vectorEffect="non-scaling-stroke" />
    </g>
  );
};

// Speaker cone + sound-wave arcs — the classic "audio out" glyph, unmistakable at a glance.
const SpeakerIcon = ({ selected }) => {
  const fill = selected ? SELECTED_FILL : NEUTRAL_FILL;
  const stroke = selected ? SELECTED_STROKE : NEUTRAL_STROKE;
  return (
    <g>
      <path
        d="M -0.0225 -0.045 L -0.08 -0.045 L -0.08 0.045 L -0.0225 0.045 L 0.055 0.095 L 0.055 -0.095 Z"
        fill={fill}
        stroke={stroke}
        strokeWidth={0.007}
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      <path d="M 0.085 -0.04 A 0.055 0.055 0 0 1 0.085 0.04" fill="none" stroke={fill} strokeWidth={0.011} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      <path d="M 0.115 -0.075 A 0.095 0.095 0 0 1 0.115 0.075" fill="none" stroke={fill} strokeWidth={0.011} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </g>
  );
};

// Mic capsule on a shock-mount cradle, with grille lines and a stand — a real
// microphone silhouette, distinct from the speaker's cone-and-waves glyph.
const MicrophoneIcon = ({ selected }) => {
  const fill = selected ? SELECTED_FILL : NEUTRAL_FILL;
  const stroke = selected ? SELECTED_STROKE : NEUTRAL_STROKE;
  const accent = selected ? SELECTED_ACCENT : NEUTRAL_ACCENT;
  return (
    <g>
      <rect x={-0.05} y={-0.11} width={0.1} height={0.14} rx={0.05} fill={fill} stroke={stroke} strokeWidth={0.009} vectorEffect="non-scaling-stroke" />
      <line x1={-0.03} y1={-0.083} x2={0.03} y2={-0.083} stroke={accent} strokeWidth={0.008} strokeLinecap="round" />
      <line x1={-0.03} y1={-0.055} x2={0.03} y2={-0.055} stroke={accent} strokeWidth={0.008} strokeLinecap="round" />
      <line x1={-0.03} y1={-0.027} x2={0.03} y2={-0.027} stroke={accent} strokeWidth={0.008} strokeLinecap="round" />
      <path d="M -0.075 -0.01 A 0.075 0.075 0 0 0 0.075 -0.01" fill="none" stroke={fill} strokeWidth={0.011} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      <line x1={0} y1={0.065} x2={0} y2={0.105} stroke={fill} strokeWidth={0.011} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      <line x1={-0.04} y1={0.105} x2={0.04} y2={0.105} stroke={fill} strokeWidth={0.014} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </g>
  );
};

// Tablet body with a screen inset and home button — a real touch-panel silhouette.
const TouchPanelIcon = ({ selected }) => {
  const fill = selected ? SELECTED_FILL : NEUTRAL_FILL;
  const stroke = selected ? SELECTED_STROKE : NEUTRAL_STROKE;
  const accent = selected ? SELECTED_ACCENT : NEUTRAL_ACCENT;
  return (
    <g>
      <rect x={-0.065} y={-0.085} width={0.13} height={0.17} rx={0.0175} fill={fill} stroke={stroke} strokeWidth={0.008} vectorEffect="non-scaling-stroke" />
      <rect x={-0.05} y={-0.065} width={0.1} height={0.11} rx={0.006} fill={accent} />
      <circle cx={0} cy={0.0625} r={0.009} fill={accent} />
    </g>
  );
};

// Wireless-sharing dongle: a plug-in body with a connector prong and a status LED —
// the real object you'd hand someone to cast their laptop to the room display.
const ContentSharingIcon = ({ selected }) => {
  const fill = selected ? SELECTED_FILL : NEUTRAL_FILL;
  const stroke = selected ? SELECTED_STROKE : NEUTRAL_STROKE;
  const accent = selected ? SELECTED_ACCENT : NEUTRAL_ACCENT;
  return (
    <g>
      <rect x={-0.095} y={-0.05} width={0.15} height={0.1} rx={0.024} fill={fill} stroke={stroke} strokeWidth={0.008} vectorEffect="non-scaling-stroke" />
      <rect x={0.045} y={-0.02} width={0.05} height={0.04} rx={0.006} fill={fill} stroke={stroke} strokeWidth={0.007} vectorEffect="non-scaling-stroke" />
      <circle cx={-0.02} cy={0} r={0.02} fill={accent} />
    </g>
  );
};

// Architectural door symbol: a slab drawn parallel to whichever wall it's snapped to
// (our rotation maps local-x to the wall direction on every edge), plus a handle and
// a dashed swing arc hinting at the opening direction.
const DoorIcon = ({ selected }) => {
  const w = 0.9;
  const thickness = 0.1;
  const fill = selected ? SELECTED_FILL : NEUTRAL_FILL;
  const stroke = selected ? SELECTED_STROKE : NEUTRAL_STROKE;
  return (
    <g>
      <path d={`M ${w / 2} 0 A ${w} ${w} 0 0 0 ${-w / 2} ${-w}`} fill="none" stroke={selected ? SELECTED_ACCENT : "#94A3B8"} strokeWidth={0.018} strokeDasharray="0.05 0.05" vectorEffect="non-scaling-stroke" />
      <rect x={-w / 2} y={-thickness / 2} width={w} height={thickness} rx={0.02} fill={fill} stroke={stroke} strokeWidth={0.016} vectorEffect="non-scaling-stroke" />
      <circle cx={w / 2 - 0.16} cy={0} r={0.03} fill={selected ? SELECTED_ACCENT : NEUTRAL_ACCENT} />
    </g>
  );
};

// Small wall-mounted scheduling panel — a slim panel with schedule lines and a status dot.
// Flush wall-mounted scheduling panel: wide and shallow, sitting right at the wall
// line and extending only slightly into the room — like a real mounted panel, not
// a device floating in the middle of the floor.
const BookingPanelIcon = ({ selected }) => {
  const fill = selected ? SELECTED_FILL : NEUTRAL_FILL;
  const stroke = selected ? SELECTED_STROKE : NEUTRAL_STROKE;
  const accent = selected ? SELECTED_ACCENT : NEUTRAL_ACCENT;
  const w = 0.36;
  const depth = 0.12;
  const y0 = 0.015;
  return (
    <g>
      <rect x={-w / 2} y={y0} width={w} height={depth} rx={0.022} fill={fill} stroke={stroke} strokeWidth={0.015} vectorEffect="non-scaling-stroke" />
      <line x1={-w / 2 + 0.05} y1={y0 + depth * 0.35} x2={w / 2 - 0.15} y2={y0 + depth * 0.35} stroke={accent} strokeWidth={0.016} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      <line x1={-w / 2 + 0.05} y1={y0 + depth * 0.65} x2={w / 2 - 0.15} y2={y0 + depth * 0.65} stroke={accent} strokeWidth={0.016} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      <circle cx={w / 2 - 0.07} cy={y0 + depth / 2} r={0.026} fill={accent} />
    </g>
  );
};

function FovRay({ cam, room }) {
  const fov = cam.isTableCam ? 360 : cam.fov;
  const poly = useMemo(() => generateFovPolygon(cam.x, cam.y, cam.angle, fov, room), [cam.x, cam.y, cam.angle, fov, room]);
  const edges = useMemo(() => fovEdgeRays(cam.x, cam.y, cam.angle, fov, room), [cam.x, cam.y, cam.angle, fov, room]);
  const pointsAttr = poly.map((p) => `${p.x.toFixed(3)},${p.y.toFixed(3)}`).join(" ");
  return (
    <g pointerEvents="none">
      <polygon points={pointsAttr} fill="#2563EB" fillOpacity={cam.isTableCam ? 0.05 : 0.11} />
      {fov < 360 && (
        <>
          <line x1={cam.x} y1={cam.y} x2={edges[0].x} y2={edges[0].y} stroke="#2563EB" strokeOpacity={0.4} strokeWidth={0.018} strokeDasharray="0.06 0.06" vectorEffect="non-scaling-stroke" />
          <line x1={cam.x} y1={cam.y} x2={edges[1].x} y2={edges[1].y} stroke="#2563EB" strokeOpacity={0.4} strokeWidth={0.018} strokeDasharray="0.06 0.06" vectorEffect="non-scaling-stroke" />
        </>
      )}
    </g>
  );
}

function renderTableShape(tableShape, selected) {
  const stroke = selected ? "#2563EB" : "#5B6B82";
  const strokeWidth = selected ? 0.032 : 0.024;
  const fill = selected ? "#DBEAFE" : "#E3E9F1";
  switch (tableShape.type) {
    case "rect":
      return <rect x={-tableShape.w / 2} y={-tableShape.h / 2} width={tableShape.w} height={tableShape.h} rx={0.08} fill={fill} stroke={stroke} strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" />;
    case "ellipse":
      return <ellipse cx={0} cy={0} rx={tableShape.w / 2} ry={tableShape.h / 2} fill={fill} stroke={stroke} strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" />;
    case "segments":
      return tableShape.segments.map((s, i) => (
        <rect key={i} x={s.x} y={s.y} width={s.w} height={s.h} rx={0.05} fill={fill} stroke={stroke} strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" />
      ));
    case "desks":
      return tableShape.desks.map((d, i) => (
        <rect key={i} x={d.x} y={d.y} width={d.w} height={d.h} rx={0.05} fill={fill} stroke={stroke} strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" />
      ));
    default:
      return null;
  }
}

// Pods render individually (not through the generic renderTableShape) so each one
// can carry its own selection state — double-click a pod to select just that table,
// then its size is edited via the Table length/width controls.
function renderPods(tables, selection, onSelect) {
  return tables.map((t, i) => {
    const isSelected = selection?.category === "tablePod" && selection.index === i;
    const stroke = isSelected ? "#2563EB" : "#5B6B82";
    const strokeWidth = isSelected ? 0.032 : 0.024;
    const fill = isSelected ? "#DBEAFE" : "#E3E9F1";
    return (
      <g key={i}>
        <circle
          cx={t.x}
          cy={t.y}
          r={t.radius}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          vectorEffect="non-scaling-stroke"
          style={{ cursor: "pointer" }}
          onDoubleClick={(e) => { e.stopPropagation(); onSelect({ category: "tablePod", index: i }); }}
        />
        {isSelected && (
          <circle
            cx={t.x}
            cy={t.y}
            r={t.radius + 0.1}
            fill="none"
            stroke="#2563EB"
            strokeWidth={2}
            strokeDasharray="5 4"
            vectorEffect="non-scaling-stroke"
            opacity={0.8}
            pointerEvents="none"
          />
        )}
      </g>
    );
  });
}

const CATEGORY_ICON = {
  display: DisplayIcon,
  camera: CameraIcon,
  microphone: MicrophoneIcon,
  speaker: SpeakerIcon,
  touchPanel: TouchPanelIcon,
  contentSharing: ContentSharingIcon,
  door: DoorIcon,
  bookingPanel: BookingPanelIcon,
};

const ROTATABLE_CATEGORIES = ["display", "camera", "microphone", "speaker", "touchPanel", "contentSharing", "door", "bookingPanel"];
// Selection ring radius per category, sized to each icon's actual footprint so it
// hugs smaller icons instead of floating loosely around them.
const SELECTION_RING_RADIUS = {
  display: 0.24,
  camera: 0.14,
  microphone: 0.14,
  speaker: 0.14,
  touchPanel: 0.12,
  contentSharing: 0.12,
  door: 0.24,
  bookingPanel: 0.24,
};
const TURN_HANDLE_DIST = 0.38;

// Small on-canvas handle to rotate a selected item by dragging; stays attached to its front.
function TurnHandle({ onPointerDown }) {
  return (
    <g onPointerDown={onPointerDown} className="rc-handle" style={{ cursor: "grab" }}>
      <line x1={0} y1={0} x2={0} y2={-TURN_HANDLE_DIST} stroke={SELECTED_FILL} strokeWidth={0.02} strokeDasharray="0.03 0.04" vectorEffect="non-scaling-stroke" />
      <circle cx={0} cy={-TURN_HANDLE_DIST} r={0.17} fill="transparent" />
      <circle cx={0} cy={-TURN_HANDLE_DIST} r={0.09} fill="#ffffff" stroke={SELECTED_FILL} strokeWidth={0.025} vectorEffect="non-scaling-stroke" />
      <circle cx={0} cy={-TURN_HANDLE_DIST} r={0.032} fill={SELECTED_FILL} />
    </g>
  );
}

function StackBadge({ count }) {
  return (
    <g transform="translate(0.3 -0.3)" pointerEvents="none">
      <circle r={0.14} fill="#0F172A" stroke="#ffffff" strokeWidth={0.02} vectorEffect="non-scaling-stroke" />
      <text x={0} y={0} textAnchor="middle" dominantBaseline="central" fontSize={0.15} fontWeight={700} fill="#ffffff">
        {count}
      </text>
    </g>
  );
}

// Thin identification label (e.g. "D1", "C2") shown under every placed component,
// matching the reference codes used in the text brief. A white halo keeps it legible
// over the table, chairs, or grid without needing a solid background chip.
function RefLabel({ label }) {
  return (
    <text
      x={0}
      y={0.3}
      textAnchor="middle"
      fontSize={0.075}
      fontWeight={300}
      fill="#334155"
      stroke="#FFFFFF"
      strokeWidth={0.018}
      paintOrder="stroke"
      pointerEvents="none"
    >
      {label}
    </text>
  );
}

// Tick positions run in lockstep with the visible grid dots (same step, same bounds)
// so a measurement read off the ruler lines up exactly with a dot in the room.
function buildRulerMarks(dimension, step, labelStep) {
  const n = Math.floor(dimension / step + 1e-6);
  const marks = [];
  for (let i = 0; i <= n; i++) {
    const pos = i * step;
    const nearestLabelIdx = Math.round(pos / labelStep);
    const isMajor = Math.abs(pos - nearestLabelIdx * labelStep) < step * 0.05;
    marks.push({ pos, isMajor });
  }
  return marks;
}

const formatMeters = (v) => {
  const r = Math.round(v * 100) / 100;
  return `${Number.isInteger(r) ? r : r.toFixed(2)}m`;
};

const RULER_MINOR_TICK = 0.05;
const RULER_MAJOR_TICK = 0.12;
const RULER_LABEL_GAP = 0.05;
const RULER_MINOR_COLOR = "#CBD5E1";
const RULER_MAJOR_COLOR = "#64748B";
const RULER_LABEL_COLOR = "#94A3B8";

// One wall's worth of outward-facing ruler ticks. `orientation` picks the axis the
// ticks run along; `wallAt` is that wall's fixed coordinate (0 or the room's far
// edge); `sign` is the outward direction (-1 for top/left, +1 for bottom/right).
function RulerTicks({ marks, orientation, wallAt, sign }) {
  const isHorizontal = orientation === "horizontal";
  return (
    <g pointerEvents="none">
      {marks.map(({ pos, isMajor }) => {
        const len = isMajor ? RULER_MAJOR_TICK : RULER_MINOR_TICK;
        const tickEnd = wallAt + sign * len;
        const color = isMajor ? RULER_MAJOR_COLOR : RULER_MINOR_COLOR;
        const strokeWidth = isMajor ? 0.018 : 0.012;
        if (isHorizontal) {
          return (
            <g key={pos}>
              <line x1={pos} y1={wallAt} x2={pos} y2={tickEnd} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
              {isMajor && (
                <text
                  x={pos}
                  y={tickEnd + sign * RULER_LABEL_GAP}
                  textAnchor="middle"
                  dominantBaseline={sign === -1 ? "auto" : "hanging"}
                  fontSize={0.13}
                  fontWeight={400}
                  fill={RULER_LABEL_COLOR}
                >
                  {formatMeters(pos)}
                </text>
              )}
            </g>
          );
        }
        return (
          <g key={pos}>
            <line x1={wallAt} y1={pos} x2={tickEnd} y2={pos} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
            {isMajor && (
              <text
                x={tickEnd + sign * RULER_LABEL_GAP}
                y={pos}
                textAnchor={sign === -1 ? "end" : "start"}
                dominantBaseline="central"
                fontSize={0.13}
                fontWeight={400}
                fill={RULER_LABEL_COLOR}
              >
                {formatMeters(pos)}
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
}

export function RoomCanvas({
  room,
  table,
  chairCount,
  layout,
  layoutResult,
  tableOffset,
  devices,
  selection,
  armedPlacement,
  onSelect,
  onPlaceAt,
  onCancelPlacement,
  onTableDragCommit,
  onDeviceDragCommit,
  onRotateSelected,
  onSetItemAngle,
  onRemoveSelected,
  removedChairIndices,
  onRemoveChair,
  chairOffsets,
  onChairDragCommit,
  onSetChairAngle,
  diagramRef,
}) {
  const svgRef = useRef(null);
  const dragRef = useRef(null);
  const rotateDragRef = useRef(null);
  const [liveTableOffset, setLiveTableOffset] = useState(null);
  const [liveDevicePos, setLiveDevicePos] = useState(null);
  const [liveAngle, setLiveAngle] = useState(null);
  const [hoverPoint, setHoverPoint] = useState(null);

  const effectiveOffset = liveTableOffset || tableOffset;
  const tableCenter = { x: room.length / 2 + effectiveOffset.x, y: room.width / 2 + effectiveOffset.y };

  const viewBox = { x: -ROOM_MARGIN, y: -ROOM_MARGIN, w: room.length + ROOM_MARGIN * 2, h: room.width + ROOM_MARGIN * 2 };

  // Snapping always uses the fine GRID_STEP; the visible marks thin out for very
  // large rooms so the grid (and the ruler, which stays locked to the same spacing)
  // stays cheap to render and legible at any room size.
  const displayStep = useMemo(() => {
    let step = GRID_STEP;
    while ((room.length / step) * (room.width / step) > 4000) step *= 2;
    return step;
  }, [room.length, room.width]);

  const gridPath = useMemo(() => {
    const r = displayStep * 0.2;
    const nx = Math.floor(room.length / displayStep + 1e-6);
    const ny = Math.floor(room.width / displayStep + 1e-6);
    let d = "";
    for (let i = 0; i <= nx; i++) {
      const x = i * displayStep;
      for (let j = 0; j <= ny; j++) {
        const y = j * displayStep;
        d += `M${(x - r).toFixed(3)},${y.toFixed(3)} L${(x + r).toFixed(3)},${y.toFixed(3)} M${x.toFixed(3)},${(y - r).toFixed(3)} L${x.toFixed(3)},${(y + r).toFixed(3)} `;
      }
    }
    return d;
  }, [room.length, room.width, displayStep]);

  // Major (labeled) ticks land on a "nice" meter value that's still an exact multiple
  // of displayStep, so a labeled tick always sits exactly on top of a grid dot.
  const labelStep = useMemo(() => {
    const niceSteps = [1, 2, 5, 10, 20, 50, 100];
    const nice = niceSteps.find((n) => n >= displayStep) ?? 100;
    return Math.max(1, Math.round(nice / displayStep)) * displayStep;
  }, [displayStep]);

  const marksX = useMemo(() => buildRulerMarks(room.length, displayStep, labelStep), [room.length, displayStep, labelStep]);
  const marksY = useMemo(() => buildRulerMarks(room.width, displayStep, labelStep), [room.width, displayStep, labelStep]);

  // Group items that share a grid cell so they can be flagged with a stack badge —
  // items render at their exact position, one squarely atop another, no offset drift.
  const stackGroups = useMemo(() => {
    const groups = {};
    const order = ["display", "camera", "microphone", "speaker", "touchPanel", "contentSharing", "door", "bookingPanel"];
    order.forEach((cat) => {
      devices[cat].forEach((item) => {
        const key = `${Math.round(item.x / GRID_STEP)}_${Math.round(item.y / GRID_STEP)}`;
        groups[key] = groups[key] || [];
        groups[key].push(`${cat}:${item.id}`);
      });
    });
    const counts = {};
    Object.values(groups).forEach((group) => {
      if (group.length < 2) return;
      const topKey = group[group.length - 1];
      counts[topKey] = group.length;
    });
    return counts;
  }, [devices]);

  const clientToPoint = useCallback((clientX, clientY) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return { x: 0, y: 0 };
    const loc = pt.matrixTransform(ctm.inverse());
    return { x: loc.x, y: loc.y };
  }, []);

  const startDrag = useCallback((e, category, id, curX, curY) => {
    e.stopPropagation();
    // No preventDefault() here: touch-action:none and select-none on the SVG already
    // suppress scrolling/selection, and calling it on pointerdown would stop the
    // browser from synthesizing the compatibility mouse events a real double-click
    // on a chair depends on (dblclick never fires once pointerdown is prevented).
    // Pointer capture is deferred to the first real movement (see
    // handleSvgPointerMove) rather than taken here: capturing immediately retargets
    // the click/dblclick that follow a plain click to the <svg>, which silently
    // breaks double-click on any descendant (chairs) for that gesture.
    onSelect({ category, id });
    dragRef.current = {
      category, id,
      pointerId: e.pointerId,
      startPointM: clientToPoint(e.clientX, e.clientY),
      startX: curX, startY: curY,
      moved: false,
    };
  }, [clientToPoint, onSelect]);

  // Dragging a chair moves only that chair (as an offset from its generated seat
  // position), never the table — distinct from startDrag, which always drags the
  // whole table+chairs group. Only called for the chair that's already selected;
  // any other chair's pointerdown is left to bubble up to the table group.
  const startChairDrag = useCallback((e, index, curDx, curDy) => {
    e.stopPropagation();
    onSelect({ category: "chair", index });
    dragRef.current = {
      category: "chair", id: index,
      pointerId: e.pointerId,
      startPointM: clientToPoint(e.clientX, e.clientY),
      startX: curDx, startY: curDy,
      moved: false,
    };
  }, [clientToPoint, onSelect]);

  const startRotateDrag = useCallback((e, category, id, centerX, centerY) => {
    e.stopPropagation();
    e.preventDefault();
    const svg = svgRef.current;
    try { svg.setPointerCapture(e.pointerId); } catch (_) {}
    rotateDragRef.current = { category, id, centerX, centerY };
  }, []);

  const handleSvgPointerMove = useCallback((e) => {
    if (armedPlacement && !dragRef.current && !rotateDragRef.current) {
      const p = clientToPoint(e.clientX, e.clientY);
      setHoverPoint({ x: clamp(p.x, 0, room.length), y: clamp(p.y, 0, room.width) });
    }
    if (rotateDragRef.current) {
      const r = rotateDragRef.current;
      const p = clientToPoint(e.clientX, e.clientY);
      const angle = angleFromVector(p.x - r.centerX, p.y - r.centerY);
      setLiveAngle({ key: `${r.category}:${r.id}`, angle });
      return;
    }
    const d = dragRef.current;
    if (!d) return;
    const p = clientToPoint(e.clientX, e.clientY);
    const ddx = p.x - d.startPointM.x;
    const ddy = p.y - d.startPointM.y;
    if (!d.moved && Math.hypot(ddx, ddy) > 0.035) {
      d.moved = true;
      // Only now, once this is confirmably a drag and not a click, capture the
      // pointer so the drag keeps tracking outside the element's bounds.
      try { svgRef.current.setPointerCapture(d.pointerId); } catch (_) {}
    }
    if (!d.moved) return;
    if (d.category === "table") {
      setLiveTableOffset({ x: d.startX + ddx, y: d.startY + ddy });
    } else {
      setLiveDevicePos({ key: `${d.category}:${d.id}`, x: d.startX + ddx, y: d.startY + ddy });
    }
  }, [clientToPoint, armedPlacement, room.length, room.width]);

  const handleSvgPointerUp = useCallback((e) => {
    if (rotateDragRef.current) {
      const r = rotateDragRef.current;
      rotateDragRef.current = null;
      const p = clientToPoint(e.clientX, e.clientY);
      const angle = angleFromVector(p.x - r.centerX, p.y - r.centerY);
      if (r.category === "chair") {
        onSetChairAngle(r.id, angle);
      } else {
        onSetItemAngle(r.category, r.id, angle);
      }
      setLiveAngle(null);
      return;
    }
    const d = dragRef.current;
    if (!d) return;
    dragRef.current = null;
    if (!d.moved) {
      setLiveTableOffset(null);
      setLiveDevicePos(null);
      return;
    }
    const p = clientToPoint(e.clientX, e.clientY);
    const ddx = p.x - d.startPointM.x;
    const ddy = p.y - d.startPointM.y;
    if (d.category === "table") {
      onTableDragCommit({ x: d.startX + ddx, y: d.startY + ddy });
    } else if (d.category === "chair") {
      const chair = layoutResult.chairs[d.id];
      const newDx = d.startX + ddx;
      const newDy = d.startY + ddy;
      // Snap the chair's final on-floor position to the placement grid (and keep it
      // inside the room), then store the offset relative to its generated seat
      // position so it still rides along when the table itself is dragged.
      const snapped = nearestGridPoint(tableCenter.x + chair.x + newDx, tableCenter.y + chair.y + newDy, room);
      onChairDragCommit(d.id, snapped.x - tableCenter.x - chair.x, snapped.y - tableCenter.y - chair.y);
    } else {
      onDeviceDragCommit(d.category, d.id, d.startX + ddx, d.startY + ddy);
    }
    setLiveTableOffset(null);
    setLiveDevicePos(null);
  }, [clientToPoint, onTableDragCommit, onDeviceDragCommit, onSetItemAngle, onSetChairAngle, layoutResult.chairs, tableCenter, room.length, room.width, onChairDragCommit]);

  const handleDeleteSelected = useCallback(() => {
    if (!selection || selection.category === "table" || selection.category === "tablePod") return;
    if (selection.category === "chair") {
      onRemoveChair(selection.index);
      onSelect(null);
    } else {
      onRemoveSelected();
    }
  }, [selection, onRemoveChair, onRemoveSelected, onSelect]);

  const handleBackgroundPointerDown = useCallback((e) => {
    const p = clientToPoint(e.clientX, e.clientY);
    const clamped = { x: clamp(p.x, 0, room.length), y: clamp(p.y, 0, room.width) };
    if (armedPlacement) {
      onPlaceAt(clamped.x, clamped.y);
    } else if (selection) {
      onSelect(null);
    }
  }, [armedPlacement, clientToPoint, onPlaceAt, onSelect, room.length, room.width, selection]);

  useEffect(() => {
    if (!armedPlacement) setHoverPoint(null);
  }, [armedPlacement]);

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape") {
        if (armedPlacement) onCancelPlacement();
        else if (selection) onSelect(null);
      } else if ((e.key === "Delete" || e.key === "Backspace") && selection && selection.category !== "table" && selection.category !== "tablePod") {
        const tag = document.activeElement?.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA") return;
        e.preventDefault();
        handleDeleteSelected();
      } else if (
        (e.key === "ArrowLeft" || e.key === "ArrowRight") &&
        selection &&
        (selection.category === "chair" || ROTATABLE_CATEGORIES.includes(selection.category))
      ) {
        const tag = document.activeElement?.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA") return;
        e.preventDefault();
        const delta = e.key === "ArrowLeft" ? -15 : 15;
        if (selection.category === "chair") {
          const chair = layoutResult.chairs[selection.index];
          const current = chairOffsets[selection.index]?.angle ?? chair.angle;
          onSetChairAngle(selection.index, rotateBy(current, delta));
        } else {
          onRotateSelected(delta);
        }
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [armedPlacement, selection, onCancelPlacement, onSelect, handleDeleteSelected, onRotateSelected, layoutResult.chairs, chairOffsets, onSetChairAngle]);

  const renderDevicePos = (category, item) => {
    const key = `${category}:${item.id}`;
    if (liveDevicePos && liveDevicePos.key === key) return { x: liveDevicePos.x, y: liveDevicePos.y };
    return { x: item.x, y: item.y };
  };

  const renderDeviceAngle = (category, item) => {
    const key = `${category}:${item.id}`;
    if (liveAngle && liveAngle.key === key) return liveAngle.angle;
    return item.angle || 0;
  };

  const selectionLabel = !selection
    ? null
    : selection.category === "table"
    ? "Table & chairs"
    : selection.category === "tablePod"
    ? `Table ${selection.index + 1}`
    : selection.category === "chair"
    ? `Chair ${selection.index + 1}`
    : DEVICE_LABELS[selection.category];
  const selectionDeletable = selection && selection.category !== "table" && selection.category !== "tablePod";

  // x, y in meters from the room's top-left corner — the same origin the ruler is
  // drawn from, so this always reads consistently with the marks on the diagram.
  const selectedPosition = (() => {
    if (!selection) return null;
    if (selection.category === "table") return { x: tableCenter.x, y: tableCenter.y };
    if (selection.category === "tablePod") {
      const pod = layoutResult.tableShape.tables?.[selection.index];
      return pod ? { x: tableCenter.x + pod.x, y: tableCenter.y + pod.y } : null;
    }
    if (selection.category === "chair") {
      const chair = layoutResult.chairs[selection.index];
      if (!chair) return null;
      const off = chairOffsets[selection.index] || { dx: 0, dy: 0 };
      const liveKey = `chair:${selection.index}`;
      const live = liveDevicePos && liveDevicePos.key === liveKey ? liveDevicePos : null;
      return { x: tableCenter.x + chair.x + (live ? live.x : off.dx), y: tableCenter.y + chair.y + (live ? live.y : off.dy) };
    }
    const item = devices[selection.category]?.find((d) => d.id === selection.id);
    return item ? renderDevicePos(selection.category, item) : null;
  })();

  // Live coordinate readout shown while an item is being dragged, or while a device
  // is armed for placement and the cursor is hovering the grid before the click.
  const coordBadgePos = liveTableOffset
    ? { x: tableCenter.x, y: tableCenter.y }
    : liveDevicePos
    ? { x: liveDevicePos.x, y: liveDevicePos.y }
    : armedPlacement
    ? hoverPoint
    : null;

  return (
    <div className="relative">
      {armedPlacement && (
        <div className="rc-banner-in absolute left-2 right-2 top-2 z-10 flex items-center justify-between gap-3 rounded-lg bg-slate-900/95 px-3 py-2.5 text-sm text-white shadow-lg">
          <span>
            Click the grid to place your {armedPlacement.label}
            {hoverPoint && <span className="text-slate-300"> — {hoverPoint.x.toFixed(2)}m, {hoverPoint.y.toFixed(2)}m</span>}
          </span>
          <button
            onClick={onCancelPlacement}
            className="min-h-[36px] shrink-0 rounded-md border border-white/30 px-3 py-1 text-xs font-medium hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
          >
            Cancel
          </button>
        </div>
      )}
      <div
        ref={diagramRef}
        className="w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-sm"
        style={{ aspectRatio: `${viewBox.w} / ${viewBox.h}` }}
      >
        <svg
          ref={svgRef}
          viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
          className="block h-full w-full select-none"
          style={{ touchAction: "none", cursor: armedPlacement ? "crosshair" : "default" }}
          onPointerMove={handleSvgPointerMove}
          onPointerUp={handleSvgPointerUp}
          onPointerCancel={handleSvgPointerUp}
          onPointerLeave={() => setHoverPoint(null)}
        >
          <rect x={viewBox.x} y={viewBox.y} width={viewBox.w} height={viewBox.h} fill="#E7ECF2" />
          <rect x={0} y={0} width={room.length} height={room.width} fill="#F8FAFC" />
          <path d={gridPath} stroke="#E7EBF0" strokeWidth={1.1} vectorEffect="non-scaling-stroke" fill="none" pointerEvents="none" />
          <rect x={0} y={0} width={room.length} height={room.width} fill="none" stroke="#334155" strokeWidth={2.5} vectorEffect="non-scaling-stroke" pointerEvents="none" />
          <rect x={viewBox.x} y={viewBox.y} width={viewBox.w} height={viewBox.h} fill="transparent" onPointerDown={handleBackgroundPointerDown} />

          <RulerTicks marks={marksX} orientation="horizontal" wallAt={0} sign={-1} />
          <RulerTicks marks={marksX} orientation="horizontal" wallAt={room.width} sign={1} />
          <RulerTicks marks={marksY} orientation="vertical" wallAt={0} sign={-1} />
          <RulerTicks marks={marksY} orientation="vertical" wallAt={room.length} sign={1} />

          {devices.camera.map((cam) => {
            const pos = renderDevicePos("camera", cam);
            const angle = renderDeviceAngle("camera", cam);
            return <FovRay key={cam.id} cam={{ ...cam, x: pos.x, y: pos.y, angle }} room={room} />;
          })}

          <g
            className="rc-table-group"
            transform={`translate(${tableCenter.x} ${tableCenter.y})`}
            onPointerDown={(e) => startDrag(e, "table", "table", effectiveOffset.x, effectiveOffset.y)}
          >
            {layoutResult.tableShape.type === "pods"
              ? renderPods(layoutResult.tableShape.tables, selection, onSelect)
              : renderTableShape(layoutResult.tableShape, selection?.category === "table")}
            {layoutResult.chairs.map((c, i) => {
              if (removedChairIndices.has(i)) return null;
              const isThisChairSelected = selection?.category === "chair" && selection.index === i;
              const liveKey = `chair:${i}`;
              const live = liveDevicePos && liveDevicePos.key === liveKey ? liveDevicePos : null;
              const off = chairOffsets[i] || { dx: 0, dy: 0 };
              const chairX = c.x + (live ? live.x : off.dx);
              const chairY = c.y + (live ? live.y : off.dy);
              const liveAngleKey = `chair:${i}`;
              const chairAngle = liveAngle && liveAngle.key === liveAngleKey ? liveAngle.angle : off.angle ?? c.angle;
              return (
                <g
                  key={i}
                  transform={`translate(${chairX} ${chairY})`}
                  onDoubleClick={(e) => { e.stopPropagation(); onSelect({ category: "chair", index: i }); }}
                  onPointerDown={(e) => {
                    // Only the already-selected chair drags on its own; otherwise the
                    // pointerdown is left to bubble up and drag the whole table group.
                    if (isThisChairSelected) startChairDrag(e, i, off.dx, off.dy);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <g transform={`rotate(${chairAngle})`}>
                    <circle r={0.26} fill="transparent" />
                    <ChairIcon selected={selection?.category === "table" || isThisChairSelected} />
                    {isThisChairSelected && (
                      <TurnHandle
                        onPointerDown={(e) => startRotateDrag(e, "chair", i, tableCenter.x + chairX, tableCenter.y + chairY)}
                      />
                    )}
                  </g>
                </g>
              );
            })}
          </g>

          {["display", "microphone", "speaker", "touchPanel", "contentSharing", "door", "bookingPanel", "camera"].map((category) =>
            devices[category].map((item, idx) => {
              const pos = renderDevicePos(category, item);
              const angle = renderDeviceAngle(category, item);
              const Icon = CATEGORY_ICON[category];
              const isSelected = selection?.category === category && selection?.id === item.id;
              const stackCount = stackGroups[`${category}:${item.id}`];
              const isRotatable = ROTATABLE_CATEGORIES.includes(category);
              return (
                <g
                  key={item.id}
                  className="rc-device rc-fade-in"
                  transform={`translate(${pos.x} ${pos.y})`}
                  onPointerDown={(e) => startDrag(e, category, item.id, item.x, item.y)}
                >
                  <g transform={`rotate(${angle})`}>
                    {isSelected && (
                      <circle r={SELECTION_RING_RADIUS[category] ?? 0.24} fill="none" stroke="#2563EB" strokeWidth={2} strokeDasharray="5 4" vectorEffect="non-scaling-stroke" opacity={0.8} />
                    )}
                    {category === "display" ? (
                      <DisplayIcon widthM={displayWidthMeters(item.sizeInches)} selected={isSelected} />
                    ) : (
                      <Icon selected={isSelected} isTableCam={item.isTableCam} mount={item.mount} />
                    )}
                    {isSelected && isRotatable && (
                      <TurnHandle onPointerDown={(e) => startRotateDrag(e, category, item.id, pos.x, pos.y)} />
                    )}
                  </g>
                  <RefLabel label={refLabel(category, idx)} />
                  {!isSelected && stackCount > 1 && <StackBadge count={stackCount} />}
                </g>
              );
            })
          )}

          {coordBadgePos && (
            <g transform={`translate(${coordBadgePos.x} ${coordBadgePos.y})`} pointerEvents="none">
              <text
                x={0}
                y={-0.34}
                textAnchor="middle"
                fontSize={0.14}
                fontWeight={600}
                fill="#0F172A"
                stroke="#FFFFFF"
                strokeWidth={0.03}
                paintOrder="stroke"
              >
                {coordBadgePos.x.toFixed(2)}m, {coordBadgePos.y.toFixed(2)}m
              </text>
            </g>
          )}
        </svg>
      </div>

      {selection && (
        <div className="rc-banner-in mt-3 flex items-center justify-between gap-3 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm">
          <span className="font-medium text-blue-900">
            {selectionLabel} selected
            {selection.category === "table" ? " — drag to reposition" : ""}
            {selection.category === "tablePod" ? " — resize with the table length/width controls" : ""}
            {selectedPosition && (
              <span className="font-normal text-blue-700"> — {selectedPosition.x.toFixed(2)}m, {selectedPosition.y.toFixed(2)}m</span>
            )}
          </span>
          <div className="flex items-center gap-1">
            {selectionDeletable && (
              <button
                onClick={handleDeleteSelected}
                className="flex min-h-[36px] items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold text-red-600 transition-transform duration-100 hover:bg-red-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500 active:scale-[0.96]"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
            )}
            <button
              aria-label="Deselect"
              onClick={() => onSelect(null)}
              className="flex h-9 w-9 items-center justify-center rounded-md text-blue-700 hover:bg-blue-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
