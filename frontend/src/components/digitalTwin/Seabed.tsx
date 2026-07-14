import { Text } from "@react-three/drei";
import { FIELD_HEIGHT_KM, FIELD_WIDTH_KM, HORIZONTAL_SCALE } from "../../utils/digitalTwinScale";

interface SeabedProps {
  y: number;
  visible: boolean;
  transparent?: boolean;
}

export function Seabed({ y, visible, transparent = false }: SeabedProps) {
  if (!visible) {
    return null;
  }

  const width = FIELD_WIDTH_KM * HORIZONTAL_SCALE + 0.8;
  const depth = FIELD_HEIGHT_KM * HORIZONTAL_SCALE + 0.8;

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, y, 0]}>
        <planeGeometry args={[width, depth, 18, 18]} />
        <meshStandardMaterial
          color="#142033"
          roughness={0.94}
          metalness={0.02}
          transparent={transparent}
          opacity={transparent ? 0.48 : 1}
          depthWrite={!transparent}
        />
      </mesh>
      <gridHelper
        args={[Math.max(width, depth), 10, "#2f5269", "#1f3348"]}
        position={[0, y + 0.02, 0]}
      />
      <Text
        position={[-width / 2 + 1.3, y + 0.08, -depth / 2 + 0.6]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.24}
        color="#cbd5e1"
        anchorX="left"
        anchorY="middle"
      >
        Leito marinho
      </Text>
    </group>
  );
}
