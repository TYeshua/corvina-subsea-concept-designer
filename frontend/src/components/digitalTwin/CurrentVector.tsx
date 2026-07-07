import { Html, Line } from "@react-three/drei";
import { Quaternion, Vector3 } from "three";

interface CurrentVectorProps {
  visible: boolean;
  velocity: number;
}

export function CurrentVector({ visible, velocity }: CurrentVectorProps) {
  if (!visible) {
    return null;
  }

  const from = new Vector3(4.8, -1.2, -3.8);
  const to = new Vector3(-4.8, -2.0, 3.8);
  const direction = to.clone().sub(from).normalize();
  const quaternion = new Quaternion().setFromUnitVectors(
    new Vector3(0, 1, 0),
    direction,
  );
  const midpoint = from.clone().lerp(to, 0.5);

  return (
    <group>
      <Line
        points={[from, to]}
        color="#38bdf8"
        lineWidth={3}
        dashed
        dashSize={0.35}
        gapSize={0.22}
        transparent
        opacity={0.95}
      />
      <mesh position={to} quaternion={quaternion}>
        <coneGeometry args={[0.18, 0.48, 18]} />
        <meshStandardMaterial color="#38bdf8" emissive="#0e7490" />
      </mesh>
      <Html position={[midpoint.x, midpoint.y + 0.35, midpoint.z]} center distanceFactor={10}>
        <div className="rounded border border-cyan-500/30 bg-slate-950/85 px-3 py-1 text-[11px] text-cyan-50">
          <strong>Corrente NE → SW</strong>
          <br />
          Velocidade de projeto: {velocity.toLocaleString("pt-BR")} m/s
        </div>
      </Html>
    </group>
  );
}

