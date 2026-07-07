import { Line } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import { useMemo } from "react";
import { Quaternion, Vector3 } from "three";
import type { DigitalTwinConnection } from "../../types/digitalTwin";

interface UmbilicalModelProps {
  id: string;
  connection: DigitalTwinConnection;
  from: [number, number, number];
  to: [number, number, number];
  selected: boolean;
  onSelect: (connection: DigitalTwinConnection, id: string) => void;
}

export function UmbilicalModel({
  id,
  connection,
  from,
  to,
  selected,
  onSelect,
}: UmbilicalModelProps) {
  const color = selected ? "#ffffff" : "#facc15";
  const points = useMemo(() => {
    const start = new Vector3(...from);
    const end = new Vector3(...to);
    const mid = start.clone().lerp(end, 0.5);
    mid.y += 0.34;

    return [start, mid, end];
  }, [from, to]);
  const arrow = useMemo(() => {
    const start = points[1];
    const end = points[2];
    const direction = end.clone().sub(start).normalize();
    const quaternion = new Quaternion().setFromUnitVectors(
      new Vector3(0, 1, 0),
      direction,
    );

    return { position: start.clone().lerp(end, 0.42), quaternion };
  }, [points]);

  function handleClick(event: ThreeEvent<MouseEvent>) {
    event.stopPropagation();
    onSelect(connection, id);
  }

  return (
    <group onClick={handleClick} userData={{ id }}>
      <Line
        points={points}
        color={color}
        lineWidth={selected ? 3.6 : 2.1}
        dashed
        dashSize={0.18}
        gapSize={0.12}
        transparent
        opacity={selected ? 1 : 0.82}
      />
      <mesh position={arrow.position} quaternion={arrow.quaternion}>
        <coneGeometry args={[0.07, 0.24, 14]} />
        <meshStandardMaterial color={color} emissive={selected ? "#facc15" : "#020617"} />
      </mesh>
      <mesh position={arrow.position} onClick={handleClick}>
        <sphereGeometry args={[0.2, 10, 10]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </group>
  );
}

