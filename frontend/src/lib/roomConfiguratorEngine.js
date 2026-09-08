// Pure geometry + configuration logic for the Meeting Room / AV Configurator.
// Coordinate system: meters, origin top-left of room, x → right, y → down.
// Rotation angle convention: 0° = facing "up" (toward y=0), clockwise, matching compass bearing.

export const GRID_STEP = 0.5 / 3;
export const WALL_SNAP_DISTANCE = 0.55;
export const ROTATE_STEP = 15;
export const CORNER_GAP = 0.42;
export const ROOM_MARGIN = 0.75;

export const ROOM_LIMITS = { length: [3, 100], width: [2.5, 100], height: [2.2, 10] };
// Absolute floor/ceiling for table size, regardless of room size.
export const TABLE_LIMITS = { length: [1, 20], width: [0.6, 8] };
export const CHAIR_LIMITS = [2, 24];

// Meters of clearance reserved around the table (both ends of an axis combined) so
// chairs and a walkway always fit — the table's real usable range shrinks and grows
// with the room instead of using one fixed range for every room size.
const TABLE_ROOM_CLEARANCE = 2.0;

export function getTableLimits(room) {
  const maxLength = clamp(room.length - TABLE_ROOM_CLEARANCE, TABLE_LIMITS.length[0], TABLE_LIMITS.length[1]);
  const maxWidth = clamp(room.width - TABLE_ROOM_CLEARANCE, TABLE_LIMITS.width[0], TABLE_LIMITS.width[1]);
  return {
    length: [TABLE_LIMITS.length[0], maxLength],
    width: [TABLE_LIMITS.width[0], maxWidth],
  };
}

export const LAYOUTS = [
  { id: "rectangular", label: "Rectangular Boardroom", hint: "Classic long table, chairs on every side" },
  { id: "oval", label: "Oval Table", hint: "Softer boardroom shape, even seating" },
  { id: "ushape", label: "U-Shape", hint: "Open-front layout for workshops & training" },
  { id: "classroom", label: "Classroom / Training", hint: "Rows of desks, all facing the front" },
  { id: "theater", label: "Theater Rows", hint: "Chairs only, no tables" },
  { id: "collaboration", label: "Open Collaboration", hint: "Small pods for informal work" },
];

export const PLATFORMS = ["Microsoft Teams Rooms", "Zoom Rooms", "Google Meet", "Cisco Webex", "BYOD / Bring Your Own Device"];
export const AUDIO_PREFERENCES = ["Ceiling Microphone Array", "Table Microphone Pods", "Soundbar (Integrated Mic + Speaker)", "Wireless Boundary Microphones"];
// Multi-select: a room's walls are often mixed materials (e.g. a glass wall on one
// side, drywall on the rest), so more than one can be selected at once.
export const WALL_MATERIALS = ["Gypsum (Drywall)", "Concrete", "Glass", "Wood", "Brick", "Acoustic Fabric Panel"];
export const FLOOR_TYPES = ["Carpet", "Wood / Hardwood", "Tile", "Polished Concrete", "Vinyl / Laminate"];
export const CEILING_TYPES = ["Suspended (Drop) Ceiling", "Drywall (Hard Lid)", "Exposed / Open Ceiling", "Acoustic Tile", "Wood Slat"];
export const TABLE_TOP_MATERIALS = ["Wood Veneer", "Solid Wood", "Glass", "Marble", "Laminate"];
export const DISPLAY_SIZES = [32, 43, 50, 55, 65, 75, 85, 98, 110];
export const CAMERA_FOVS = [60, 78, 90, 120, 180];

// Camera intelligence behaviors, in the spirit of the framing modes real conferencing
// cameras ship with today (Poly DirectorAI's speaker tracking / group framing, Jabra
// PanaCast's virtual director, Neat Symmetry's speaker and individual framing) — a
// room can combine more than one, since these are firmware behaviors a camera can
// often switch between live, not mutually exclusive hardware choices.
export const CAMERA_FEATURES = [
  {
    id: "trackActiveSpeaker",
    label: "Track Active Speaker",
    description: "Camera pans, tilts, and zooms to follow whoever is talking — static or moving around the room.",
  },
  {
    id: "staticWideView",
    label: "Single Static View",
    description: "One fixed wide shot keeps everyone in the room visible at once, no automatic movement.",
  },
  {
    id: "multiSpeakerFraming",
    label: "Frame Active Speakers",
    description: "Frames the most recent active speakers — two or more at a time — as the conversation moves around.",
  },
  {
    id: "individualTiles",
    label: "Individual Participant Frames",
    description: "Every participant gets their own individual frame, gallery-style, for the remote side.",
  },
];

