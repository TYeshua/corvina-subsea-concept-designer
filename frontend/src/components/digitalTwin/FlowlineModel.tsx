import { Line } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import { useMemo } from "react";
import { Quaternion, Vector3 } from "three";
import type {
  DigitalTwinConnection,
  DigitalTwinConnectionType,
} from "../../types/digitalTwin";
import { getConnectionColor } from "../../utils/digitalTwinScale";

interface FlowlineModelProps {
  id: string;
  connection: DigitalTwinConnection;
  type: DigitalTwinConnectionType;
  from: [number, number, number];
  to: [number, number, number];
  selected: boolean;
  onSelect: (connection: DigitalTwinConnection, id: string) => void;
}

function midpoint(from: Vector3, to: Vector3): Vector3 {
  return from.clone().lerp(to, 0.55);
}

export function FlowlineModel({
  id,
  connection,
  type,
  from,
  to,
  selected,
  onSelect,
}: FlowlineModelProps) {
  const color = selected ? "#ffffff" : getConnectionColor(type);
  const width = type === "jumper" ? 2 : 3.5;
  const points = useMemo(() => [new Vector3(...from), new Vector3(...to)], [from, to]);
  const arrow = useMemo(() => {
    const start = new Vector3(...from);
    const end = new Vector3(...to);
    const direction = end.clone().sub(start).normalize();
    const quaternion = new Quaternion().setFromUnitVectors(
      new Vector3(0, 1, 0),
      direction,
    );

    return { position: midpoint(start, end), quaternion };
  }, [from, to]);

  function handleClick(event: ThreeEvent<MouseEvent>) {
    event.stopPropagation();
    onSelect(connection, id);
  }

  return (
    <group onClick={handleClick} userData={{ id }}>
      <Line
        points={points}
        color={color}
        lineWidth={selected ? width + 1.5 : width}
        transparent
        opacity={selected ? 1 : 0.86}
      />
      <mesh position={arrow.position} quaternion={arrow.quaternion}>
        <coneGeometry args={[0.08, 0.28, 16]} />
        <meshStandardMaterial color={color} emissive={selected ? color : "#020617"} />
      </mesh>
      <mesh position={arrow.position} onClick={handleClick}>
        <sphereGeometry args={[0.18, 10, 10]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </group>
  );
}

