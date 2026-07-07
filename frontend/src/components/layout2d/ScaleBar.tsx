interface ScaleBarProps {
  x: number;
  y: number;
  pixelsPerKm: number;
  lengthKm?: number;
}

export function ScaleBar({ x, y, pixelsPerKm, lengthKm = 2 }: ScaleBarProps) {
  const width = pixelsPerKm * lengthKm;

  return (
    <g>
      <line x1={x} y1={y} x2={x + width} y2={y} stroke="#e2e8f0" strokeWidth={3} />
      <line x1={x} y1={y - 6} x2={x} y2={y + 6} stroke="#e2e8f0" strokeWidth={2} />
      <line
        x1={x + width}
        y1={y - 6}
        x2={x + width}
        y2={y + 6}
        stroke="#e2e8f0"
        strokeWidth={2}
      />
      <text x={x} y={y + 22} fill="#cbd5e1" fontSize={12}>
        0 km
      </text>
      <text x={x + width} y={y + 22} textAnchor="end" fill="#cbd5e1" fontSize={12}>
        {lengthKm} km
      </text>
    </g>
  );
}