export const DEVICE_ORDER = ["display", "camera", "microphone", "speaker", "touchPanel", "contentSharing", "door", "bookingPanel"];
export const DEVICE_LABELS = {
  display: "Display",
  camera: "Camera",
  microphone: "Microphones",
  speaker: "Speakers",
  touchPanel: "Touch panel",
  contentSharing: "Content sharing",
  door: "Door",
  bookingPanel: "Booking panel",
};

// Short reference codes shown as canvas labels and in the text brief (D1, C1, M1, SP1, ...).
export const DEVICE_REF_PREFIX = {
  display: "D",
  camera: "C",
  microphone: "M",
  speaker: "SP",
  touchPanel: "TP",
  contentSharing: "CS",
  door: "DR",
  bookingPanel: "BP",
};
export const refCode = (category, index) => `${DEVICE_REF_PREFIX[category]}${index + 1}`;
// Full-name version used for on-canvas labels, e.g. "Booking panel 1".
export const refLabel = (category, index) => `${DEVICE_LABELS[category]} ${index + 1}`;

let uidCounter = 1;
export const uid = (prefix = "id") => `${prefix}-${(uidCounter++).toString(36)}-${Date.now().toString(36).slice(-4)}`;

export const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
export const snap = (v, step = GRID_STEP) => Math.round(v / step) * step;
export const rotateBy = (angle, delta) => ((angle + delta) % 360 + 360) % 360;

// Angle (in our 0deg-is-up, clockwise convention) pointing from the origin toward (dx, dy).
export function angleFromVector(dx, dy) {
  let a = (Math.atan2(dx, -dy) * 180) / Math.PI;
  if (a < 0) a += 360;
  return a;
}

export function nearestGridPoint(x, y, room, step = GRID_STEP) {
  return {
    x: clamp(snap(x, step), 0, room.length),
    y: clamp(snap(y, step), 0, room.width),
  };
}

export function displayWidthMeters(sizeInches) {
  const diagonalM = sizeInches * 0.0254;
  return diagonalM * 0.8714; // 16:9 diagonal -> width ratio
}

// --- direction / facing helpers -------------------------------------------------

function dirVector(angleDeg) {
  const r = (angleDeg * Math.PI) / 180;
  return { dx: Math.sin(r), dy: -Math.cos(r) };
}

function faceCenterAngle(dx, dy) {
  let a = (Math.atan2(-dx, dy) * 180) / Math.PI;
  if (a < 0) a += 360;
  return a;
}

function toLocal(absX, absY, room) {
  return { x: absX - room.length / 2, y: absY - room.width / 2 };
}

// --- perimeter distribution helpers ---------------------------------------------

// Minimum center-to-center chair spacing for ergonomic meeting-room seating: 610mm
// (24"), the standard minimum per-seat clearance at a conference table in workplace
// facility-planning guidelines (e.g. Neufert Architects' Data, BIFMA-aligned office
// planning standards) — enough shoulder/elbow room and clearance to pull a chair
// back, well beyond the chairs' own ~0.34m physical footprint (which would leave
// them touching with zero gap).
const CHAIR_SEAT_SPACING = 0.61;

function rectPerimeterLength(w, h, inset = 0.4, cornerGap = CORNER_GAP) {
  const W = w + inset * 2;
  const H = h + inset * 2;
  const topLen = Math.max(W - 2 * cornerGap, 0.2);
  const sideLen = Math.max(H - 2 * cornerGap, 0.2);
  return topLen * 2 + sideLen * 2;
}

function ellipsePerimeterLength(rx, ry, inset = 0.4) {
  const a = rx + inset;
  const b = ry + inset;
  // Ramanujan's approximation — exact ellipse circumference has no closed form.
  const h = (a - b) ** 2 / (a + b) ** 2;
  return Math.PI * (a + b) * (1 + (3 * h) / (10 + Math.sqrt(4 - 3 * h)));
}

function uShapePerimeterLength(boxW, boxH, thickness, cornerGap = CORNER_GAP) {
  const legLenFull = boxH - thickness;
  const backLenFull = boxW;
  const legLen = Math.max(legLenFull - 2 * cornerGap, 0.15);
  const backLen = Math.max(backLenFull - 2 * cornerGap, 0.15);
  return legLen * 2 + backLen;
}

