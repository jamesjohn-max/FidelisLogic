import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import {
  LAYOUTS,
  DEVICE_LABELS,
  DEVICE_ORDER,
  CAMERA_FEATURES,
  ROOM_MARGIN,
  refCode,
  recommendationNotes,
} from "./roomConfiguratorEngine";

// This report is built entirely from the configurator's data model with jsPDF's own
// drawing primitives (text/rect/ellipse/lines) — no DOM screenshot involved. That's
// what makes it a fixed, predictable single page: it doesn't depend on the live
// page's window size, scroll state, or collapsed/expanded panels the way capturing
// the actual screen did, and there's no capture-driven page-break math to get wrong.
const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN = 16;
const CONTENT_W = PAGE_W - MARGIN * 2;
const FOOTER_H = 15;
// One consistent corner radius across every card-like block (stat cards, the
// dimensions strip, the notes callout) so the page reads as a single designed
// system rather than a mix of ad-hoc shapes.
const CARD_RADIUS = 2;

const BRAND_BLUE = [37, 99, 235];
const BRAND_BLUE_TINT = [239, 246, 255];
const SLATE_900 = [15, 23, 42];
const SLATE_700 = [51, 65, 85];
const SLATE_500 = [100, 116, 139];
const SLATE_400 = [148, 163, 184];
const SLATE_300 = [203, 213, 225];
const SLATE_200 = [226, 232, 240];
const SLATE_100 = [241, 245, 249];
const CARD_TINT = [248, 250, 252];
const WHITE = [255, 255, 255];
const CREDIT_TEXT = "Designed using Room Configurator on https://fidelislogic.com";

const ROOM_BG = [231, 236, 242];
const ROOM_FLOOR = [248, 250, 252];
const ROOM_BORDER = [51, 65, 85];
const TABLE_FILL = [227, 233, 241];
const TABLE_STROKE = [91, 107, 130];
const CHAIR_FILL = [238, 241, 246];
const CHAIR_STROKE = [148, 163, 184];

function setFill(doc, rgb) { doc.setFillColor(rgb[0], rgb[1], rgb[2]); }
function setDraw(doc, rgb) { doc.setDrawColor(rgb[0], rgb[1], rgb[2]); }
function setText(doc, rgb) { doc.setTextColor(rgb[0], rgb[1], rgb[2]); }

// Wraps text to at most maxLines lines within maxWidth (mm) at the doc's current
// font/size, ellipsizing the final line if it still doesn't fit — used for the stat
// cards so a long value (a free-text room name, or the room's full L × W × H
// breakdown) wraps onto a second line instead of being cut off after the first.
function wrapToLines(doc, text, maxWidth, maxLines) {
  const lines = doc.splitTextToSize(text, maxWidth);
  if (lines.length <= maxLines) return lines;
  const clamped = lines.slice(0, maxLines);
  const ellipsis = "…";
  let last = clamped[maxLines - 1];
  while (last.length > 0 && doc.getTextWidth(last + ellipsis) > maxWidth) {
    last = last.slice(0, -1).trimEnd();
  }
  clamped[maxLines - 1] = last + ellipsis;
  return clamped;
}

// A nice round meter interval for ruler ticks, aiming for roughly 5-7 labels across
// the given dimension regardless of room size.
function niceTickStep(dimension) {
  const target = dimension / 6;
  const steps = [0.5, 1, 2, 5, 10, 20, 50];
  return steps.find((s) => s >= target) || 50;
}

function formatMeters(v) {
  const r = Math.round(v * 100) / 100;
  return `${Number.isInteger(r) ? r : r.toFixed(r % 1 === 0.5 ? 1 : 2)}m`;
}

// --- header / footer ---------------------------------------------------------------

function drawTopAccent(doc) {
  setFill(doc, BRAND_BLUE);
  doc.rect(0, 0, PAGE_W, 3, "F");
}

