import type { ThreeEvent } from "@react-three/fiber";
import type { DigitalTwinAsset } from "../../types/digitalTwin";
import { AssetLabel } from "./AssetLabel";

interface FPSOModelProps {
  asset: DigitalTwinAsset;
  position: [number, number, number];
  selected: boolean;
  showLabel: boolean;
  onSelect: (asset: DigitalTwinAsset) => void;
}

export function FPSOModel({
  asset,
  position,
  selected,
  showLabel,
  onSelect,
}: FPSOModelProps) {
  function handleClick(event: ThreeEvent<MouseEvent>) {
    event.stopPropagation();
    onSelect(asset);
  }

  const emissive = selected ? "#155e75" : "#082f49";

  return (
    <group position={position} onClick={handleClick} userData={{ id: asset.id }}>
      <mesh position={[0, 0.18, 0]}>
        <boxGeometry args={[1.8, 0.28, 0.48]} />
        <meshStandardMaterial color="#0284c7" emissive={emissive} metalness={0.35} roughness={0.35} />
      </mesh>
      <mesh position={[-0.18, 0.42, 0]}>
        <boxGeometry args={[0.9, 0.18, 0.42]} />
        <meshStandardMaterial color="#38bdf8" emissive={emissive} roughness={0.4} />
      </mesh>
      <mesh position={[0.46, 0.62, 0.02]}>
        <boxGeometry args={[0.34, 0.34, 0.32]} />
        <meshStandardMaterial color="#e0f2fe" emissive={selected ? "#0891b2" : "#0f172a"} roughness={0.25} />
      </mesh>
      <mesh position={[0.84, 0.24, 0]} rotation={[0, 0, Math.PI / 2]}>
        <coneGeometry args={[0.24, 0.42, 4]} />
        <meshStandardMaterial color="#0369a1" emissive={emissive} />
      </mesh>
      {selected ? (
        <mesh position={[0, 0.18, 0]}>
          <boxGeometry args={[2.05, 0.38, 0.65]} />
          <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.65} />
        </mesh>
      ) : null}
      {showLabel ? (
        <AssetLabel text={asset.id} position={[0, 1.02, 0]} />
      ) : null}
    </group>
  );
}