function rectPerimeterPositions(w, h, count, inset = 0.4, cornerGap = CORNER_GAP) {
  if (count <= 0) return [];
  const W = w + inset * 2;
  const H = h + inset * 2;
  // Shorten each edge by cornerGap at both ends so no chair lands at/near a corner.
  const topLen = Math.max(W - 2 * cornerGap, 0.2);
  const sideLen = Math.max(H - 2 * cornerGap, 0.2);
  const bottomLen = topLen;
  const leftLen = sideLen;
  const total = topLen + sideLen + bottomLen + leftLen;
  const pts = [];
  for (let i = 0; i < count; i++) {
    let d = (total * i) / count + topLen / 2;
    d %= total;
    let x, y, angle;
    if (d < topLen) {
      x = -topLen / 2 + d; y = -H / 2; angle = 180;
    } else if (d < topLen + sideLen) {
      const t = d - topLen; x = W / 2; y = -sideLen / 2 + t; angle = 270;
    } else if (d < topLen + sideLen + bottomLen) {
      const t = d - (topLen + sideLen); x = bottomLen / 2 - t; y = H / 2; angle = 0;
    } else {
      const t = d - (topLen + sideLen + bottomLen); x = -W / 2; y = leftLen / 2 - t; angle = 90;
    }
    pts.push({ x, y, angle });
  }
  return pts;
}

function ellipsePerimeterPositions(rx, ry, count, inset = 0.4) {
  if (count <= 0) return [];
  const pts = [];
  for (let i = 0; i < count; i++) {
    const t = (2 * Math.PI * i) / count - Math.PI / 2;
    const ex = (rx + inset) * Math.cos(t);
    const ey = (ry + inset) * Math.sin(t);
    pts.push({ x: ex, y: ey, angle: faceCenterAngle(ex, ey) });
  }
  return pts;
}

function uShapeSegments(boxW, boxH, thickness) {
  return [
    { x: -boxW / 2, y: -boxH / 2, w: thickness, h: boxH }, // left leg
    { x: boxW / 2 - thickness, y: -boxH / 2, w: thickness, h: boxH }, // right leg
    { x: -boxW / 2, y: boxH / 2 - thickness, w: boxW, h: thickness }, // back bar
  ];
}

function uShapePositions(boxW, boxH, thickness, count, inset = 0.4, cornerGap = CORNER_GAP) {
  if (count <= 0) return [];
  const legLenFull = boxH - thickness;
  const backLenFull = boxW;
  // Shorten each of the 3 segments at both ends (open tip + inner corner) so no
  // chair lands right at the open ends or where a leg meets the back bar.
  const legLen = Math.max(legLenFull - 2 * cornerGap, 0.15);
  const backLen = Math.max(backLenFull - 2 * cornerGap, 0.15);
  const legMargin = (legLenFull - legLen) / 2;
  const backMargin = (backLenFull - backLen) / 2;
  const total = legLen * 2 + backLen;
  const pts = [];
  for (let i = 0; i < count; i++) {
    const d = (total * (i + 0.5)) / count;
    let x, y, angle;
    if (d < legLen) {
      const t = d + legMargin; x = -boxW / 2 - inset; y = -boxH / 2 + t; angle = 90;
    } else if (d < legLen + backLen) {
      const t = (d - legLen) + backMargin; x = -boxW / 2 + t; y = boxH / 2 + inset; angle = 0;
    } else {
      const t = (d - legLen - backLen) + legMargin; x = boxW / 2 + inset; y = boxH / 2 - thickness - t; angle = 270;
    }
    pts.push({ x, y, angle });
  }
  return pts;
}

// Row-seating spacing is fixed and realistic (not compressed to force a count to
// fit) — rows/seats-per-row are capped by how many actually fit the room at that
// spacing, so "how many chairs can this room hold" is a real, well-defined number.
//
// Classroom/theater seating is organized into a grid of blocks rather than one
// unbroken row/column: no contiguous run of chairs ever exceeds ROW_BLOCK_SEATS (a
// row) or ROW_BLOCK_DEPTH (a front-to-back band) before a 1m aisle — so a large
// room reads as proper rows-and-columns-of-5 seating with walking space, not a
// single very-wide row or very-deep column. SEAT_PITCH * ROW_PITCH = 1.2, meeting
// the minimum floor area every chair is guaranteed (aisles are extra, on top of
// this — they don't count against any single chair's own footprint).
const ROW_BLOCK_SEATS = 5; // max contiguous chairs across a row before an aisle
const ROW_BLOCK_DEPTH = 5; // max contiguous rows front-to-back before a cross-aisle
const SEAT_PITCH = 1.0; // m, seat-to-seat spacing
const ROW_PITCH = 1.2; // m, row-to-row spacing
const ROW_BLOCK_GAP = 1.0; // m, aisle between blocks, both across a row and between row-bands

const CLASSROOM_SPACING = { marginX: 0.6, marginTop: 1.4, marginBottom: 0.6 };
const THEATER_SPACING = { marginX: 0.6, marginTop: 1.2, marginBottom: 0.6 };