function drawHeader(doc, meta, titleLines) {
  drawTopAccent(doc);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  setText(doc, SLATE_500);
  doc.text(meta.dateStr, PAGE_W - MARGIN, 11, { align: "right" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(19);
  setText(doc, SLATE_900);
  doc.text(titleLines, MARGIN, 15);

  // The credit line used to sit on its own row above the title with its own bold
  // brand-blue styling; it now takes over the subtitle row instead (in that row's
  // own normal/slate format) rather than duplicating the attribution twice in the
  // header, freeing up the space the old top row took.
  const subtitleY = 15 + (titleLines.length - 1) * 7.2 + 6.5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  setText(doc, SLATE_500);
  const subtitleText = meta.createdBy
    ? `Prepared by ${meta.createdBy} · Fidelis Logic Room Configurator`
    : CREDIT_TEXT;
  doc.text(subtitleText, MARGIN, subtitleY);

  const dividerY = subtitleY + 4.5;
  setDraw(doc, BRAND_BLUE);
  doc.setLineWidth(0.8);
  doc.line(MARGIN, dividerY, MARGIN + 16, dividerY);
  setDraw(doc, SLATE_200);
  doc.setLineWidth(0.4);
  doc.line(MARGIN + 16, dividerY, PAGE_W - MARGIN, dividerY);

  return dividerY + 6;
}

function drawFooter(doc, meta, pageNum, totalPages) {
  const y = PAGE_H - FOOTER_H;
  setDraw(doc, SLATE_300);
  doc.setLineWidth(0.4);
  doc.line(MARGIN, y, PAGE_W - MARGIN, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  setText(doc, SLATE_500);
  doc.text(CREDIT_TEXT, MARGIN, y + 7);
  doc.text(meta.dateStr, MARGIN, y + 12);
  doc.text(`Page ${pageNum} of ${totalPages}`, PAGE_W - MARGIN, y + 7, { align: "right" });
}

// A lighter header for an overflow continuation page — same top accent, a small
// title instead of the full customer-name headline, no stat cards or diagram to
// repeat since only trailing report sections ever land here.
function drawContinuationHeader(doc, meta) {
  drawTopAccent(doc);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  setText(doc, SLATE_500);
  doc.text(meta.dateStr, PAGE_W - MARGIN, 11, { align: "right" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  setText(doc, SLATE_900);
  doc.text("Meeting Room Configuration (continued)", MARGIN, 14);

  const dividerY = 19;
  setDraw(doc, SLATE_200);
  doc.setLineWidth(0.4);
  doc.line(MARGIN, dividerY, PAGE_W - MARGIN, dividerY);

  return dividerY + 6;
}

// The report's main content isn't paginated top-to-bottom the way a word processor
// would — every section computes its own y from the one before it — so a section
// whose height depends on free-form user input (unlike the rest, which is bounded by
// the configurator's own fixed vocabulary) needs an explicit fit check before it
// draws. When it won't fit in what's left of the current page, start a fresh page
// with a continuation header rather than letting it run under the footer.
function ensureSpace(doc, y, neededHeight, meta) {
  const safeBottom = PAGE_H - FOOTER_H - 4;
  if (y + neededHeight <= safeBottom) return y;
  doc.addPage();
  return drawContinuationHeader(doc, meta);
}

// --- section header ------------------------------------------------------------------

// A small accent tab beside every section label (the same brand-blue motif used on
// the stat cards' left edge) plus a rule that runs out to the page edge — ties every
// section header to the same visual language and reads as a proper document section
// break rather than just a bolder line of text.
function drawSectionTitle(doc, y, label) {
  setFill(doc, BRAND_BLUE);
  doc.roundedRect(MARGIN, y - 3.3, 1.4, 4.3, 0.7, 0.7, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  setText(doc, SLATE_900);
  doc.text(label, MARGIN + 4, y);

  const ruleX = MARGIN + 4 + doc.getTextWidth(label) + 4;
  setDraw(doc, SLATE_200);
  doc.setLineWidth(0.3);
  doc.line(ruleX, y - 1, PAGE_W - MARGIN, y - 1);

  return y + 4.5;
}

// --- stat cards (Room name / Capacity / Room size) -------------------------------------

function drawStatCards(doc, y, state, roomName) {
  const { room } = state;
  const area = room.length * room.width;
  const cards = [
    { label: "Room name", value: roomName },
    { label: "Capacity", value: `${state.chairCount} ${state.chairCount === 1 ? "person" : "people"}` },
    {
      label: "Room size",
      value: `${room.length.toFixed(1)} × ${room.width.toFixed(1)} × ${room.height.toFixed(1)} m`,
      format: "(L×W×H)",
      sub: `${area.toFixed(1)} m² floor area`,
    },
  ];
  const VALUE_SIZE = 11;
  const FORMAT_SIZE = VALUE_SIZE / 2; // half the value's font size, as its own caption line
  const gap = 5;
  const cardW = (CONTENT_W - gap * 2) / 3;
  const innerW = cardW - 10;
  const valueLineH = 4.3;

  // Every card wraps up to 2 lines rather than truncating to one — a free-text room
  // name can easily run past a single line — so all three cards share one height
  // sized to whichever needs the most room.
  doc.setFont("helvetica", "bold");
  doc.setFontSize(VALUE_SIZE);
  const wrapped = cards.map((card) => wrapToLines(doc, card.value, innerW, 2));
  const maxLines = Math.max(...wrapped.map((lines) => lines.length));
  const hasFormat = cards.some((card) => card.format);
  const hasSub = cards.some((card) => card.sub);
  const cardH = 9 + maxLines * valueLineH + (hasFormat ? 3 : 0) + (hasSub ? 4.3 : hasFormat ? 0 : 1);

  cards.forEach((card, i) => {
    const x = MARGIN + i * (cardW + gap);
    setDraw(doc, SLATE_200);
    doc.setLineWidth(0.3);
    setFill(doc, CARD_TINT);
    doc.roundedRect(x, y, cardW, cardH, CARD_RADIUS, CARD_RADIUS, "FD");
    setFill(doc, BRAND_BLUE);
    doc.roundedRect(x, y, 1.2, cardH, 0.6, 0.6, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    setText(doc, SLATE_500);
    doc.text(card.label.toUpperCase(), x + 5, y + 6);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(VALUE_SIZE);
    setText(doc, SLATE_900);
    doc.text(wrapped[i], x + 5, y + 11.2);

    let cursorY = y + 11.2 + (wrapped[i].length - 1) * valueLineH;
    if (card.format) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(FORMAT_SIZE);
      setText(doc, SLATE_400);
      doc.text(card.format, x + 5, cursorY + 3);
      cursorY += 3;
    }
    if (card.sub) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      setText(doc, SLATE_400);
      doc.text(card.sub, x + 5, cursorY + 4.3);
    }
  });

  return y + cardH + 6;
}

// --- room diagram (native vector, not a screenshot) -------------------------------------

// Table length/width and seating sit beside the diagram now (see drawDiagramSidePanel)
// rather than in their own full-width strip — room length/width/height already appear
// on the Room size stat card, and door count only lives on the diagram itself, so
// there's nothing left that needs a dedicated strip of its own between the stat cards
// and the diagram.
// A proper mini-card (matching the stat cards' tinted-background + left-accent-bar
// language) rather than bare floating label/value text — with its own small section
// header and dividers between the three stats, filling the full height of the
// diagram beside it.
function drawDiagramSidePanel(doc, x, y, w, h, state) {
  const { table, chairCount } = state;
  const items = [
    ["Table length", `${table.length.toFixed(1)} m`],
    ["Table width", `${table.width.toFixed(1)} m`],
    ["Chairs", `${chairCount}`],
  ];

  setFill(doc, CARD_TINT);
  setDraw(doc, SLATE_200);
  doc.setLineWidth(0.3);
  doc.roundedRect(x, y, w, h, CARD_RADIUS, CARD_RADIUS, "FD");
  setFill(doc, BRAND_BLUE);
  doc.roundedRect(x, y, 1.2, h, 0.6, 0.6, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  setText(doc, SLATE_500);
  doc.text("TABLE & SEATING", x + 6, y + 7);

  setDraw(doc, SLATE_200);
  doc.setLineWidth(0.3);
  doc.line(x + 6, y + 9.5, x + w - 5, y + 9.5);

  const rowH = (h - 13) / items.length;
  items.forEach(([label, value], i) => {
    const rowTop = y + 13 + rowH * i;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    setText(doc, SLATE_500);
    doc.text(label.toUpperCase(), x + 6, rowTop + 5);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    setText(doc, SLATE_900);
    doc.text(value, x + 6, rowTop + 13.5);

    if (i < items.length - 1) {
      setDraw(doc, SLATE_200);
      doc.setLineWidth(0.25);
      doc.line(x + 6, rowTop + rowH - 2, x + w - 5, rowTop + rowH - 2);
    }
  });
}

function drawTableShape(doc, tableShape, centerMm, mPerMm) {
  const [cx, cy] = centerMm;
  const toMm = (dm) => dm / mPerMm; // meters -> mm at current scale
  setFill(doc, TABLE_FILL);
  setDraw(doc, TABLE_STROKE);
  doc.setLineWidth(0.35);

  switch (tableShape.type) {
    case "rect": {
      const w = toMm(tableShape.w), h = toMm(tableShape.h);
      doc.roundedRect(cx - w / 2, cy - h / 2, w, h, 1, 1, "FD");
      break;
    }
    case "ellipse": {
      doc.ellipse(cx, cy, toMm(tableShape.w) / 2, toMm(tableShape.h) / 2, "FD");
      break;
    }
    case "segments":
      tableShape.segments.forEach((s) => {
        doc.roundedRect(cx + toMm(s.x), cy + toMm(s.y), toMm(s.w), toMm(s.h), 0.8, 0.8, "FD");
      });
      break;
    case "desks":
      tableShape.desks.forEach((d) => {
        doc.roundedRect(cx + toMm(d.x), cy + toMm(d.y), toMm(d.w), toMm(d.h), 0.8, 0.8, "FD");
      });
      break;
    case "pods":
      tableShape.tables.forEach((t) => {
        doc.circle(cx + toMm(t.x), cy + toMm(t.y), toMm(t.radius), "FD");
      });
      break;
    default:
      break;
  }
}

function drawDiagram(doc, y, height, boxW, state, layoutResult, removedChairIndices, chairOffsets) {
  const { room, devices, tableOffset } = state;
  const boxX = MARGIN, boxY = y, boxH = height;

  const viewW = room.length + ROOM_MARGIN * 2;
  const viewH = room.width + ROOM_MARGIN * 2;
  const scale = Math.min(boxW / viewW, boxH / viewH); // mm per meter
  const mPerMm = 1 / scale;
  const diagramW = viewW * scale;
  const diagramH = viewH * scale;
  const originX = boxX + (boxW - diagramW) / 2 + ROOM_MARGIN * scale;
  const originY = boxY + (boxH - diagramH) / 2 + ROOM_MARGIN * scale;
  const toPage = (mx, my) => [originX + mx * scale, originY + my * scale];

  // Outer neutral background + room floor + border, matching the live canvas's look.
  setFill(doc, ROOM_BG);
  doc.rect(boxX + (boxW - diagramW) / 2, boxY + (boxH - diagramH) / 2, diagramW, diagramH, "F");
  setFill(doc, ROOM_FLOOR);
  doc.rect(originX, originY, room.length * scale, room.width * scale, "F");

  // Light reference grid every meter (capped so very large rooms don't flood the page).
  setDraw(doc, [231, 235, 240]);
  doc.setLineWidth(0.15);
  const gridStep = room.length * room.width > 400 ? niceTickStep(Math.max(room.length, room.width)) : 1;
  for (let gx = 0; gx <= room.length + 1e-6; gx += gridStep) {
    const [px] = toPage(gx, 0);
    doc.line(px, originY, px, originY + room.width * scale);
  }
  for (let gy = 0; gy <= room.width + 1e-6; gy += gridStep) {
    const [, py] = toPage(0, gy);
    doc.line(originX, py, originX + room.length * scale, py);
  }

  setDraw(doc, ROOM_BORDER);
  doc.setLineWidth(0.6);
  doc.rect(originX, originY, room.length * scale, room.width * scale, "S");

  // Ruler ticks + labels along the bottom and left edges.
  const stepX = niceTickStep(room.length);
  const stepY = niceTickStep(room.width);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  setText(doc, SLATE_400);
  setDraw(doc, SLATE_400);
  doc.setLineWidth(0.25);
  for (let gx = 0; gx <= room.length + 1e-6; gx += stepX) {
    const [px] = toPage(gx, 0);
    const py = originY + room.width * scale;
    doc.line(px, py, px, py + 1.6);
    doc.text(formatMeters(gx), px, py + 5, { align: "center" });
  }
  for (let gy = 0; gy <= room.width + 1e-6; gy += stepY) {
    const py = toPage(0, gy)[1];
    doc.line(originX - 1.6, py, originX, py);
    doc.text(formatMeters(gy), originX - 2.4, py + 1, { align: "right" });
  }

  // Table + chairs, positioned the same way the live canvas positions them: chairs
  // and the table shape are local offsets from the table group's center.
  const tableCenter = { x: room.length / 2 + tableOffset.x, y: room.width / 2 + tableOffset.y };
  const [tcx, tcy] = toPage(tableCenter.x, tableCenter.y);
  drawTableShape(doc, layoutResult.tableShape, [tcx, tcy], mPerMm);

  setFill(doc, CHAIR_FILL);
  setDraw(doc, CHAIR_STROKE);
  doc.setLineWidth(0.25);
  const chairR = Math.max(0.9, Math.min(2.2, scale * 0.22));
  layoutResult.chairs.forEach((c, i) => {
    if (removedChairIndices.has(i)) return;
    const off = chairOffsets[i] || { dx: 0, dy: 0 };
    const cx = tableCenter.x + c.x + off.dx;
    const cy = tableCenter.y + c.y + off.dy;
    const [px, py] = toPage(cx, cy);
    doc.circle(px, py, chairR, "FD");
  });

  // Devices, at their absolute room coordinates — a small brand-blue marker with its
  // reference code, matching the codes used in the device placement table below.
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6);
  DEVICE_ORDER.forEach((category) => {
    devices[category].forEach((item, idx) => {
      const [px, py] = toPage(item.x, item.y);
      setFill(doc, BRAND_BLUE);
      setDraw(doc, WHITE);
      doc.setLineWidth(0.3);
      doc.circle(px, py, 1.5, "FD");
      setText(doc, SLATE_700);
      // Wall-mounted items (door/booking panel) sit right on the room's border, so the
      // ref-code label is nudged inward off that edge instead of always to the lower
      // right, where it would land on top of the wall line for top/left-edge items.
      const edge = item.edge;
      let lx = px + 2.2, ly = py + 1, align = "left";
      if (edge === "top") { ly = py + 3.8; }
      else if (edge === "bottom") { ly = py - 2.2; }
      else if (edge === "left") { lx = px + 2.5; }
      else if (edge === "right") { lx = px - 2.5; align = "right"; }
      doc.text(refCode(category, idx), lx, ly, { align });
    });
  });

  return boxY + boxH;
}

// --- diagram as a screenshot of the live configurator (not redrawn) ----------------------

// A fixed virtual viewport for the capture, regardless of the browser window size the
// user actually has open at export time — otherwise the diagram's rendered size (and
// therefore how it's laid out here) would vary from export to export. Only this one
// element is captured (not the whole page), so this stays a single, fast html2canvas
// call rather than the multi-second whole-document clone a full-page capture costs.
const DIAGRAM_CAPTURE_WIDTH = 900;
const DIAGRAM_CAPTURE_SCALE = 2;

async function captureDiagramElement(element) {
  if (!element) return null;
  try {
    return await html2canvas(element, {
      scale: DIAGRAM_CAPTURE_SCALE,
      backgroundColor: "#ffffff",
      useCORS: true,
      logging: false,
      windowWidth: DIAGRAM_CAPTURE_WIDTH,
      windowHeight: 1000,
    });
  } catch {
    return null; // fall back to the native vector diagram below if the capture fails
  }
}

// Places the captured canvas into the same box the native diagram would have used,
// letterboxing on whichever axis the image doesn't fill so its own aspect ratio (the
// room's real proportions) is never distorted.
function drawDiagramImage(doc, y, height, boxW, canvas) {
  const boxX = MARGIN;
  const imgAspect = canvas.width / canvas.height;
  const boxAspect = boxW / height;
  let drawW, drawH;
  if (imgAspect > boxAspect) {
    drawW = boxW;
    drawH = boxW / imgAspect;
  } else {
    drawH = height;
    drawW = height * imgAspect;
  }
  const drawX = boxX + (boxW - drawW) / 2;
  const drawY = y + (height - drawH) / 2;
  const dataUrl = canvas.toDataURL("image/png");
  doc.addImage(dataUrl, "PNG", drawX, drawY, drawW, drawH, undefined, "FAST");
}

// The diagram is drawn to actual scale, so for most rooms (wider than they are deep,
// relative to the page) it ends up narrower than the full content width — centering
// it just leaves that width as dead space. When there's enough of it left over, this
// draws a companion legend/key panel in it instead, so the space is doing something
// rather than sitting empty beside the drawing.
// A single compact row under the diagram, in a smaller font than the rest of the
// report — just enough to explain what each symbol on the diagram means, without
// repeating facts (layout, seating, device count) already covered by the stat cards
// and Configuration Summary elsewhere on the page.
function drawDiagramLegendRow(doc, x, y) {
  const items = [
    { kind: "device", label: "AV device" },
    { kind: "chair", label: "Chair" },
    { kind: "table", label: "Table / desk" },
    { kind: "wall", label: "Room wall" },
  ];
  const cy = y + 1.6;
  let cursorX = x;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.3);
  items.forEach((item) => {
    if (item.kind === "device") {
      setFill(doc, BRAND_BLUE); setDraw(doc, WHITE); doc.setLineWidth(0.25);
      doc.circle(cursorX + 1.1, cy, 1.1, "FD");
    } else if (item.kind === "chair") {
      setFill(doc, CHAIR_FILL); setDraw(doc, CHAIR_STROKE); doc.setLineWidth(0.2);
      doc.circle(cursorX + 1.1, cy, 1.1, "FD");
    } else if (item.kind === "table") {
      setFill(doc, TABLE_FILL); setDraw(doc, TABLE_STROKE); doc.setLineWidth(0.25);
      doc.roundedRect(cursorX, cy - 1.1, 2.4, 2.2, 0.4, 0.4, "FD");
    } else {
      setDraw(doc, ROOM_BORDER);
      doc.setLineWidth(0.7);
      doc.line(cursorX, cy, cursorX + 2.4, cy);
    }
    setText(doc, SLATE_700);
    doc.text(item.label, cursorX + 4, y + 2.2);
    cursorX += 4 + doc.getTextWidth(item.label) + 7;
  });
  return y + 5;
}

// --- room photo pages (2 per page, appended after the main report page) -------------------

// Phone camera photos can run 4000px+ per side / several MB each; embedding them at
// native resolution would bloat the PDF and slow generation for no visual benefit at
// half-page print size. Downscaled + re-encoded once here via canvas before jsPDF
// ever sees them. This is also the only place these photos exist as pixels — nothing
// is uploaded, so "don't save the pictures on the website" holds by construction.
const MAX_PHOTO_DIMENSION = 1600;
const PHOTO_JPEG_QUALITY = 0.82;

function loadImageFile(file) {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, MAX_PHOTO_DIMENSION / Math.max(img.naturalWidth, img.naturalHeight));
      const w = Math.max(1, Math.round(img.naturalWidth * scale));
      const h = Math.max(1, Math.round(img.naturalHeight * scale));
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      canvas.getContext("2d").drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(objectUrl);
      resolve({ dataUrl: canvas.toDataURL("image/jpeg", PHOTO_JPEG_QUALITY), width: w, height: h });
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Couldn't read one of the room photos"));
    };
    img.src = objectUrl;
  });
}

