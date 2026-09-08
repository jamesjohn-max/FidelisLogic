import { useEffect, useMemo, useRef, useState } from "react";
import { RotateCcw, FileDown } from "lucide-react";
import { SEO } from "../components/SEO";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { DimensionsBar } from "../components/roomConfigurator/DimensionsBar";
import { RoomStatsCard } from "../components/roomConfigurator/RoomStatsCard";
import { ControlsPanel } from "../components/roomConfigurator/ControlsPanel";
import { RoomCanvas } from "../components/roomConfigurator/RoomCanvas";
import { SummaryPanel } from "../components/roomConfigurator/SummaryPanel";
import { RoomImagesPanel } from "../components/roomConfigurator/RoomImagesPanel";
import { DisplaySizeDialog } from "../components/roomConfigurator/DisplaySizeDialog";
import { CameraFovDialog } from "../components/roomConfigurator/CameraFovDialog";
import { ExportDialog } from "../components/roomConfigurator/ExportDialog";
import { exportRoomConfigPdf } from "../lib/exportRoomConfigPdf";
import { toast } from "../components/ui/sonner";
import {
  DEVICE_LABELS,
  PLATFORMS,
  AUDIO_PREFERENCES,
  WALL_MATERIALS,
  FLOOR_TYPES,
  CEILING_TYPES,
  TABLE_TOP_MATERIALS,
  uid,
  clamp,
  rotateBy,
  generateLayout,
  clampTableOffset,
  resolvePlacement,
  microphoneSpreadPosition,
  cameraFacingToward,
  getTableLimits,
  getChairLimits,
  getPodRadiusLimits,
  POD_RADIUS_LIMITS,
} from "../lib/roomConfiguratorEngine";

const DEFAULT_ROOM = { length: 6.5, width: 4.5, height: 2.8 };
const DEFAULT_TABLE = { length: 3.0, width: 1.2, orientation: 0 };
const EMPTY_DEVICES = { display: [], camera: [], microphone: [], speaker: [], touchPanel: [], contentSharing: [], door: [], bookingPanel: [] };