// How many `pitch`-sized units fit end-to-end in `span`, inserting a `gap`-sized
// aisle every time a run reaches `groupSize` units — used for both the seat axis
// (groupSize = ROW_BLOCK_SEATS) and the row axis (groupSize = ROW_BLOCK_DEPTH).
function maxUnitsInSpan(span, groupSize, pitch, gap) {
  let n = 0;
  let used = 0;
  for (;;) {
    const startsNewGroup = n > 0 && n % groupSize === 0;
    const next = used + (startsNewGroup ? gap : 0) + pitch;
    if (next > span + 1e-6) break;
    used = next;
    n++;
  }
  return n;
}

// Offset (from a row's own start) of the s-th seat in that row, in meters —
// leaves a ROW_BLOCK_GAP aisle every ROW_BLOCK_SEATS seats.
function rowBlockX(s) {
  const block = Math.floor(s / ROW_BLOCK_SEATS);
  const withinBlock = s % ROW_BLOCK_SEATS;
  return block * (ROW_BLOCK_SEATS * SEAT_PITCH + ROW_BLOCK_GAP) + withinBlock * SEAT_PITCH;
}

// Offset (from the seating area's front edge) of row index r, in meters — leaves a
// ROW_BLOCK_GAP cross-aisle every ROW_BLOCK_DEPTH rows.
function rowBandY(r) {
  const band = Math.floor(r / ROW_BLOCK_DEPTH);
  const withinBand = r % ROW_BLOCK_DEPTH;
  return band * (ROW_BLOCK_DEPTH * ROW_PITCH + ROW_BLOCK_GAP) + withinBand * ROW_PITCH;
}

// Total width a row of `seatsInRow` chairs actually occupies, aisles included —
// used to center that row (or the whole grid) in the room.
function rowSpanWidth(seatsInRow) {
  return seatsInRow <= 0 ? 0 : rowBlockX(seatsInRow - 1) + SEAT_PITCH;
}

function rowCapacity(room, spacing) {
  const usableW = Math.max(0, room.length - spacing.marginX * 2);
  const usableD = Math.max(0, room.width - spacing.marginTop - spacing.marginBottom);
  const seatsPerRow = Math.max(1, maxUnitsInSpan(usableW, ROW_BLOCK_SEATS, SEAT_PITCH, ROW_BLOCK_GAP));
  const maxRows = Math.max(1, maxUnitsInSpan(usableD, ROW_BLOCK_DEPTH, ROW_PITCH, ROW_BLOCK_GAP));
  return { seatsPerRow, maxRows };
}

export function getMaxChairsForLayout(layout, room, table) {
  if (layout === "classroom") {
    const { seatsPerRow, maxRows } = rowCapacity(room, CLASSROOM_SPACING);
    return seatsPerRow * maxRows;
  }
  if (layout === "theater") {
    const { seatsPerRow, maxRows } = rowCapacity(room, THEATER_SPACING);
    return seatsPerRow * maxRows;
  }
  // Rectangular/oval/U-shape seat chairs around the table's own perimeter — cap the
  // count so chairs are never squeezed tighter than the ergonomic minimum spacing.
  if (table && (layout === "rectangular" || layout === "oval" || layout === "ushape")) {
    const boxW = table.orientation === 0 ? table.length : table.width;
    const boxH = table.orientation === 0 ? table.width : table.length;
    let perimeter;
    if (layout === "oval") {
      perimeter = ellipsePerimeterLength(boxW / 2, boxH / 2, 0.42);
    } else if (layout === "ushape") {
      const thickness = clamp(table.width, 0.6, 1.0);
      const depth = Math.max(boxH, thickness * 3, 1.9);
      perimeter = uShapePerimeterLength(boxW, depth, thickness);
    } else {
      perimeter = rectPerimeterLength(boxW, boxH, 0.4);
    }
    return clamp(Math.floor(perimeter / CHAIR_SEAT_SPACING), CHAIR_LIMITS[0], CHAIR_LIMITS[1]);
  }
  // Open Collaboration: keep adding pods only while the grid can still fit each
  // one (with its chair ring) inside its own cell — beyond that, more pods would
  // start overlapping their neighbors' chairs.
  if (layout === "collaboration") {
    const perPod = 4;
    let podCount = 1;
    for (let candidate = 2; candidate * perPod <= CHAIR_LIMITS[1] + perPod; candidate++) {
      const { cellW, cellH } = collaborationGrid(room, candidate);
      if (maxSafePodRadius(cellW, cellH) < POD_RADIUS_LIMITS[0]) break;
      podCount = candidate;
    }
    return clamp(podCount * perPod, CHAIR_LIMITS[0], CHAIR_LIMITS[1]);
  }
  return CHAIR_LIMITS[1];
}

export function getChairLimits(layout, room, table) {
  return [CHAIR_LIMITS[0], Math.max(CHAIR_LIMITS[0], getMaxChairsForLayout(layout, room, table))];
}