function drawPhotoPageHeader(doc, meta) {
  drawTopAccent(doc);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  setText(doc, SLATE_500);
  doc.text(meta.dateStr, PAGE_W - MARGIN, 11, { align: "right" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  setText(doc, SLATE_900);
  doc.text("Room Photos", MARGIN, 15);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  setText(doc, SLATE_500);
  doc.text(meta.customerName ? `${meta.customerName} — site survey reference photos` : "Site survey reference photos", MARGIN, 21.5);

  const dividerY = 25;
  setDraw(doc, BRAND_BLUE);
  doc.setLineWidth(0.8);
  doc.line(MARGIN, dividerY, MARGIN + 16, dividerY);
  setDraw(doc, SLATE_200);
  doc.setLineWidth(0.4);
  doc.line(MARGIN + 16, dividerY, PAGE_W - MARGIN, dividerY);

  return dividerY + 6;
}

// Same tinted-card language as the rest of the report, letterboxing the photo inside
// it (contain-fit) so a portrait or landscape phone photo is never stretched.
function drawPhotoBox(doc, y, height, photo, captionText) {
  const boxX = MARGIN, boxW = CONTENT_W;
  setFill(doc, CARD_TINT);
  setDraw(doc, SLATE_200);
  doc.setLineWidth(0.3);
  doc.roundedRect(boxX, y, boxW, height, CARD_RADIUS, CARD_RADIUS, "FD");

  const pad = 3;
  const captionH = 5;
  const innerX = boxX + pad, innerY = y + pad;
  const innerW = boxW - pad * 2, innerH = height - pad * 2 - captionH;
  const imgAspect = photo.width / photo.height;
  const boxAspect = innerW / innerH;
  let drawW, drawH;
  if (imgAspect > boxAspect) { drawW = innerW; drawH = innerW / imgAspect; }
  else { drawH = innerH; drawW = innerH * imgAspect; }
  const drawX = innerX + (innerW - drawW) / 2;
  const drawY = innerY + (innerH - drawH) / 2;
  doc.addImage(photo.dataUrl, "JPEG", drawX, drawY, drawW, drawH, undefined, "FAST");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  setText(doc, SLATE_500);
  doc.text(captionText, boxX + pad, y + height - 2);
}

// Appends one new PDF page per pair of photos. Footers aren't drawn here — the entry
// point draws every page's footer in one pass afterward, once the final page count
// (main report page + photo pages) is known.
function drawRoomPhotoPages(doc, meta, photos) {
  for (let i = 0; i < photos.length; i += 2) {
    doc.addPage();
    const y = drawPhotoPageHeader(doc, meta);
    const bottom = PAGE_H - FOOTER_H - 4;
    const gap = 5;
    const pair = photos.slice(i, i + 2);
    const boxH = pair.length === 2 ? (bottom - y - gap) / 2 : bottom - y;
    pair.forEach((photo, j) => {
      const boxY = y + j * (boxH + gap);
      drawPhotoBox(doc, boxY, boxH, photo, `Photo ${i + j + 1} of ${photos.length}`);
    });
  }
}

// --- 4-column configuration summary (mirrors the on-screen summary panel) -----------------

// Predicts a column's rendered height without drawing anything — used to size the
// column-divider rules in drawSummaryGrid before any of the four columns are drawn.
function measureKeyValueColumn(doc, width, rows) {
  let cursorY = 4.5;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.8);
  rows.forEach(([, value]) => {
    const lines = doc.splitTextToSize(String(value), width);
    cursorY += 3.3 + lines.length * 3.1 + 1.3;
  });
  return cursorY;
}

function drawKeyValueColumn(doc, x, y, width, title, rows) {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  setText(doc, SLATE_500);
  doc.text(title.toUpperCase(), x, y);
  let cursorY = y + 4.5;

  rows.forEach(([label, value]) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    setText(doc, SLATE_500);
    doc.text(label, x, cursorY);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.8);
    setText(doc, SLATE_900);
    const lines = doc.splitTextToSize(String(value), width);
    doc.text(lines, x, cursorY + 3.3);
    cursorY += 3.3 + lines.length * 3.1 + 1.3;
  });

  return cursorY;
}

