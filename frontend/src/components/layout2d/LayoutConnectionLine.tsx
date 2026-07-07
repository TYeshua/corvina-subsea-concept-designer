import type { LayoutConnection } from "../../types/layout";
import type { NormalizedConnectionType } from "../../utils/layoutScale";

interface Point {
  x: number;
  y: number;
}

interface LayoutConnectionLineProps {
  id: string;
  connection: LayoutConnection;
  type: NormalizedConnectionType;
  from: Point;
  to: Point;
  selected: boolean;
  index: number;
  onSelect: (connection: LayoutConnection, id: string) => void;
}

const connectionStyles: Record<
  NormalizedConnectionType,
  { color: string; width: number; dash?: string; marker: string }
> = {
  production_flowline: {
    color: "#34d399",
    width: 4,
    marker: "arrow-production-flowline",
  },
  water_injection_flowline: {
    color: "#60a5fa",
    width: 3,
    marker: "arrow-water-injection-flowline",
  },
  gas_injection_flowline: {
    color: "#a78bfa",
    width: 3,
    marker: "arrow-gas-injection-flowline",
  },
  riser: {
    color: "#22d3ee",
    width: 4,
    dash: "10 7",
    marker: "arrow-riser",
  },
  umbilical: {
    color: "#facc15",
    width: 2,
    dash: "8 7",
    marker: "arrow-umbilical",
  },
  control_link: {
    color: "#fde68a",
    width: 2,
    dash: "2 6",
    marker: "arrow-control-link",
  },
  jumper: {
    color: "#e2e8f0",
    width: 2,
    marker: "arrow-jumper",
  },
  unknown: {
    color: "#94a3b8",
    width: 2,
    marker: "arrow-unknown",
  },
};

function createPath(
  from: Point,
  to: Point,
  type: NormalizedConnectionType,
  index: number,
): string {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const distance = Math.max(Math.sqrt(dx * dx + dy * dy), 1);
  const normalX = -dy / distance;
  const normalY = dx / distance;

  const baseOffset =
    type === "riser"
      ? 34
      : type === "umbilical"
        ? -28
        : type === "gas_injection_flowline"
          ? 18
          : type === "water_injection_flowline"
            ? -14
            : 0;
  const offset = baseOffset + (index % 3) * 4;

  if (offset === 0) {
    return `M ${from.x} ${from.y} L ${to.x} ${to.y}`;
  }

  const controlX = (from.x + to.x) / 2 + normalX * offset;
  const controlY = (from.y + to.y) / 2 + normalY * offset;

  return `M ${from.x} ${from.y} Q ${controlX} ${controlY} ${to.x} ${to.y}`;
}

export function LayoutConnectionLine({
  id,
  connection,
  type,
  from,
  to,
  selected,
  index,
  onSelect,
}: LayoutConnectionLineProps) {
  const style = connectionStyles[type];
  const path = createPath(from, to, type, index);

  return (
    <g
      role="button"
      tabIndex={0}
      data-layout-connection-id={id}
      className="cursor-pointer outline-none"
      onClick={(event) => {
        event.stopPropagation();
        onSelect(connection, id);
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          onSelect(connection, id);
        }
      }}
    >
      <title>{`${connection.from} → ${connection.to} — ${connection.fluid_or_service}`}</title>
      <path
        d={path}
        fill="none"
        stroke="transparent"
        strokeWidth={14}
        pointerEvents="stroke"
      />
      <path
        d={path}
        fill="none"
        stroke={selected ? "#ffffff" : style.color}
        strokeWidth={selected ? style.width + 2 : style.width}
        strokeDasharray={style.dash}
        markerEnd={`url(#${style.marker})`}
        filter={selected ? "url(#selectedGlow)" : undefined}
        opacity={selected ? 1 : 0.9}
        pointerEvents="none"
      />
    </g>
  );
}