function rowSeatingLayout(room, count, spacing, { withDesks, deskDepth } = {}) {
  const { seatsPerRow, maxRows } = rowCapacity(room, spacing);
  const rows = Math.min(maxRows, Math.max(1, Math.ceil(count / seatsPerRow)));
  const chairs = [], desks = [];
  let remaining = count;
  for (let r = 0; r < rows; r++) {
    const seatsInRow = Math.min(seatsPerRow, remaining);
    if (seatsInRow <= 0) break;
    remaining -= seatsInRow;
    const rowY = spacing.marginTop + rowBandY(r);
    const rowSpan = rowSpanWidth(seatsInRow);
    const rowStartX = room.length / 2 - rowSpan / 2;

    if (withDesks) {
      // One desk strip per contiguous block of seats in this row, so a desk never
      // spans across an aisle gap the way a single full-row-width desk would.
      const blocksInRow = Math.ceil(seatsInRow / ROW_BLOCK_SEATS);
      for (let b = 0; b < blocksInRow; b++) {
        const blockStartSeat = b * ROW_BLOCK_SEATS;
        const seatsInBlock = Math.min(ROW_BLOCK_SEATS, seatsInRow - blockStartSeat);
        const deskLocal = toLocal(rowStartX + rowBlockX(blockStartSeat), rowY - deskDepth / 2 - 0.3, room);
        desks.push({ x: deskLocal.x, y: deskLocal.y, w: seatsInBlock * SEAT_PITCH, h: deskDepth });
      }
    }
    for (let s = 0; s < seatsInRow; s++) {
      const abs = { x: rowStartX + rowBlockX(s) + SEAT_PITCH / 2, y: withDesks ? rowY + 0.15 : rowY };
      chairs.push({ ...toLocal(abs.x, abs.y, room), angle: 0 });
    }
  }
  return { chairs, desks };
}

function classroomLayout(room, deskDepth, count) {
  return rowSeatingLayout(room, count, CLASSROOM_SPACING, { withDesks: true, deskDepth });
}

function theaterLayout(room, count) {
  return rowSeatingLayout(room, count, THEATER_SPACING, { withDesks: false });
}

// Absolute floor/ceiling a pod can be resized to. The real per-arrangement ceiling
// is tighter — see maxSafePodRadius — this is just the outer sane range.
export const POD_RADIUS_LIMITS = [0.3, 1.2];

// Clearance from a pod's edge to the ring its chairs sit on — same role as the
// `inset` used for the other perimeter layouts.
const POD_CHAIR_RING_INSET = 0.32;

// Grid placement for `podCount` pods in the room — shared by both the layout
// generator and the capacity check below, so they always agree on what fits.
function collaborationGrid(room, podCount) {
  const aspect = room.length / room.width;
  let cols = Math.max(1, Math.round(Math.sqrt(podCount * aspect)));
  let rows = Math.max(1, Math.ceil(podCount / cols));
  while (cols * rows < podCount) { cols++; rows = Math.ceil(podCount / cols); }
  const marginX = Math.min(1.2, room.length * 0.12);
  const marginY = Math.min(1.2, room.width * 0.12);
  const cellW = (room.length - marginX * 2) / cols;
  const cellH = (room.width - marginY * 2) / rows;
  return { cols, rows, cellW, cellH, marginX, marginY };
}

// The largest a pod (including its chair ring) can be while staying inside its
// own grid cell — every cell is half this footprint away from its neighbor's,
// so two pods sized at or under this can never have overlapping chairs.
function maxSafePodRadius(cellW, cellH) {
  return Math.min(cellW, cellH) / 2 - POD_CHAIR_RING_INSET;
}

// The radius range a specific pod can be resized to without its chairs reaching
// into a neighboring pod's cell, for the given room/chair count.
export function getPodRadiusLimits(room, chairCount) {
  const podCount = Math.max(1, Math.ceil(chairCount / 4));
  const { cellW, cellH } = collaborationGrid(room, podCount);
  const safeMax = clamp(maxSafePodRadius(cellW, cellH), POD_RADIUS_LIMITS[0], POD_RADIUS_LIMITS[1]);
  return [POD_RADIUS_LIMITS[0], safeMax];
}