function drawSummaryGrid(doc, y, state) {
  const { room, table, chairCount, layout, platform, audioPreference, devices, wallMaterials, floorType, ceilingType, tableTopMaterial, cameraFeatures } = state;
  const layoutLabel = LAYOUTS.find((l) => l.id === layout)?.label || layout;
  const gap = 6;
  const colW = (CONTENT_W - gap * 3) / 4;

  const roomRows = [
    ["Size", `${room.length.toFixed(1)} × ${room.width.toFixed(1)} × ${room.height.toFixed(1)} m`],
    ["Layout", layoutLabel],
    ["Seating", `${chairCount} chairs`],
    ["Walls", wallMaterials?.length ? wallMaterials.join(", ") : "None selected"],
    ["Floor", floorType],
    ["Ceiling", ceilingType],
  ];
  const tableRows = [
    ["Size", `${table.length.toFixed(1)} × ${table.width.toFixed(1)} m`],
    ["Top", tableTopMaterial],
  ];
  const deviceRows = [
    ["Display", devices.display.length ? devices.display.map((d, i) => `${refCode("display", i)}: ${d.sizeInches}"`).join(", ") : "0"],
    ["Camera", devices.camera.length ? devices.camera.map((c, i) => `${refCode("camera", i)}: ${c.isTableCam ? "Neat 360°" : `${c.fov}°`}`).join(", ") : "0"],
    ["Camera features", cameraFeatures?.length ? cameraFeatures.map((id) => CAMERA_FEATURES.find((f) => f.id === id)?.label || id).join(", ") : "None selected"],
    ["Microphones", devices.microphone.length ? `${devices.microphone.map((_, i) => refCode("microphone", i)).join(", ")} — ${audioPreference}` : "0"],
    ["Speakers", devices.speaker.length ? devices.speaker.map((_, i) => refCode("speaker", i)).join(", ") : "0"],
  ];
  // Door is intentionally left out here — its position is only ever meaningful on
  // the diagram itself (which wall it's on), so it lives there and nowhere else.
  const controlRows = [
    ["Touch panel", devices.touchPanel.length ? devices.touchPanel.map((_, i) => refCode("touchPanel", i)).join(", ") : "Not included"],
    ["Content sharing", devices.contentSharing.length ? devices.contentSharing.map((_, i) => refCode("contentSharing", i)).join(", ") : "Not included"],
    ["Booking panel", devices.bookingPanel.length ? devices.bookingPanel.map((d, i) => `${refCode("bookingPanel", i)}: ${d.edge}`).join(", ") : "Not included"],
  ];

  const columns = [
    ["Room", roomRows],
    ["Table", tableRows],
    ["Devices", deviceRows],
    ["Room controls", controlRows],
  ];

  // Divider rules between the four columns, tying this grid to the same "structured
  // grid" language as the dimensions strip above it — sized from a measure-only pass
  // so they run the full height of whichever column ends up tallest.
  const blockHeight = Math.max(...columns.map(([, rows]) => measureKeyValueColumn(doc, colW, rows)));
  setDraw(doc, SLATE_200);
  doc.setLineWidth(0.3);
  for (let i = 1; i < columns.length; i++) {
    const x = MARGIN + i * (colW + gap) - gap / 2;
    doc.line(x, y, x, y + 3.5 + blockHeight);
  }

  let maxBottom = y;
  let tableColumnBottom = y;
  columns.forEach(([title, rows], i) => {
    const x = MARGIN + i * (colW + gap);
    const bottom = drawKeyValueColumn(doc, x, y + 3.5, colW, title, rows);
    if (title === "Table") tableColumnBottom = bottom;
    maxBottom = Math.max(maxBottom, bottom);
  });

  // UC Platform gets its own section header (matching ROOM/TABLE/etc.) rather than
  // being just another row inside Table — drawn in the Table column's own left-over
  // vertical space, since that column (2 rows) is far shorter than the others.
  const tableX = MARGIN + colW + gap;
  const platformY = tableColumnBottom + 5;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  setText(doc, SLATE_500);
  doc.text("UC PLATFORM", tableX, platformY);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  setText(doc, SLATE_900);
  const platformLines = doc.splitTextToSize(platform, colW);
  doc.text(platformLines, tableX, platformY + 5);
  maxBottom = Math.max(maxBottom, platformY + 5 + (platformLines.length - 1) * 3.8);

  return maxBottom + 4;
}

