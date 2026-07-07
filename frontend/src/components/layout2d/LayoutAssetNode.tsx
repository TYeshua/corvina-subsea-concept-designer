import type { LayoutAsset } from "../../types/layout";
import type { NormalizedAssetType } from "../../utils/layoutScale";
import { getAssetX, getAssetY } from "../../utils/layoutScale";

interface LayoutAssetNodeProps {
  asset: LayoutAsset;
  type: NormalizedAssetType;
  x: number;
  y: number;
  selected: boolean;
  showLabel: boolean;
  onSelect: (asset: LayoutAsset) => void;
}

interface LabelOffset {
  dx: number;
  dy: number;
  anchor?: "start" | "middle" | "end";
}

const assetStyles: Record<
  NormalizedAssetType,
  { fill: string; stroke: string; labelDy: number }
> = {
  fpso: { fill: "#0e7490", stroke: "#67e8f9", labelDy: -26 },
  producer_well: { fill: "#059669", stroke: "#6ee7b7", labelDy: -20 },
  water_injector_well: { fill: "#2563eb", stroke: "#93c5fd", labelDy: -20 },
  gas_injector_well: { fill: "#7c3aed", stroke: "#c4b5fd", labelDy: -20 },
  production_manifold: { fill: "#0891b2", stroke: "#67e8f9", labelDy: -22 },
  water_injection_manifold: { fill: "#1d4ed8", stroke: "#93c5fd", labelDy: -22 },
  gas_plet: { fill: "#c2410c", stroke: "#fdba74", labelDy: -24 },
  sdu: { fill: "#ca8a04", stroke: "#fde68a", labelDy: -18 },
  unknown: { fill: "#475569", stroke: "#cbd5e1", labelDy: -18 },
};

const labelOffsets: Record<string, LabelOffset> = {
  "SDU-01": { dx: 34, dy: -2, anchor: "start" },
  "SDU-02": { dx: 34, dy: -2, anchor: "start" },
  "SDU-03": { dx: 30, dy: -10, anchor: "start" },
  "MI-WATER": { dx: 0, dy: 28, anchor: "middle" },
  "PLET-GAS": { dx: 0, dy: -30, anchor: "middle" },
  "I-02": { dx: 0, dy: -38, anchor: "middle" },
};

function getLabelOffset(asset: LayoutAsset, type: NormalizedAssetType): LabelOffset {
  return (
    labelOffsets[asset.id] ?? {
      dx: 0,
      dy: assetStyles[type].labelDy,
      anchor: "middle",
    }
  );
}

function Hexagon({ x, y, selected }: { x: number; y: number; selected: boolean }) {
  const points = [
    [x, y - 10],
    [x + 10, y - 5],
    [x + 10, y + 5],
    [x, y + 10],
    [x - 10, y + 5],
    [x - 10, y - 5],
  ]
    .map((point) => point.join(","))
    .join(" ");

  return (
    <polygon
      points={points}
      fill={assetStyles.sdu.fill}
      stroke={selected ? "#ffffff" : assetStyles.sdu.stroke}
      strokeWidth={selected ? 3 : 2}
    />
  );
}

export function LayoutAssetNode({
  asset,
  type,
  x,
  y,
  selected,
  showLabel,
  onSelect,
}: LayoutAssetNodeProps) {
  const style = assetStyles[type];
  const stroke = selected ? "#ffffff" : style.stroke;
  const strokeWidth = selected ? 3 : 2;
  const commonProps = {
    fill: style.fill,
    stroke,
    strokeWidth,
  };
  const labelOffset = getLabelOffset(asset, type);
  const labelX = x + labelOffset.dx;
  const labelY = y + labelOffset.dy;
  const labelHasLeader = Math.abs(labelOffset.dx) > 18 || Math.abs(labelOffset.dy) > 30;

  return (
    <g
      role="button"
      tabIndex={0}
      data-layout-asset-id={asset.id}
      className="cursor-pointer outline-none"
      filter={selected ? "url(#selectedGlow)" : undefined}
      onClick={(event) => {
        event.stopPropagation();
        onSelect(asset);
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          onSelect(asset);
        }
      }}
    >
      <title>{`${asset.id} — ${asset.name}`}</title>

      {type === "fpso" ? (
        <g>
          <rect
            x={x - 42}
            y={y - 14}
            width={84}
            height={28}
            rx={6}
            {...commonProps}
          />
          <path
            d={`M ${x - 34} ${y + 14} L ${x + 34} ${y + 14} L ${x + 24} ${
              y + 24
            } L ${x - 24} ${y + 24} Z`}
            fill="#075985"
            stroke={stroke}
            strokeWidth={strokeWidth}
          />
        </g>
      ) : type === "producer_well" ||
        type === "water_injector_well" ||
        type === "gas_injector_well" ||
        type === "unknown" ? (
        <circle cx={x} cy={y} r={selected ? 11 : 9} {...commonProps} />
      ) : type === "production_manifold" ||
        type === "water_injection_manifold" ? (
        <rect
          x={x - 12}
          y={y - 12}
          width={24}
          height={24}
          rx={4}
          {...commonProps}
        />
      ) : type === "gas_plet" ? (
        <rect
          x={x - 12}
          y={y - 12}
          width={24}
          height={24}
          transform={`rotate(45 ${x} ${y})`}
          {...commonProps}
        />
      ) : (
        <Hexagon x={x} y={y} selected={selected} />
      )}

      {showLabel && labelHasLeader ? (
        <line
          x1={x}
          y1={y}
          x2={labelX}
          y2={labelY + 4}
          stroke="#94a3b8"
          strokeOpacity={0.55}
          strokeDasharray="3 4"
        />
      ) : null}

      {showLabel ? (
        <text
          x={labelX}
          y={labelY}
          textAnchor={labelOffset.anchor ?? "middle"}
          fill="#f8fafc"
          fontSize={13}
          fontWeight={700}
          paintOrder="stroke"
          stroke="#020617"
          strokeWidth={4}
        >
          {asset.id}
        </text>
      ) : null}

      {showLabel && selected && type !== "fpso" ? (
        <text
          x={labelX}
          y={labelY + 16}
          textAnchor={labelOffset.anchor ?? "middle"}
          fill="#cbd5e1"
          fontSize={10}
          paintOrder="stroke"
          stroke="#020617"
          strokeWidth={3}
        >
          {`${getAssetX(asset).toFixed(1)}, ${getAssetY(asset).toFixed(1)} km`}
        </text>
      ) : null}
    </g>
  );
}