function collaborationLayout(room, count, podOverrides = {}) {
  const perPod = 4;
  const podCount = Math.max(1, Math.ceil(count / perPod));
  const { cols, rows, cellW, cellH, marginX, marginY } = collaborationGrid(room, podCount);
  // Size pods to fill their cell as much as ergonomic chair spacing allows, so
  // seating stays generous without ever reaching into a neighboring pod's chairs.
  const defaultPodRadius = clamp(maxSafePodRadius(cellW, cellH), POD_RADIUS_LIMITS[0], 0.6);
  const overrideMax = clamp(maxSafePodRadius(cellW, cellH), POD_RADIUS_LIMITS[0], POD_RADIUS_LIMITS[1]);
  const chairs = [], tables = [];
  let remaining = count, idx = 0;
  for (let r = 0; r < rows && idx < podCount; r++) {
    for (let c = 0; c < cols && idx < podCount; c++) {
      const absX = marginX + cellW * (c + 0.5);
      const absY = marginY + cellH * (r + 0.5);
      const local = toLocal(absX, absY, room);
      const seatsHere = Math.min(perPod, remaining);
      remaining -= seatsHere;
      // A manual resize is capped at this cell's safe radius too, or its chairs
      // would overlap the neighboring pod's.
      const podRadius = podOverrides[idx] != null ? clamp(podOverrides[idx], POD_RADIUS_LIMITS[0], overrideMax) : defaultPodRadius;
      tables.push({ x: local.x, y: local.y, radius: podRadius });
      ellipsePerimeterPositions(podRadius, podRadius, seatsHere, POD_CHAIR_RING_INSET).forEach((p) =>
        chairs.push({ x: local.x + p.x, y: local.y + p.y, angle: p.angle })
      );
      idx++;
    }
  }
  return { chairs, tables };
}

// --- main layout generator --------------------------------------------------------

export function generateLayout(layoutType, room, table, chairCount, podOverrides = {}) {
  const boxW = table.orientation === 0 ? table.length : table.width;
  const boxH = table.orientation === 0 ? table.width : table.length;

  switch (layoutType) {
    case "oval": {
      const chairs = ellipsePerimeterPositions(boxW / 2, boxH / 2, chairCount, 0.42);
      return { tableShape: { type: "ellipse", w: boxW, h: boxH }, chairs, groupBounds: { w: boxW + 1.7, h: boxH + 1.7 } };
    }
    case "ushape": {
      const thickness = clamp(table.width, 0.6, 1.0);
      const depth = Math.max(boxH, thickness * 3, 1.9);
      const segments = uShapeSegments(boxW, depth, thickness);
      const chairs = uShapePositions(boxW, depth, thickness, chairCount, 0.42);
      return { tableShape: { type: "segments", segments, w: boxW, h: depth }, chairs, groupBounds: { w: boxW + 1.7, h: depth + 1.7 } };
    }
    case "classroom": {
      const deskDepth = clamp(table.width, 0.5, 0.9);
      const { chairs, desks } = classroomLayout(room, deskDepth, chairCount);
      return { tableShape: { type: "desks", desks }, chairs, groupBounds: { w: Math.max(room.length - 1, 1), h: Math.max(room.width - 1, 1) } };
    }
    case "theater": {
      const { chairs } = theaterLayout(room, chairCount);
      return { tableShape: { type: "none" }, chairs, groupBounds: { w: Math.max(room.length - 1, 1), h: Math.max(room.width - 1, 1) } };
    }
    case "collaboration": {
      const { chairs, tables } = collaborationLayout(room, chairCount, podOverrides);
      return { tableShape: { type: "pods", tables }, chairs, groupBounds: { w: Math.max(room.length - 1, 1), h: Math.max(room.width - 1, 1) } };
    }
    case "rectangular":
    default: {
      const chairs = rectPerimeterPositions(boxW, boxH, chairCount, 0.4);
      return { tableShape: { type: "rect", w: boxW, h: boxH }, chairs, groupBounds: { w: boxW + 1.7, h: boxH + 1.7 } };
    }
  }
}

export function clampTableOffset(offset, room, groupBounds) {
  const maxX = Math.max(0, (room.length - groupBounds.w) / 2);
  const maxY = Math.max(0, (room.width - groupBounds.h) / 2);
  return { x: clamp(offset.x, -maxX, maxX), y: clamp(offset.y, -maxY, maxY) };
}

// --- device placement --------------------------------------------------------------

export function snapToNearestEdge(x, y, room) {
  const d = { top: y, bottom: room.width - y, left: x, right: room.length - x };
  const edge = Object.entries(d).sort((a, b) => a[1] - b[1])[0][0];
  const clampedX = clamp(x, 0.3, room.length - 0.3);
  const clampedY = clamp(y, 0.3, room.width - 0.3);
  let nx = x, ny = y, angle = 0;
  switch (edge) {
    case "top": ny = 0; nx = clampedX; angle = 180; break;
    case "bottom": ny = room.width; nx = clampedX; angle = 0; break;
    case "left": nx = 0; ny = clampedY; angle = 90; break;
    default: nx = room.length; ny = clampedY; angle = 270; break;
  }
  return { x: nx, y: ny, angle, edge };
}

