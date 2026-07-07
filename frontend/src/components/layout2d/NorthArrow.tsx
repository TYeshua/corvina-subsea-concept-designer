interface NorthArrowProps {
  x: number;
  y: number;
}

export function NorthArrow({ x, y }: NorthArrowProps) {
  return (
    <g>
      <circle
        cx={x}
        cy={y}
        r={28}
        fill="#020617"
        stroke="#22d3ee"
        strokeOpacity={0.65}
      />
      <path
        d={`M ${x} ${y - 19} L ${x + 8} ${y + 8} L ${x} ${y + 3} L ${
          x - 8
        } ${y + 8} Z`}
        fill="#67e8f9"
      />
      <text
        x={x}
        y={y - 34}
        textAnchor="middle"
        fill="#a5f3fc"
        fontSize={14}
        fontWeight={700}
      >
        N
      </text>
    </g>
  );
}
