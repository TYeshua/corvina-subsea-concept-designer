import { formatDecimal } from "../../utils/format";

interface CurrentArrowProps {
  x: number;
  y: number;
  velocity: number;
}

export function CurrentArrow({ x, y, velocity }: CurrentArrowProps) {
  return (
    <g>
      <line
        x1={x + 96}
        y1={y}
        x2={x}
        y2={y + 54}
        stroke="#38bdf8"
        strokeWidth={3}
        strokeDasharray="8 7"
        markerEnd="url(#arrow-current)"
      />
      <text
        x={x - 2}
        y={y + 76}
        fill="#cffafe"
        fontSize={12}
        fontWeight={700}
        paintOrder="stroke"
        stroke="#020617"
        strokeWidth={3}
      >
        Corrente NE → SW
      </text>
      <text
        x={x - 2}
        y={y + 94}
        fill="#94a3b8"
        fontSize={11}
        paintOrder="stroke"
        stroke="#020617"
        strokeWidth={3}
      >
        Velocidade de projeto: {formatDecimal(velocity)} m/s
      </text>
    </g>
  );
}