// --- device placement table ---------------------------------------------------------------

function deviceSpecText(category, item) {
  switch (category) {
    case "display": return `${item.sizeInches}" display`;
    case "camera": return item.isTableCam ? "Neat 360° table camera" : `${item.fov}° FOV camera`;
    case "microphone": return "Microphone";
    case "speaker": return "Speaker";
    case "touchPanel": return "Touch panel";
    case "contentSharing": return "Content sharing dongle";
    case "door": return `Door (${item.edge} wall)`;
    case "bookingPanel": return `Booking panel (${item.edge} wall)`;
    default: return DEVICE_LABELS[category] || category;
  }
}

function drawDeviceTable(doc, y, devices) {
  const rows = [];
  DEVICE_ORDER.forEach((category) => {
    devices[category].forEach((item, idx) => {
      rows.push([refCode(category, idx), DEVICE_LABELS[category], deviceSpecText(category, item), `${item.x.toFixed(2)}, ${item.y.toFixed(2)} m`]);
    });
  });
  if (!rows.length) return y;

  const cols = [
    { label: "Ref", w: 16 },
    { label: "Type", w: 38 },
    { label: "Spec", w: 88 },
    { label: "Position", w: CONTENT_W - 16 - 38 - 88 },
  ];
  const headerH = 6.2;
  const rowH = 4.6;
  const tableH = headerH + rows.length * rowH;

  setFill(doc, SLATE_100);
  doc.rect(MARGIN, y, CONTENT_W, headerH, "F");
  let colX = MARGIN;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  setText(doc, SLATE_500);
  cols.forEach((c) => {
    doc.text(c.label.toUpperCase(), colX + 2, y + 4.1);
    colX += c.w;
  });

  // Alternating row tint reads as a real data table rather than a loose text list.
  let cursorY = y + headerH;
  rows.forEach((row, r) => {
    if (r % 2 === 1) {
      setFill(doc, CARD_TINT);
      doc.rect(MARGIN, cursorY, CONTENT_W, rowH, "F");
    }
    colX = MARGIN;
    doc.setFontSize(7.6);
    row.forEach((cell, i) => {
      setText(doc, i === 0 ? BRAND_BLUE : SLATE_700);
      doc.setFont("helvetica", i === 0 ? "bold" : "normal");
      doc.text(String(cell), colX + 2, cursorY + rowH / 2 + 1.3);
      colX += cols[i].w;
    });
    cursorY += rowH;
  });

  setDraw(doc, SLATE_200);
  doc.setLineWidth(0.3);
  doc.rect(MARGIN, y, CONTENT_W, tableH, "S");
  doc.line(MARGIN, y + headerH, MARGIN + CONTENT_W, y + headerH);
  colX = MARGIN;
  for (let i = 0; i < cols.length - 1; i++) {
    colX += cols[i].w;
    doc.line(colX, y, colX, y + tableH);
  }

  return y + tableH + 3;
}

