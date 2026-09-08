// Small top-down illustrations for each Camera Features option. These are original
// diagrams (not vendor artwork or photography) — the visual language of a top-down
// room with a camera cone and highlighted framing boxes is how intelligent-framing
// features are commonly explained across the industry (Poly DirectorAI's speaker
// tracking/group framing, Jabra PanaCast's virtual director, Neat Symmetry's speaker
// and individual framing), so each drawing depicts the behavior itself rather than
// any one vendor's product.

const HEAD_FILL = "#94A3B8";
const HEAD_ACTIVE = "#2563EB";
const FRAME_STROKE = "#2563EB";
const CAMERA_FILL = "#1E293B";

function CameraGlyph({ x, y }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-9} y={-5} width={18} height={10} rx={2.5} fill={CAMERA_FILL} />
      <circle cx={0} cy={0} r={2.6} fill="#60A5FA" />
    </g>
  );
}

function Person({ x, y, active = false, r = 6 }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle cx={0} cy={0} r={r} fill={active ? HEAD_ACTIVE : HEAD_FILL} />
      <path
        d={`M ${-r * 1.5} ${r * 1.9} A ${r * 1.5} ${r * 1.5} 0 0 1 ${r * 1.5} ${r * 1.9}`}
        fill={active ? HEAD_ACTIVE : HEAD_FILL}
        opacity={0.55}
      />
    </g>
  );
}

export function TrackActiveSpeakerIllustration() {
  return (
    <svg viewBox="0 0 200 120" className="h-full w-full">
      <rect x={1} y={1} width={198} height={118} rx={8} fill="#F1F5F9" stroke="#E2E8F0" />
      <CameraGlyph x={100} y={16} />
      {/* motion trail from a previous position to the current, actively-framed one */}
      <path d="M 55 78 Q 90 60 138 66" fill="none" stroke="#93C5FD" strokeWidth={2} strokeDasharray="3 4" />
      <Person x={55} y={78} r={6} />
      <Person x={100} y={82} r={6} />
      <Person x={138} y={66} active r={7} />
      <rect x={122} y={49} width={32} height={34} rx={4} fill="none" stroke={FRAME_STROKE} strokeWidth={2} strokeDasharray="4 3" />
      <path d="M 154 60 l 6 -3 v 6 z" fill={FRAME_STROKE} />
    </svg>
  );
}

export function StaticWideViewIllustration() {
  return (
    <svg viewBox="0 0 200 120" className="h-full w-full">
      <rect x={1} y={1} width={198} height={118} rx={8} fill="#F1F5F9" stroke="#E2E8F0" />
      <CameraGlyph x={100} y={16} />
      <rect x={22} y={44} width={156} height={56} rx={4} fill="none" stroke={FRAME_STROKE} strokeWidth={2} />
      <rect x={60} y={62} width={80} height={22} rx={4} fill="#E2E8F0" />
      <Person x={44} y={80} r={6} />
      <Person x={76} y={86} r={6} />
      <Person x={124} y={86} r={6} />
      <Person x={156} y={80} r={6} />
    </svg>
  );
}

export function MultiSpeakerFramingIllustration() {
  return (
    <svg viewBox="0 0 200 120" className="h-full w-full">
      <rect x={1} y={1} width={198} height={118} rx={8} fill="#F1F5F9" stroke="#E2E8F0" />
      <CameraGlyph x={100} y={16} />
      <Person x={40} y={82} r={6} />
      <Person x={160} y={82} r={6} />
      <Person x={72} y={88} active r={7} />
      <rect x={58} y={72} width={28} height={30} rx={4} fill="none" stroke={FRAME_STROKE} strokeWidth={2} strokeDasharray="4 3" />
      <Person x={128} y={88} active r={7} />
      <rect x={114} y={72} width={28} height={30} rx={4} fill="none" stroke={FRAME_STROKE} strokeWidth={2} strokeDasharray="4 3" />
      <g opacity={0.85}>
        <path d="M 68 62 q 4 -5 8 0" fill="none" stroke={FRAME_STROKE} strokeWidth={1.6} strokeLinecap="round" />
        <path d="M 124 62 q 4 -5 8 0" fill="none" stroke={FRAME_STROKE} strokeWidth={1.6} strokeLinecap="round" />
      </g>
    </svg>
  );
}

export function IndividualTilesIllustration() {
  const people = [
    { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 },
    { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 },
  ];
  return (
    <svg viewBox="0 0 200 120" className="h-full w-full">
      <rect x={1} y={1} width={198} height={118} rx={8} fill="#F1F5F9" stroke="#E2E8F0" />
      <CameraGlyph x={100} y={14} />
      {people.map((p, i) => {
        const tileW = 56, tileH = 40, gap = 6;
        const gridW = tileW * 3 + gap * 2;
        const startX = 100 - gridW / 2;
        const startY = 34;
        const tx = startX + p.x * (tileW + gap);
        const ty = startY + p.y * (tileH + gap);
        return (
          <g key={i}>
            <rect x={tx} y={ty} width={tileW} height={tileH} rx={4} fill="#FFFFFF" stroke={FRAME_STROKE} strokeWidth={1.6} />
            <Person x={tx + tileW / 2} y={ty + tileH / 2 + 2} r={9} active />
          </g>
        );
      })}
    </svg>
  );
}