export function resolvePlacement(category, x, y, room) {
  if (category === "door" || category === "bookingPanel") {
    const e = snapToNearestEdge(x, y, room);
    return { x: e.x, y: e.y, angle: e.angle, edge: e.edge, mount: "wall" };
  }
  if (category === "display" || category === "touchPanel") {
    const distToEdge = Math.min(x, room.length - x, y, room.width - y);
    if (distToEdge < WALL_SNAP_DISTANCE) {
      const e = snapToNearestEdge(x, y, room);
      return { x: e.x, y: e.y, angle: e.angle, mount: "wall" };
    }
    const g = nearestGridPoint(x, y, room);
    return { x: g.x, y: g.y, angle: 0, mount: category === "display" ? "free" : "table" };
  }
  const g = nearestGridPoint(x, y, room);
  return { x: g.x, y: g.y, angle: 0 };
}

export function microphoneSpreadPosition(index, count, tableCenterAbs, tableBoxWAbs) {
  const frac = count <= 1 ? 0.5 : index / (count - 1);
  const span = Math.max(tableBoxWAbs - 0.6, 0.5);
  return nearestGridPointRaw({
    x: tableCenterAbs.x + (frac - 0.5) * span,
    y: tableCenterAbs.y,
  });
}
function nearestGridPointRaw(p) {
  return { x: snap(p.x), y: snap(p.y) };
}

export function cameraFacingToward(camAbs, targetAbs) {
  return faceCenterAngle(camAbs.x - targetAbs.x, camAbs.y - targetAbs.y);
}

// --- camera field-of-view geometry --------------------------------------------------

function rayRoomIntersection(x, y, angleDeg, room) {
  const { dx, dy } = dirVector(angleDeg);
  const eps = 1e-9;
  let tMin = Infinity;
  const candidates = [];
  if (dx > eps) candidates.push((room.length - x) / dx);
  if (dx < -eps) candidates.push((0 - x) / dx);
  if (dy > eps) candidates.push((room.width - y) / dy);
  if (dy < -eps) candidates.push((0 - y) / dy);
  candidates.forEach((t) => { if (t > 0 && t < tMin) tMin = t; });
  if (!isFinite(tMin)) tMin = 0;
  return { x: x + dx * tMin, y: y + dy * tMin };
}

export function generateFovPolygon(x, y, facingDeg, fovDeg, room, segments = 28) {
  const half = fovDeg / 2;
  const n = fovDeg >= 360 ? segments : Math.max(6, Math.round((segments * fovDeg) / 180));
  const pts = [{ x, y }];
  for (let i = 0; i <= n; i++) {
    const a = facingDeg - half + (fovDeg * i) / n;
    pts.push(rayRoomIntersection(x, y, a, room));
  }
  return pts;
}

export function fovEdgeRays(x, y, facingDeg, fovDeg, room) {
  const half = fovDeg / 2;
  return [
    rayRoomIntersection(x, y, facingDeg - half, room),
    rayRoomIntersection(x, y, facingDeg + half, room),
  ];
}

// --- room classification -------------------------------------------------------------

// Layout shapes that are functionally distinct regardless of floor area get their own
// label; everything else (boardroom-style layouts) is classified by floor area.
export function classifyRoomType({ layout, room }) {
  if (layout === "classroom") return "Classroom";
  if (layout === "theater") return "Auditorium";
  if (layout === "collaboration") return "Collaboration Space";
  const area = room.length * room.width;
  if (area < 12) return "Huddle Room";
  if (area < 25) return "Small Room";
  if (area < 45) return "Medium Room";
  if (area < 80) return "Large Room";
  return "Extra-Large Room";
}

// --- configuration brief ------------------------------------------------------------

export function recommendationNotes(state) {
  const { room, chairCount, layout, devices } = state;
  const notes = [];
  if (devices.display.length === 0) notes.push("Add at least one display — none is currently selected for this room.");
  if (devices.camera.length === 0) notes.push("Add at least one camera to enable video conferencing.");
  if (devices.camera.length && room.length > 6.5 && devices.camera.every((c) => !c.isTableCam && c.fov < 90))
    notes.push("Room length exceeds 6.5m — consider a wider FOV camera or a second camera for full coverage.");
  if (devices.microphone.length === 0 && chairCount > 6)
    notes.push("Rooms with 6+ seats usually need dedicated ceiling or table microphones for even pickup.");
  if (devices.speaker.length === 0)
    notes.push("Add at least one speaker so remote audio is audible throughout the room.");
  if (devices.touchPanel.length === 0)
    notes.push("A touch panel is recommended for one-touch join and in-room control.");
  if (layout === "rectangular" && chairCount > 12)
    notes.push("For 12+ seats, an oval table or dual displays can improve sightlines from the far end.");
  if (devices.door.length === 0)
    notes.push("No door position marked — confirm egress and cable-path clearance during the site survey.");
  if (devices.door.length > 0 && devices.bookingPanel.length === 0)
    notes.push("Consider a booking panel outside the door to show live room availability.");
  if (!notes.length) notes.push("Configuration looks complete — confirm exact placements during the site survey.");
  return notes.slice(0, 5);
}