// --- recommended notes ---------------------------------------------------------------------

function measureNotesHeight(doc, notes, wrapWidth) {
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.8);
  let h = 0;
  notes.forEach((note) => {
    const lines = doc.splitTextToSize(note, wrapWidth);
    h += lines.length * 3.6 + 1.3;
  });
  return h;
}

// Shared by drawNotes and the entry point's fit check ahead of it — one source of
// truth for the box's padding so the pre-draw measurement can't drift from the draw.
function measureNotesBoxHeight(doc, state) {
  const notes = recommendationNotes(state);
  const padTop = 3, padBottom = 2.5, padLeft = 7, padRight = 5;
  const wrapWidth = CONTENT_W - padLeft - padRight;
  return padTop + measureNotesHeight(doc, notes, wrapWidth) + padBottom;
}

// A tinted callout card instead of bare bullets on white — gives the advisory notes
// visual weight as a distinct "read this" block, the same way a pull-quote or
// callout box reads in a printed report.
function drawNotes(doc, y, state) {
  const notes = recommendationNotes(state);
  const padTop = 3, padBottom = 2.5, padLeft = 7, padRight = 5;
  const wrapWidth = CONTENT_W - padLeft - padRight;
  const boxH = measureNotesBoxHeight(doc, state);

  setFill(doc, BRAND_BLUE_TINT);
  setDraw(doc, SLATE_200);
  doc.setLineWidth(0.3);
  doc.roundedRect(MARGIN, y, CONTENT_W, boxH, CARD_RADIUS, CARD_RADIUS, "FD");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.8);
  let cursorY = y + padTop + 2.6;
  notes.forEach((note) => {
    setFill(doc, BRAND_BLUE);
    doc.circle(MARGIN + padLeft - 3, cursorY - 1.1, 0.6, "F");
    setText(doc, SLATE_700);
    const lines = doc.splitTextToSize(note, wrapWidth);
    doc.text(lines, MARGIN + padLeft, cursorY);
    cursorY += lines.length * 3.6 + 1.3;
  });

  return y + boxH;
}

