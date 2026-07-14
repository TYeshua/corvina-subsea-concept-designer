import { Text } from "@react-three/drei";
import {
  FIELD_HEIGHT_KM,
  FIELD_WIDTH_KM,
  HORIZONTAL_SCALE,
  scaleSeabedY,
} from "../../utils/digitalTwinScale";

interface ReservoirLayerProps {
  reservoirY: number;
  label?: string;
  visible: boolean;
}

export function ReservoirLayer({
  reservoirY,
  label,
  visible,
}: ReservoirLayerProps) {
  if (!visible) {
    return null;
  }

  const y = scaleSeabedY(reservoirY);
  const width = FIELD_WIDTH_KM * HORIZONTAL_SCALE + 1.2;
  const depth = FIELD_HEIGHT_KM * HORIZONTAL_SCALE + 1.2;

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, y, 0]}>
        <planeGeometry args={[width, depth, 24, 24]} />
        <meshStandardMaterial
          color="#7c2d12"
          emissive="#451a03"
          emissiveIntensity={0.26}
          roughness={0.88}
          transparent
          opacity={0.36}
        />
      </mesh>
      <gridHelper
        args={[Math.max(width, depth), 12, "#f97316", "#78350f"]}
        position={[0, y + 0.03, 0]}
      />
      <mesh position={[0, y + 0.05, 0]}>
        <boxGeometry args={[width, 0.05, depth]} />
        <meshBasicMaterial color="#f97316" transparent opacity={0.06} />
      </mesh>
      <Text
        position={[-width / 2 + 0.8, y + 0.18, -depth / 2 + 0.8]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.25}
        color="#fed7aa"
        anchorX="left"
        anchorY="middle"
      >
        {label ?? "Reservatório - 5.600 m"}
      </Text>
    </group>
  );
}