// x, y in meters from the room's top-left corner (0,0) — the same origin the ruler
// on the diagram is drawn from, so a coordinate here can be read straight off it.
const posLabel = (item) => `${item.x.toFixed(2)}m, ${item.y.toFixed(2)}m`;

export function buildConfigBrief(state) {
  const { room, table, chairCount, layout, platform, audioPreference, devices, tableOffset, wallMaterials, floorType, ceilingType, tableTopMaterial } = state;
  const layoutLabel = LAYOUTS.find((l) => l.id === layout)?.label || layout;
  const tableCenterX = room.length / 2 + (tableOffset?.x || 0);
  const tableCenterY = room.width / 2 + (tableOffset?.y || 0);
  const lines = [];
  lines.push("MEETING ROOM / AV CONFIGURATION BRIEF");
  lines.push(`Generated ${new Date().toLocaleDateString()}`);
  lines.push("");
  lines.push(`Room size: ${room.length.toFixed(1)}m (L) x ${room.width.toFixed(1)}m (W) x ${room.height.toFixed(1)}m (H)`);
  lines.push(`Wall material: ${wallMaterials?.length ? wallMaterials.join(", ") : "None selected"}`);
  lines.push(`Floor: ${floorType}`);
  lines.push(`Ceiling: ${ceilingType}`);
  lines.push(
    `Table: ${table.length.toFixed(1)}m x ${table.width.toFixed(1)}m — ${table.orientation === 0 ? "landscape" : "portrait"} orientation, centered at ${tableCenterX.toFixed(2)}m, ${tableCenterY.toFixed(2)}m, ${tableTopMaterial} top`
  );
  lines.push(`Layout: ${layoutLabel}`);
  lines.push(`Seating: ${chairCount} chairs`);
  lines.push(`Platform: ${platform}`);
  lines.push(
    `Camera features: ${
      state.cameraFeatures?.length
        ? state.cameraFeatures.map((id) => CAMERA_FEATURES.find((f) => f.id === id)?.label || id).join(", ")
        : "None selected"
    }`
  );
  lines.push("");
  lines.push("DEVICES  (reference codes match the labels shown on the room diagram; position is x, y in meters from the room's top-left corner, matching the ruler on the diagram)");
  lines.push(
    `- Displays: ${devices.display.length}${devices.display.length ? " (" + devices.display.map((d, i) => `${refCode("display", i)}: ${d.sizeInches}" at ${posLabel(d)}`).join(", ") + ")" : ""}`
  );
  lines.push(
    `- Cameras: ${devices.camera.length}${devices.camera.length ? " (" + devices.camera.map((c, i) => `${refCode("camera", i)}: ${c.isTableCam ? "Neat 360°" : `${c.fov}° FOV`} at ${posLabel(c)}`).join(", ") + ")" : ""}`
  );
  lines.push(
    `- Microphones: ${devices.microphone.length}${devices.microphone.length ? " (" + devices.microphone.map((a, i) => `${refCode("microphone", i)} at ${posLabel(a)}`).join(", ") + ")" : ""} — preference: ${audioPreference}`
  );
  lines.push(
    `- Speakers: ${devices.speaker.length}${devices.speaker.length ? " (" + devices.speaker.map((s, i) => `${refCode("speaker", i)} at ${posLabel(s)}`).join(", ") + ")" : ""}`
  );
  lines.push(`- Touch panel: ${devices.touchPanel.length ? `Yes (${devices.touchPanel.map((t, i) => `${refCode("touchPanel", i)} at ${posLabel(t)}`).join(", ")})` : "Not included"}`);
  lines.push(`- Content sharing: ${devices.contentSharing.length ? `Yes (${devices.contentSharing.map((c, i) => `${refCode("contentSharing", i)} at ${posLabel(c)}`).join(", ")})` : "Not included"}`);
  lines.push(
    `- Doors: ${devices.door.length}${devices.door.length ? " (" + devices.door.map((d, i) => `${refCode("door", i)}: ${d.edge} wall at ${posLabel(d)}`).join(", ") + ")" : ""}`
  );
  lines.push(
    `- Booking panel: ${devices.bookingPanel.length ? `Yes (${devices.bookingPanel.map((d, i) => `${refCode("bookingPanel", i)}: ${d.edge} wall at ${posLabel(d)}`).join(", ")})` : "Not included"}`
  );
  if (state.additionalNotes?.trim()) {
    lines.push("");
    lines.push("ADDITIONAL NOTES");
    lines.push(state.additionalNotes.trim());
  }
  lines.push("");
  lines.push("RECOMMENDED NOTES");
  recommendationNotes(state).forEach((n) => lines.push(`- ${n}`));
  return lines.join("\n");
}
