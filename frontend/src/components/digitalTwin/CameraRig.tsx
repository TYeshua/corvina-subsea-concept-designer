import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { PerspectiveCamera, Vector3 } from "three";
import {
  getDigitalTwinCameraConfig,
  type DigitalTwinViewMode,
} from "../../utils/digitalTwinCamera";

interface CameraRigProps {
  viewMode: DigitalTwinViewMode;
}

export function CameraRig({ viewMode }: CameraRigProps) {
  const { camera, size } = useThree();

  useEffect(() => {
    const compactViewport = size.width < 480;
    const perspectiveCamera = camera as PerspectiveCamera;
    const config = getDigitalTwinCameraConfig(viewMode, compactViewport);
    const target = new Vector3(...config.target);

    perspectiveCamera.fov = config.fov;
    perspectiveCamera.position.set(...config.position);
    perspectiveCamera.lookAt(target);
    perspectiveCamera.updateProjectionMatrix();
  }, [camera, size.width, viewMode]);

  return null;
}
