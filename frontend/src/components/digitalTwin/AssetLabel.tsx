import { Html } from "@react-three/drei";

interface AssetLabelProps {
  text: string;
  position: [number, number, number];
}

export function AssetLabel({ text, position }: AssetLabelProps) {
  return (
    <Html position={position} center distanceFactor={9} style={{ pointerEvents: "none" }}>
      <div
        className="rounded border border-cyan-500/30 bg-slate-950/80 px-2 py-0.5 text-[10px] font-semibold text-cyan-50 shadow-lg"
        data-testid="digital-twin-asset-label"
      >
        {text}
      </div>
    </Html>
  );
}
