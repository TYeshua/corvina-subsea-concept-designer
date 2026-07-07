import type { ThreeEvent } from "@react-three/fiber";
import type { DigitalTwinAsset } from "../../types/digitalTwin";
import { AssetLabel } from "./AssetLabel";

interface SDUModelProps {
  asset: DigitalTwinAsset;
  position: [number, number, number];
  selected: boolean;
  showLabel: boolean;
  onSelect: (asset: DigitalTwinAsset) => void;
}

export function SDUModel({
  asset,
  position,
  selected,
  showLabel,
  onSelect,
}: SDUModelProps) {
  function handleClick(event: ThreeEvent<MouseEvent>) {
    event.stopPropagation();
    onSelect(asset);
  }

  return (
    <group position={position} onClick={handleClick} userData={{ id: asset.id }}>
      <mesh position={[0, 0.14, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.24, 6]} />
        <meshStandardMaterial color="#facc15" emissive={selected ? "#ca8a04" : "#020617"} roughness={0.36} />
      </mesh>
      {selected ? (
        <mesh position={[0, 0.14, 0]}>
          <sphereGeometry args={[0.34, 16, 16]} />
          <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.65} />
        </mesh>
      ) : null}
      {showLabel ? <AssetLabel text={asset.id} position={[0, 0.65, 0]} /> : null}
    </group>
  );
}

