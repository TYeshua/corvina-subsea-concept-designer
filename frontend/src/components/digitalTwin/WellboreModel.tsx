import { Line, Text } from "@react-three/drei";
import { useMemo } from "react";
import { CatmullRomCurve3, Vector3 } from "three";
import type { DigitalTwinWellbore } from "../../types/digitalTwin";
import {
  getAssetColor,
  normalizeAssetType,
  scaleDigitalTwinPosition,
} from "../../utils/digitalTwinScale";

interface WellboreModelProps {
  wellbore: DigitalTwinWellbore;
  showLabel: boolean;
}

function lateralOffset(wellId: string): number {
  const seed = wellId
    .split("")
    .reduce((total, char) => total + char.charCodeAt(0), 0);

  return ((seed % 5) - 2) * 0.18;
}

export function WellboreModel({ wellbore, showLabel }: WellboreModelProps) {
  const type = normalizeAssetType(wellbore.type);
  const color = getAssetColor(type);
  const points = useMemo(() => {
    const from = new Vector3(...scaleDigitalTwinPosition(wellbore.from_position));
    const to = new Vector3(...scaleDigitalTwinPosition(wellbore.to_position));
    const kick = lateralOffset(wellbore.well_id);
    const midA = from.clone().lerp(to, 0.28);
    const midB = from.clone().lerp(to, 0.72);
    midA.x += kick;
    midB.x -= kick * 0.65;
    midB.z += kick * 0.45;

    return new CatmullRomCurve3([from, midA, midB, to]).getPoints(28);
  }, [wellbore]);
  const reservoirEnd = points[points.length - 1];

  return (
    <group userData={{ id: wellbore.id }}>
      <Line
        points={points}
        color={color}
        lineWidth={2.4}
        dashed
        dashSize={0.22}
        gapSize={0.12}
        transparent
        opacity={0.78}
      />
      <mesh position={reservoirEnd}>
        <sphereGeometry args={[0.12, 14, 14]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} />
      </mesh>
      {showLabel ? (
        <Text
          position={[reservoirEnd.x + 0.2, reservoirEnd.y - 0.1, reservoirEnd.z]}
          fontSize={0.18}
          color="#e2e8f0"
          anchorX="left"
          anchorY="middle"
        >
          {wellbore.well_id}
        </Text>
      ) : null}
    </group>
  );
}