// --- additional notes (free text from the user, distinct from the system-generated
// recommendations above) -----------------------------------------------------------

// Capped at a fixed number of lines (ellipsized beyond that) so its height is
// bounded even for a pasted wall of text — the entry point still checks the actual
// measured height against the page via ensureSpace before drawing, since this cap
// alone (8 lines) is still tall enough to need that check in a crowded report.
const MAX_USER_NOTES_LINES = 8;
const USER_NOTES_PAD = { top: 4, bottom: 3, left: 6, right: 6 };
const USER_NOTES_LINE_H = 3.8;

// Wrapping is measurement — done once here so the entry point's fit check and the
// actual draw always agree on exactly how many lines resulted.
function wrapUserNotes(doc, notesText) {
  const wrapWidth = CONTENT_W - USER_NOTES_PAD.left - USER_NOTES_PAD.right;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  return wrapToLines(doc, notesText, wrapWidth, MAX_USER_NOTES_LINES);
}

function measureUserNotesBoxHeight(lines) {
  return USER_NOTES_PAD.top + lines.length * USER_NOTES_LINE_H + USER_NOTES_PAD.bottom;
}

function drawUserNotesBox(doc, y, lines) {
  const boxH = measureUserNotesBoxHeight(lines);

  setFill(doc, CARD_TINT);
  setDraw(doc, SLATE_200);
  doc.setLineWidth(0.3);
  doc.roundedRect(MARGIN, y, CONTENT_W, boxH, CARD_RADIUS, CARD_RADIUS, "FD");
  setFill(doc, BRAND_BLUE);
  doc.roundedRect(MARGIN, y, 1.2, boxH, 0.6, 0.6, "F");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  setText(doc, SLATE_700);
  doc.text(lines, MARGIN + USER_NOTES_PAD.left, y + USER_NOTES_PAD.top + 2.8);

  return y + boxH;
}

