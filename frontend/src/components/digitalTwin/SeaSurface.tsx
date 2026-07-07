import { Text } from "@react-three/drei";
import { FIELD_HEIGHT_KM, FIELD_WIDTH_KM, HORIZONTAL_SCALE } from "../../utils/digitalTwinScale";

interface SeaSurfaceProps {
  visible: boolean;
}

export function SeaSurface({ visible }: SeaSurfaceProps) {
  if (!visible) {
    return null;
  }

  const width = FIELD_WIDTH_KM * HORIZONTAL_SCALE + 2;
  const depth = FIELD_HEIGHT_KM * HORIZONTAL_SCALE + 2;

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[width, depth, 1, 1]} />
        <meshStandardMaterial
          color="#0e7490"
          transparent
          opacity={0.24}
          roughness={0.35}
          metalness={0.08}
        />
      </mesh>
      <gridHelper
        args={[Math.max(width, depth), 12, "#0891b2", "#164e63"]}
        position={[0, 0.015, 0]}
      />
      <Text
        position={[-width / 2 + 1.5, 0.12, -depth / 2 + 0.7]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.24}
        color="#a5f3fc"
        anchorX="left"
        anchorY="middle"
      >
        Superfície do mar
      </Text>
    </group>
  );
}

