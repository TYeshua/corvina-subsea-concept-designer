import type { ThreeEvent } from "@react-three/fiber";
import type { DigitalTwinAsset, DigitalTwinAssetType } from "../../types/digitalTwin";
import { getAssetColor } from "../../utils/digitalTwinScale";
import { AssetLabel } from "./AssetLabel";

interface ManifoldModelProps {
  asset: DigitalTwinAsset;
  type: DigitalTwinAssetType;
  position: [number, number, number];
  selected: boolean;
  showLabel: boolean;
  onSelect: (asset: DigitalTwinAsset) => void;
}

export function ManifoldModel({
  asset,
  type,
  position,
  selected,
  showLabel,
  onSelect,
}: ManifoldModelProps) {
  const color = getAssetColor(type);

  function handleClick(event: ThreeEvent<MouseEvent>) {
    event.stopPropagation();
    onSelect(asset);
  }

  return (
    <group position={position} onClick={handleClick} userData={{ id: asset.id }}>
      <mesh position={[0, 0.18, 0]}>
        <boxGeometry args={[0.62, 0.28, 0.42]} />
        <meshStandardMaterial color={color} emissive={selected ? color : "#020617"} roughness={0.38} />
      </mesh>
      <mesh position={[0, 0.22, -0.28]} rotation={[Math.PI / 2, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.06, 0.06, 0.72, 12]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.32} />
      </mesh>
      <mesh position={[0, 0.22, 0.28]} rotation={[Math.PI / 2, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.06, 0.06, 0.72, 12]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.32} />
      </mesh>
      {selected ? (
        <mesh position={[0, 0.18, 0]}>
          <boxGeometry args={[0.82, 0.43, 0.62]} />
          <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.7} />
        </mesh>
      ) : null}
      {showLabel ? <AssetLabel text={asset.id} position={[0, 0.74, 0]} /> : null}
    </group>
  );
}