// --- entry point -----------------------------------------------------------------------------

export async function exportRoomConfigPdf({ state, layoutResult, removedChairIndices, chairOffsets, roomName, customerName, createdBy, diagramElement, images = [] }) {
  if (!state || !layoutResult) throw new Error("Nothing to export — the room configuration wasn't found.");

  // Captured/decoded before anything else is drawn — these are the only async steps
  // in this whole export, and doing them first means everything below can stay
  // synchronous. Photos are decoded to data URLs entirely in memory (canvas), never
  // sent anywhere — nothing about this export touches a server.
  const diagramCanvas = await captureDiagramElement(diagramElement);
  const photos = images.length ? await Promise.all(images.map(loadImageFile)) : [];

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const dateStr = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const meta = { customerName, createdBy, dateStr };

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  const titleLines = doc.splitTextToSize(`Meeting Room Configuration for: ${customerName}`, CONTENT_W);

  let y = drawHeader(doc, meta, titleLines);
  y = drawStatCards(doc, y, state, roomName);

  y = drawSectionTitle(doc, y, "Room Layout Diagram");
  const diagramH = 70;
  const SIDE_PANEL_W = 42;
  const SIDE_GAP = 6;
  const diagramBoxW = CONTENT_W - SIDE_PANEL_W - SIDE_GAP;
  if (diagramCanvas) {
    drawDiagramImage(doc, y, diagramH, diagramBoxW, diagramCanvas);
  } else {
    drawDiagram(doc, y, diagramH, diagramBoxW, state, layoutResult, removedChairIndices, chairOffsets);
  }
  drawDiagramSidePanel(doc, MARGIN + diagramBoxW + SIDE_GAP, y, SIDE_PANEL_W, diagramH, state);
  y += diagramH + 4;
  y = drawDiagramLegendRow(doc, MARGIN, y) + 5;

  y = drawSectionTitle(doc, y, "Configuration Summary");
  y = drawSummaryGrid(doc, y, state) + 2;

  const hasDevices = DEVICE_ORDER.some((c) => state.devices[c].length > 0);
  if (hasDevices) {
    y = drawSectionTitle(doc, y, "Device Placement");
    y = drawDeviceTable(doc, y, state.devices) + 2;
  }

  if (state.additionalNotes?.trim()) {
    const lines = wrapUserNotes(doc, state.additionalNotes.trim());
    const needed = 4.5 + measureUserNotesBoxHeight(lines) + 4;
    y = ensureSpace(doc, y, needed, meta);
    y = drawSectionTitle(doc, y, "Additional Notes");
    y = drawUserNotesBox(doc, y, lines) + 4;
  }

  {
    const needed = 4.5 + measureNotesBoxHeight(doc, state);
    y = ensureSpace(doc, y, needed, meta);
    y = drawSectionTitle(doc, y, "Recommended Notes");
    drawNotes(doc, y, state);
  }

  if (photos.length) drawRoomPhotoPages(doc, meta, photos);

  // Computed from the doc itself, not a formula off `photos.length` — the notes
  // sections above may have already pushed onto an overflow page of their own.
  const totalPages = doc.internal.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    drawFooter(doc, meta, p, totalPages);
  }

  const safeName = customerName.trim().replace(/[^a-z0-9]+/gi, "-").replace(/(^-+|-+$)/g, "") || "customer";
  doc.save(`meeting-room-configuration-${safeName}.pdf`);
}
