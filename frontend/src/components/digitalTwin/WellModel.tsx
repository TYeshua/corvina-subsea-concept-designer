import type { ThreeEvent } from "@react-three/fiber";
import type { DigitalTwinAsset, DigitalTwinAssetType } from "../../types/digitalTwin";
import { getAssetColor } from "../../utils/digitalTwinScale";
import { AssetLabel } from "./AssetLabel";

interface WellModelProps {
  asset: DigitalTwinAsset;
  type: DigitalTwinAssetType;
  position: [number, number, number];
  selected: boolean;
  showLabel: boolean;
  onSelect: (asset: DigitalTwinAsset) => void;
}

export function WellModel({
  asset,
  type,
  position,
  selected,
  showLabel,
  onSelect,
}: WellModelProps) {
  const color = getAssetColor(type);

  function handleClick(event: ThreeEvent<MouseEvent>) {
    event.stopPropagation();
    onSelect(asset);
  }

  return (
    <group position={position} onClick={handleClick} userData={{ id: asset.id }}>
      <mesh position={[0, 0.16, 0]}>
        <cylinderGeometry args={[0.13, 0.15, 0.32, 18]} />
        <meshStandardMaterial color={color} emissive={selected ? color : "#020617"} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.43, 0]}>
        <coneGeometry args={[0.16, 0.25, 18]} />
        <meshStandardMaterial color={color} emissive={selected ? color : "#020617"} roughness={0.3} />
      </mesh>
      {selected ? (
        <mesh position={[0, 0.27, 0]}>
          <sphereGeometry args={[0.32, 18, 18]} />
          <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.7} />
        </mesh>
      ) : null}
      {showLabel ? <AssetLabel text={asset.id} position={[0, 0.85, 0]} /> : null}
    </group>
  );
}

