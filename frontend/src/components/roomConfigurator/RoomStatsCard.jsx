import { Building2, Users, Ruler } from "lucide-react";
import { classifyRoomType } from "../../lib/roomConfiguratorEngine";

function StatTile({ icon: Icon, label, value, sub }) {
  return (
    <div className="flex min-h-[44px] items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3.5 shadow-sm">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <div className="text-[11px] font-medium uppercase tracking-wide text-slate-400">{label}</div>
        <div className="truncate text-[15px] font-semibold leading-tight text-slate-900">{value}</div>
        {sub && <div className="text-xs leading-tight text-slate-400">{sub}</div>}
      </div>
    </div>
  );
}

export function RoomStatsCard({ room, layout, capacity }) {
  const roomType = classifyRoomType({ layout, room });
  const area = room.length * room.width;
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <StatTile icon={Building2} label="Current room" value={roomType} />
      <StatTile icon={Users} label="Capacity" value={`${capacity} ${capacity === 1 ? "person" : "people"}`} />
      <StatTile
        icon={Ruler}
        label="Room size"
        value={`${room.length.toFixed(1)} × ${room.width.toFixed(1)} m`}
        sub={`${area.toFixed(1)} m² floor area`}
      />
    </div>
  );
}