export const RoomConfigurator = () => {
  const [room, setRoom] = useState(DEFAULT_ROOM);
  const [table, setTable] = useState(DEFAULT_TABLE);
  const [chairCount, setChairCount] = useState(8);
  const [layout, setLayout] = useState("rectangular");
  const [platform, setPlatform] = useState(PLATFORMS[0]);
  const [audioPreference, setAudioPreference] = useState(AUDIO_PREFERENCES[0]);
  const [wallMaterials, setWallMaterials] = useState([WALL_MATERIALS[0]]);
  const [floorType, setFloorType] = useState(FLOOR_TYPES[0]);
  const [ceilingType, setCeilingType] = useState(CEILING_TYPES[0]);
  const [tableTopMaterial, setTableTopMaterial] = useState(TABLE_TOP_MATERIALS[0]);
  const [cameraFeatures, setCameraFeatures] = useState([]);
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [tableOffset, setTableOffset] = useState({ x: 0, y: 0 });
  const [devices, setDevices] = useState(EMPTY_DEVICES);
  const [selection, setSelection] = useState(null);
  const [armedPlacement, setArmedPlacement] = useState(null);
  const [displayDialogOpen, setDisplayDialogOpen] = useState(false);
  const [cameraDialogOpen, setCameraDialogOpen] = useState(false);
  const [removedChairIndices, setRemovedChairIndices] = useState(() => new Set());
  const [chairOffsets, setChairOffsets] = useState({});
  // Open Collaboration's pod tables default to an auto-sized radius; this holds
  // per-pod overrides (keyed by pod index) once someone resizes one individually.
  const [podSizeOverrides, setPodSizeOverrides] = useState({});
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [roomImages, setRoomImages] = useState([]);
  const diagramRef = useRef(null);
  // Blob preview URLs need revoking on removal/unmount; a ref keeps the cleanup
  // effect below from needing roomImages in its dependency array.
  const roomImagesRef = useRef(roomImages);
  useEffect(() => { roomImagesRef.current = roomImages; }, [roomImages]);
  useEffect(() => () => { roomImagesRef.current.forEach((img) => URL.revokeObjectURL(img.previewUrl)); }, []);

  const layoutResult = useMemo(
    () => generateLayout(layout, room, table, chairCount, podSizeOverrides),
    [layout, room, table, chairCount, podSizeOverrides]
  );

  // Keep the table group inside the room whenever room/table/layout/seating change.
  useEffect(() => {
    setTableOffset((prev) => clampTableOffset(prev, room, layoutResult.groupBounds));
  }, [room, layoutResult.groupBounds]);

  // Table size stays proportional to the room: as the room shrinks, cap the table so
  // there's always clearance for chairs and a walkway. Growing the room doesn't force
  // the table to grow back — only clamps down when it's now too big.
  useEffect(() => {
    const limits = getTableLimits({ length: room.length, width: room.width });
    setTable((t) => {
      const nextLength = clamp(t.length, limits.length[0], limits.length[1]);
      const nextWidth = clamp(t.width, limits.width[0], limits.width[1]);
      if (nextLength === t.length && nextWidth === t.width) return t;
      return { ...t, length: nextLength, width: nextWidth };
    });
  }, [room.length, room.width]);

  // Classroom/theater seating is capped by how many rows and seats actually fit the
  // room at realistic spacing; rectangular/oval/U-shape are capped by how many chairs
  // fit around the table itself without squeezing past flush-against-each-other
  // spacing. Clamp down whenever the layout, room, or table shrinks below the count.
  useEffect(() => {
    const [min, max] = getChairLimits(layout, { length: room.length, width: room.width }, table);
    setChairCount((c) => clamp(c, min, max));
  }, [layout, room.length, room.width, table.length, table.width, table.orientation]);

  // Per-chair deletions/repositioning and per-pod size overrides apply to the
  // current generated seating plan; once the plan itself changes shape (count,
  // layout, table, or room), start fresh — pod indices aren't stable identities
  // across a regeneration.
  useEffect(() => {
    setRemovedChairIndices(new Set());
    setChairOffsets({});
    setPodSizeOverrides({});
    setSelection((s) => (s?.category === "chair" || s?.category === "tablePod" ? null : s));
  }, [layout, chairCount, table.length, table.width, table.orientation, room.length, room.width]);

  const handleRemoveChair = (index) => {
    setRemovedChairIndices((prev) => {
      const next = new Set(prev);
      next.add(index);
      return next;
    });
  };

  const handleChairDragCommit = (index, dx, dy) => {
    setChairOffsets((prev) => ({ ...prev, [index]: { ...prev[index], dx, dy } }));
  };

  const handleSetChairAngle = (index, angle) => {
    setChairOffsets((prev) => ({ ...prev, [index]: { dx: 0, dy: 0, ...prev[index], angle } }));
  };

  // Keep placed devices inside the room when it shrinks.
  useEffect(() => {
    setDevices((prev) => {
      let changed = false;
      const next = {};
      for (const cat of Object.keys(prev)) {
        next[cat] = prev[cat].map((item) => {
          const cx = clamp(item.x, 0, room.length);
          const cy = clamp(item.y, 0, room.width);
          if (cx !== item.x || cy !== item.y) { changed = true; return { ...item, x: cx, y: cy }; }
          return item;
        });
      }
      return changed ? next : prev;
    });
  }, [room.length, room.width]);

  const lengthApplicable = ["rectangular", "oval", "ushape"].includes(layout);
  const widthApplicable = ["rectangular", "oval", "ushape", "classroom"].includes(layout);
  const orientationApplicable = ["rectangular", "oval", "ushape"].includes(layout);

  const handleAddDevice = (category) => {
    if (category === "display") { setDisplayDialogOpen(true); return; }
    if (category === "camera") { setCameraDialogOpen(true); return; }
    if (category === "microphone") {
      const tableCenter = { x: room.length / 2 + tableOffset.x, y: room.width / 2 + tableOffset.y };
      const boxWAbs = table.orientation === 0 ? table.length : table.width;
      const count = devices.microphone.length;
      const pos = microphoneSpreadPosition(count, count + 1, tableCenter, boxWAbs);
      const item = { id: uid("microphone"), x: clamp(pos.x, 0, room.length), y: clamp(pos.y, 0, room.width) };
      setDevices((d) => ({ ...d, microphone: [...d.microphone, item] }));
      setSelection({ category: "microphone", id: item.id });
      return;
    }
    setSelection(null);
    setArmedPlacement({ category, label: DEVICE_LABELS[category].toLowerCase() });
  };

  const handleRemoveDevice = (category) => {
    const arr = devices[category];
    if (!arr.length) return;
    let idToRemove = arr[arr.length - 1].id;
    if (selection?.category === category && arr.some((i) => i.id === selection.id)) idToRemove = selection.id;
    setDevices((d) => ({ ...d, [category]: d[category].filter((i) => i.id !== idToRemove) }));
    if (selection?.category === category && selection.id === idToRemove) setSelection(null);
  };

  const handleChooseDisplaySize = (size) => {
    setDisplayDialogOpen(false);
    setArmedPlacement({ category: "display", label: `${size}" display`, payload: { sizeInches: size } });
  };
  const handleChooseCameraFov = (fov) => {
    setCameraDialogOpen(false);
    setArmedPlacement({ category: "camera", label: `${fov}° camera`, payload: { fov, isTableCam: false } });
  };
  const handleChooseTableCam = () => {
    setCameraDialogOpen(false);
    setArmedPlacement({ category: "camera", label: "Neat 360° table camera", payload: { isTableCam: true, fov: 360 } });
  };

  const handlePlaceAt = (x, y) => {
    if (!armedPlacement) return;
    const { category, payload } = armedPlacement;
    const resolved = resolvePlacement(category, x, y, room);
    let item = { id: uid(category), x: resolved.x, y: resolved.y, angle: resolved.angle ?? 0 };
    if (category === "display") item = { ...item, sizeInches: payload.sizeInches, mount: resolved.mount };
    if (category === "touchPanel") item = { ...item, mount: resolved.mount };
    if (category === "door" || category === "bookingPanel") item = { ...item, edge: resolved.edge };
    if (category === "camera") {
      const tableCenter = { x: room.length / 2 + tableOffset.x, y: room.width / 2 + tableOffset.y };
      const angle = payload.isTableCam ? 0 : cameraFacingToward({ x: resolved.x, y: resolved.y }, tableCenter);
      item = { ...item, fov: payload.fov, isTableCam: payload.isTableCam, angle };
    }
    setDevices((d) => ({ ...d, [category]: [...d[category], item] }));
    setSelection({ category, id: item.id });
    setArmedPlacement(null);
  };

  const handleDeviceDragCommit = (category, id, rawX, rawY) => {
    const resolved = resolvePlacement(category, rawX, rawY, room);
    setDevices((d) => ({
      ...d,
      [category]: d[category].map((item) => {
        if (item.id !== id) return item;
        const next = { ...item, x: resolved.x, y: resolved.y };
        if (category === "door" || category === "bookingPanel") { next.angle = resolved.angle; next.edge = resolved.edge; }
        if (category === "display" || category === "touchPanel") {
          next.mount = resolved.mount;
          if (resolved.mount === "wall") next.angle = resolved.angle;
        }
        return next;
      }),
    }));
  };

  const handleTableDragCommit = (rawOffset) => {
    setTableOffset(clampTableOffset(rawOffset, room, layoutResult.groupBounds));
  };

  const handleRotateSelected = (delta) => {
    if (!selection || selection.category === "table" || selection.category === "tablePod") return;
    setDevices((d) => ({
      ...d,
      [selection.category]: d[selection.category].map((item) =>
        item.id === selection.id ? { ...item, angle: rotateBy(item.angle || 0, delta) } : item
      ),
    }));
  };

  const handleSetItemAngle = (category, id, angle) => {
    setDevices((d) => ({
      ...d,
      [category]: d[category].map((item) => (item.id === id ? { ...item, angle } : item)),
    }));
  };

  const handleRemoveSelected = () => {
    if (!selection || selection.category === "table" || selection.category === "tablePod") return;
    setDevices((d) => ({ ...d, [selection.category]: d[selection.category].filter((i) => i.id !== selection.id) }));
    setSelection(null);
  };

  // Open Collaboration only: the selected pod's live diameter, and a setter that
  // stores an override for it — read by the Table length/width controls so a pod
  // can be resized individually once selected, instead of resizing every table.
  // The radius range is capped per the room's actual grid, not just the pod's own
  // absolute bounds, so a resize can never grow a pod into its neighbor's chairs.
  const selectedPod = selection?.category === "tablePod" ? layoutResult.tableShape.tables?.[selection.index] : null;
  const selectedPodDiameter = selectedPod ? selectedPod.radius * 2 : null;
  const selectedPodRadiusLimits = selectedPod ? getPodRadiusLimits(room, chairCount) : POD_RADIUS_LIMITS;
  const handleResizeSelectedPod = (diameter) => {
    if (selection?.category !== "tablePod") return;
    const radius = clamp(diameter / 2, selectedPodRadiusLimits[0], selectedPodRadiusLimits[1]);
    setPodSizeOverrides((prev) => ({ ...prev, [selection.index]: radius }));
  };

  const handleToggleCameraFeature = (id) => {
    setCameraFeatures((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));
  };

  // At least one wall material always stays selected — an empty wall spec isn't a
  // valid room finish, unlike camera features which can legitimately be "none".
  const handleToggleWallMaterial = (material) => {
    setWallMaterials((prev) => {
      if (prev.includes(material)) {
        return prev.length > 1 ? prev.filter((m) => m !== material) : prev;
      }
      return [...prev, material];
    });
  };

  const handleAddRoomImages = (files) => {
    const next = files.map((file) => ({ id: uid("photo"), file, previewUrl: URL.createObjectURL(file) }));
    setRoomImages((prev) => [...prev, ...next]);
  };

  const handleRemoveRoomImage = (id) => {
    setRoomImages((prev) => {
      const target = prev.find((img) => img.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((img) => img.id !== id);
    });
  };

  const handleReset = () => {
    setRoom(DEFAULT_ROOM);
    setTable(DEFAULT_TABLE);
    setChairCount(8);
    setLayout("rectangular");
    setPlatform(PLATFORMS[0]);
    setAudioPreference(AUDIO_PREFERENCES[0]);
    setWallMaterials([WALL_MATERIALS[0]]);
    setFloorType(FLOOR_TYPES[0]);
    setCeilingType(CEILING_TYPES[0]);
    setTableTopMaterial(TABLE_TOP_MATERIALS[0]);
    setCameraFeatures([]);
    setAdditionalNotes("");
    setTableOffset({ x: 0, y: 0 });
    setDevices(EMPTY_DEVICES);
    setSelection(null);
    setArmedPlacement(null);
    setRemovedChairIndices(new Set());
    setChairOffsets({});
    setPodSizeOverrides({});
    roomImages.forEach((img) => URL.revokeObjectURL(img.previewUrl));
    setRoomImages([]);
  };

  const effectiveChairCount = Math.max(0, chairCount - removedChairIndices.size);
  const state = {
    room,
    table,
    chairCount: effectiveChairCount,
    layout,
    platform,
    audioPreference,
    devices,
    tableOffset,
    wallMaterials,
    floorType,
    ceilingType,
    tableTopMaterial,
    cameraFeatures,
    additionalNotes,
  };

  const handleExport = async ({ roomName, customerName, createdBy }) => {
    setExporting(true);
    try {
      await exportRoomConfigPdf({
        state,
        layoutResult,
        removedChairIndices,
        chairOffsets,
        roomName,
        customerName,
        createdBy,
        diagramElement: diagramRef.current,
        images: roomImages.map((img) => img.file),
      });
      toast.success("PDF downloaded");
      setExportDialogOpen(false);
    } catch {
      toast.error("Couldn't generate the PDF — please try again");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <SEO
        title="Meeting Room & AV Configurator"
        description="Design your meeting room before the site survey — set dimensions, seating layout, and AV device placement with Fidelis Logic's interactive room configurator."
        keywords="meeting room configurator, AV room design tool, conference room planner"
      />
      <Breadcrumbs items={[{ name: "Solutions", href: "/solutions" }, { name: "Room Configurator" }]} className="pt-24" />

      <div className="mx-auto max-w-[1600px] px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Meeting Room &amp; AV Configurator</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-500 sm:text-base">
            AV mistakes are expensive once they're installed — a display too small for the room, a camera that
            can't see the whole table, or seating that doesn't fit the space. Working through those details here
            means your site survey confirms a plan that already works, instead of catching problems on install day.
          </p>
          <p className="mt-2 max-w-2xl text-sm text-slate-500 sm:text-base">
            Sketch your room, choose a seating layout, and place AV components before your site survey.
          </p>
        </div>

        <div className="bg-slate-50">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-stretch">
            <div className="min-w-0 flex-1">
              <RoomStatsCard room={room} layout={layout} capacity={effectiveChairCount} />
            </div>
            <button
              onClick={handleReset}
              className="flex min-h-[44px] shrink-0 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition-colors hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 active:scale-[0.98]"
            >
              <RotateCcw className="h-4 w-4" />
              Reset configuration
            </button>
          </div>

          <DimensionsBar
            room={room}
            table={table}
            chairCount={chairCount}
            layout={layout}
            onRoomChange={setRoom}
            onTableChange={setTable}
            onChairCountChange={setChairCount}
            onToggleOrientation={() => setTable((t) => ({ ...t, orientation: t.orientation === 0 ? 90 : 0 }))}
            layoutSupportsTable={orientationApplicable}
            lengthApplicable={lengthApplicable}
            widthApplicable={widthApplicable}
            doorCount={devices.door.length}
            onAddDoor={() => handleAddDevice("door")}
            onRemoveDoor={() => handleRemoveDevice("door")}
            selectedPodDiameter={selectedPodDiameter}
            selectedPodRadiusLimits={selectedPodRadiusLimits}
            onResizeSelectedPod={handleResizeSelectedPod}
          />

          <div className="mt-6 grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="min-w-0">
              <RoomCanvas
                room={room}
                table={table}
                chairCount={chairCount}
                layout={layout}
                layoutResult={layoutResult}
                tableOffset={tableOffset}
                devices={devices}
                selection={selection}
                armedPlacement={armedPlacement}
                onSelect={setSelection}
                onPlaceAt={handlePlaceAt}
                onCancelPlacement={() => setArmedPlacement(null)}
                onTableDragCommit={handleTableDragCommit}
                onDeviceDragCommit={handleDeviceDragCommit}
                onRotateSelected={handleRotateSelected}
                onSetItemAngle={handleSetItemAngle}
                onRemoveSelected={handleRemoveSelected}
                removedChairIndices={removedChairIndices}
                onRemoveChair={handleRemoveChair}
                chairOffsets={chairOffsets}
                onChairDragCommit={handleChairDragCommit}
                onSetChairAngle={handleSetChairAngle}
                diagramRef={diagramRef}
              />
            </div>
            <div>
              <ControlsPanel
                layout={layout}
                onLayoutChange={setLayout}
                devices={devices}
                onAddDevice={handleAddDevice}
                onRemoveDevice={handleRemoveDevice}
                platform={platform}
                onPlatformChange={setPlatform}
                audioPreference={audioPreference}
                onAudioPreferenceChange={setAudioPreference}
                wallMaterials={wallMaterials}
                onToggleWallMaterial={handleToggleWallMaterial}
                floorType={floorType}
                onFloorTypeChange={setFloorType}
                ceilingType={ceilingType}
                onCeilingTypeChange={setCeilingType}
                tableTopMaterial={tableTopMaterial}
                onTableTopMaterialChange={setTableTopMaterial}
                cameraFeatures={cameraFeatures}
                onToggleCameraFeature={handleToggleCameraFeature}
                additionalNotes={additionalNotes}
                onAdditionalNotesChange={setAdditionalNotes}
              />
            </div>
          </div>

          <div className="mt-6">
            <SummaryPanel state={state} />
          </div>

          <div className="mt-6">
            <RoomImagesPanel
              images={roomImages}
              onAddImages={handleAddRoomImages}
              onRemoveImage={handleRemoveRoomImage}
            />
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center gap-2 border-t border-slate-200 pt-8 text-center">
          <button
            onClick={() => setExportDialogOpen(true)}
            className="flex min-h-[48px] items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 active:scale-[0.98]"
          >
            <FileDown className="h-4 w-4" />
            Export as PDF
          </button>
          <p className="max-w-md text-xs text-slate-400">
            Downloads a branded PDF report of your room configuration, ready to share with your team.
          </p>
        </div>
      </div>

      <DisplaySizeDialog open={displayDialogOpen} onOpenChange={setDisplayDialogOpen} onChoose={handleChooseDisplaySize} />
      <CameraFovDialog
        open={cameraDialogOpen}
        onOpenChange={setCameraDialogOpen}
        onChoose={handleChooseCameraFov}
        onChooseTableCam={handleChooseTableCam}
      />
      <ExportDialog
        open={exportDialogOpen}
        onOpenChange={setExportDialogOpen}
        onExport={handleExport}
        exporting={exporting}
      />
    </div>
  );
};
