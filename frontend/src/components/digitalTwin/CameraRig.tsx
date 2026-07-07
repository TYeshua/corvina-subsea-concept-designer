import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { PerspectiveCamera, Vector3 } from "three";

export function CameraRig() {
  const { camera, size } = useThree();

  useEffect(() => {
    const compactViewport = size.width < 480;
    const perspectiveCamera = camera as PerspectiveCamera;
    const target = new Vector3(0, compactViewport ? -2.75 : -2.6, 2.4);

    perspectiveCamera.fov = compactViewport ? 54 : 46;
    perspectiveCamera.position.set(
      compactViewport ? 8.0 : 6.8,
      compactViewport ? 6.0 : 5.3,
      compactViewport ? 12.4 : 10.4,
    );
    perspectiveCamera.lookAt(target);
    perspectiveCamera.updateProjectionMatrix();
  }, [camera, size.width]);

  return null;
}
