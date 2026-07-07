import { Line } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import { useMemo } from "react";
import { CatmullRomCurve3, Quaternion, Vector3 } from "three";
import type { DigitalTwinConnection } from "../../types/digitalTwin";

interface RiserModelProps {
  id: string;
  connection: DigitalTwinConnection;
  from: [number, number, number];
  to: [number, number, number];
  selected: boolean;
  onSelect: (connection: DigitalTwinConnection, id: string) => void;
}

export function RiserModel({
  id,
  connection,
  from,
  to,
  selected,
  onSelect,
}: RiserModelProps) {
  const color = selected ? "#ffffff" : "#22d3ee";
  const curvePoints = useMemo(() => {
    const start = new Vector3(...from);
    const end = new Vector3(...to);
    const midA = start.clone().lerp(end, 0.35);
    const midB = start.clone().lerp(end, 0.68);
    midA.x -= 0.55;
    midA.y += 1.1;
    midB.x += 0.45;
    midB.y -= 0.3;

    return new CatmullRomCurve3([start, midA, midB, end]).getPoints(28);
  }, [from, to]);
  const arrow = useMemo(() => {
    const start = curvePoints[18];
    const end = curvePoints[21];
    const direction = end.clone().sub(start).normalize();
    const quaternion = new Quaternion().setFromUnitVectors(
      new Vector3(0, 1, 0),
      direction,
    );

    return { position: start.clone().lerp(end, 0.5), quaternion };
  }, [curvePoints]);

  function handleClick(event: ThreeEvent<MouseEvent>) {
    event.stopPropagation();
    onSelect(connection, id);
  }

  return (
    <group onClick={handleClick} userData={{ id }}>
      <Line
        points={curvePoints}
        color={color}
        lineWidth={selected ? 5.8 : 4.2}
        transparent
        opacity={selected ? 1 : 0.92}
      />
      <mesh position={arrow.position} quaternion={arrow.quaternion}>
        <coneGeometry args={[0.1, 0.34, 18]} />
        <meshStandardMaterial color={color} emissive={selected ? "#22d3ee" : "#020617"} />
      </mesh>
      <mesh position={arrow.position} onClick={handleClick}>
        <sphereGeometry args={[0.24, 12, 12]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </group>
  );
}

