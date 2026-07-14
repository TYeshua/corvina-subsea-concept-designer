import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import type { WebGLRenderer } from "three";
import type {
  DigitalTwinAsset,
  DigitalTwinConnection,
  DigitalTwinData,
  DigitalTwinSelectedItem,
} from "../../types/digitalTwin";
import {
  getAssetMap,
  getConnectionId,
  normalizeAssetType,
  normalizeConnectionType,
  resolveFlowAssetIds,
  scaleDigitalTwinPosition,
  scaleSeabedY,
} from "../../utils/digitalTwinScale";
import {
  getDigitalTwinCameraConfig,
  type DigitalTwinViewMode,
} from "../../utils/digitalTwinCamera";
import { CameraRig } from "./CameraRig";
import { CurrentVector } from "./CurrentVector";
import {
  DigitalTwinControls,
  type DigitalTwinLayerState,
} from "./DigitalTwinControls";
import { DigitalTwinInfoPanel } from "./DigitalTwinInfoPanel";
import { DigitalTwinLegend } from "./DigitalTwinLegend";
import { DigitalTwinTechnicalPanel } from "./DigitalTwinTechnicalPanel";
import { FlowlineModel } from "./FlowlineModel";
import { FPSOModel } from "./FPSOModel";
import { ManifoldModel } from "./ManifoldModel";
import { ReservoirLayer } from "./ReservoirLayer";
import { RiserModel } from "./RiserModel";
import { SDUModel } from "./SDUModel";
import { Seabed } from "./Seabed";
import { SeaSurface } from "./SeaSurface";
import { UmbilicalModel } from "./UmbilicalModel";
import { WellModel } from "./WellModel";
import { WellboreModel } from "./WellboreModel";

interface DigitalTwinSceneProps {
  twin: DigitalTwinData;
}

interface ConnectionRenderData {
  id: string;
  connection: DigitalTwinConnection;
  from: [number, number, number];
  to: [number, number, number];
}

const initialLayers: DigitalTwinLayerState = {
  production: true,
  waterInjection: true,
  gasInjection: true,
  risers: true,
  umbilicals: true,
  sdus: true,
  reservoir: true,
  wellbores: true,
  labels: true,
  seaSurface: true,
  seabed: true,
  current: true,
};

function layersForViewMode(mode: DigitalTwinViewMode): DigitalTwinLayerState {
  const allLayers: DigitalTwinLayerState = { ...initialLayers };

  if (mode === "overview" || mode === "top" || mode === "verticalSection") {
    return allLayers;
  }

  if (mode === "production") {
    return {
      ...allLayers,
      waterInjection: false,
      gasInjection: false,
      reservoir: false,
      wellbores: false,
      current: false,
    };
  }

  if (mode === "waterInjection") {
    return {
      ...allLayers,
      production: false,
      gasInjection: false,
      reservoir: false,
      wellbores: false,
      current: false,
    };
  }

  if (mode === "gasInjection") {
    return {
      ...allLayers,
      production: false,
      waterInjection: false,
      reservoir: false,
      wellbores: false,
      current: false,
    };
  }

  if (mode === "risers") {
    return {
      ...allLayers,
      production: false,
      waterInjection: false,
      gasInjection: false,
      umbilicals: false,
      sdus: false,
      reservoir: false,
      wellbores: false,
      current: false,
    };
  }

  if (mode === "umbilicals") {
    return {
      ...allLayers,
      production: false,
      waterInjection: false,
      gasInjection: false,
      risers: false,
      reservoir: false,
      wellbores: false,
      current: false,
    };
  }

  if (mode === "wellbores") {
    return {
      ...allLayers,
      risers: false,
      umbilicals: false,
      sdus: false,
      current: false,
    };
  }

  return {
    ...allLayers,
    risers: false,
    umbilicals: false,
    sdus: false,
    current: false,
  };
}

function assetIsVisible(
  asset: DigitalTwinAsset,
  layers: DigitalTwinLayerState,
): boolean {
  const type = normalizeAssetType(asset.type);

  if (type === "fpso") {
    return true;
  }

  if (
    !layers.production &&
    (type === "producer_well" || type === "production_manifold")
  ) {
    return false;
  }

  if (
    !layers.waterInjection &&
    (type === "water_injector_well" || type === "water_injection_manifold")
  ) {
    return false;
  }

  if (!layers.gasInjection && (type === "gas_injector_well" || type === "gas_plet")) {
    return false;
  }

  if (!layers.sdus && type === "sdu") {
    return false;
  }

  return true;
}

function connectionIsVisible(
  connection: DigitalTwinConnection,
  layers: DigitalTwinLayerState,
  visibleAssets: Set<string>,
): boolean {
  const type = normalizeConnectionType(connection.type);

  if (!visibleAssets.has(connection.from) || !visibleAssets.has(connection.to)) {
    return false;
  }

  if (!layers.production && (type === "production_flowline" || type === "jumper")) {
    return false;
  }

  if (!layers.waterInjection && type === "water_injection_flowline") {
    return false;
  }

  if (!layers.gasInjection && type === "gas_injection_flowline") {
    return false;
  }

  if (!layers.risers && type === "riser") {
    return false;
  }

  if (!layers.umbilicals && (type === "umbilical" || type === "control_link")) {
    return false;
  }

  return true;
}

function scaledAssetPosition(asset: DigitalTwinAsset): [number, number, number] {
  return scaleDigitalTwinPosition(asset.position);
}

function connectionPoint(
  asset: DigitalTwinAsset,
  connectionType: string,
): [number, number, number] {
  const [x, y, z] = scaledAssetPosition(asset);
  const assetType = normalizeAssetType(asset.type);
  const normalizedConnectionType = normalizeConnectionType(connectionType);

  if (assetType === "fpso") {
    return [x, y + 0.24, z];
  }

  if (
    normalizedConnectionType === "umbilical" ||
    normalizedConnectionType === "control_link"
  ) {
    return [x, y + 0.46, z];
  }

  if (normalizedConnectionType === "riser") {
    return [x, y + 0.26, z];
  }

  return [x, y + 0.18, z];
}

function buildConnectionRenderData(
  twin: DigitalTwinData,
  visibleConnections: Array<{ connection: DigitalTwinConnection; id: string }>,
): ConnectionRenderData[] {
  const assetMap = getAssetMap(twin.assets);

  return visibleConnections.flatMap(({ connection, id }) => {
    const flow = resolveFlowAssetIds(connection);
    const fromAsset = assetMap[flow.from];
    const toAsset = assetMap[flow.to];

    if (!fromAsset || !toAsset) {
      return [];
    }

    return [
      {
        id,
        connection,
        from: connectionPoint(fromAsset, connection.type),
        to: connectionPoint(toAsset, connection.type),
      },
    ];
  });
}

export function DigitalTwinScene({ twin }: DigitalTwinSceneProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<WebGLRenderer | null>(null);
  const [layers, setLayers] = useState<DigitalTwinLayerState>(initialLayers);
  const [selectedItem, setSelectedItem] = useState<DigitalTwinSelectedItem>(null);
  const [captureStatus, setCaptureStatus] = useState<string>("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewMode, setViewMode] = useState<DigitalTwinViewMode>("overview");

  const visibleAssets = useMemo(
    () => twin.assets.filter((asset) => assetIsVisible(asset, layers)),
    [layers, twin.assets],
  );
  const visibleAssetIds = useMemo(
    () => new Set(visibleAssets.map((asset) => asset.id)),
    [visibleAssets],
  );
  const visibleConnections = useMemo(
    () =>
      twin.connections
        .map((connection, index) => ({
          connection,
          id: getConnectionId(connection, index),
        }))
        .filter(({ connection }) =>
          connectionIsVisible(connection, layers, visibleAssetIds),
        ),
    [layers, twin.connections, visibleAssetIds],
  );
  const connectionRenderData = useMemo(
    () => buildConnectionRenderData(twin, visibleConnections),
    [twin, visibleConnections],
  );
  const cameraTarget = useMemo(
    () => getDigitalTwinCameraConfig(viewMode).target,
    [viewMode],
  );

  const seabedY = scaleSeabedY(twin.metadata.seabed_y);

  useEffect(() => {
    function handleFullscreenChange() {
      setIsFullscreen(document.fullscreenElement === containerRef.current);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (
        event.key === "Escape" &&
        isFullscreen &&
        document.fullscreenElement !== containerRef.current
      ) {
        setIsFullscreen(false);
      }
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFullscreen]);

  function toggleLayer(key: keyof DigitalTwinLayerState) {
    setLayers((current) => ({ ...current, [key]: !current[key] }));
  }

  function changeViewMode(mode: DigitalTwinViewMode) {
    setViewMode(mode);
    setLayers(layersForViewMode(mode));
    setSelectedItem(null);
  }

  function captureScene() {
    const renderer = rendererRef.current;

    if (!renderer) {
      setCaptureStatus("Captura de imagem preparada para integração.");
      return;
    }

    const dataUrl = renderer.domElement.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "gemeo-digital-campo-corvina.png";
    document.body.appendChild(link);
    link.click();
    link.remove();
    setCaptureStatus("Imagem da cena 3D capturada.");
    window.setTimeout(() => setCaptureStatus(""), 2600);
  }

  async function toggleFullscreen() {
    if (!containerRef.current) {
      return;
    }

    if (isFullscreen) {
      if (document.fullscreenElement === containerRef.current) {
        await document.exitFullscreen();
      }
      setIsFullscreen(false);
      return;
    }

    try {
      await containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } catch {
      setIsFullscreen(true);
    }
  }

  return (
    <div
      ref={containerRef}
      className={[
        "grid gap-4 bg-slate-950 text-slate-100 xl:grid-cols-[minmax(0,1fr)_22rem]",
        isFullscreen ? "fixed inset-0 z-50 h-screen overflow-auto p-4" : "",
      ].join(" ")}
    >
      <section
        className={[
          "overflow-hidden border border-cyan-500/20 bg-slate-950 shadow-panel",
          isFullscreen
            ? "h-[calc(100vh-2rem)]"
            : "h-[560px] md:h-[640px] xl:h-[720px]",
        ].join(" ")}
        data-testid="digital-twin-scene-shell"
      >
        <Canvas
          camera={{ position: [8, 6.4, 12], fov: 50 }}
          dpr={[1, 2]}
          gl={{ antialias: true, preserveDrawingBuffer: true }}
          shadows
          onCreated={({ gl }) => {
            rendererRef.current = gl;
          }}
          onPointerMissed={() => setSelectedItem(null)}
        >
          <color attach="background" args={["#020617"]} />
          <fog attach="fog" args={["#020617", 13, 28]} />
          <ambientLight intensity={0.48} />
          <hemisphereLight args={["#67e8f9", "#020617", 0.42]} />
          <directionalLight
            position={[8, 10, 6]}
            intensity={1.35}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          <pointLight position={[-5, 2, -4]} intensity={0.95} color="#38bdf8" />
          <pointLight position={[4, -2, 5]} intensity={0.55} color="#34d399" />
          <CameraRig viewMode={viewMode} />
          <OrbitControls
            enablePan
            enableZoom
            enableRotate
            makeDefault
            maxDistance={26}
            minDistance={3.4}
            target={cameraTarget}
          />

          <SeaSurface visible={layers.seaSurface} />
          <Seabed
            y={seabedY}
            visible={layers.seabed}
            transparent={layers.reservoir || layers.wellbores}
          />
          <ReservoirLayer
            reservoirY={twin.metadata.reservoir_y}
            label={twin.metadata.reservoir_label}
            visible={layers.reservoir}
          />
          <CurrentVector
            visible={layers.current}
            velocity={twin.metadata.water_depth_m > 0 ? 2.3 : 0}
          />

          {layers.wellbores
            ? twin.wellbores?.map((wellbore) => (
                <WellboreModel
                  key={wellbore.id}
                  wellbore={wellbore}
                  showLabel={layers.labels}
                />
              ))
            : null}

          {connectionRenderData.map(({ id, connection, from, to }) => {
            const type = normalizeConnectionType(connection.type);
            const selected =
              selectedItem?.kind === "connection" && selectedItem.id === id;

            if (type === "riser") {
              return (
                <RiserModel
                  key={id}
                  id={id}
                  connection={connection}
                  from={from}
                  to={to}
                  selected={selected}
                  onSelect={(selectedConnection, selectedId) =>
                    setSelectedItem({
                      kind: "connection",
                      connection: selectedConnection,
                      id: selectedId,
                    })
                  }
                />
              );
            }

            if (type === "umbilical" || type === "control_link") {
              return (
                <UmbilicalModel
                  key={id}
                  id={id}
                  connection={connection}
                  from={from}
                  to={to}
                  selected={selected}
                  onSelect={(selectedConnection, selectedId) =>
                    setSelectedItem({
                      kind: "connection",
                      connection: selectedConnection,
                      id: selectedId,
                    })
                  }
                />
              );
            }

            return (
              <FlowlineModel
                key={id}
                id={id}
                connection={connection}
                type={type}
                from={from}
                to={to}
                selected={selected}
                onSelect={(selectedConnection, selectedId) =>
                  setSelectedItem({
                    kind: "connection",
                    connection: selectedConnection,
                    id: selectedId,
                  })
                }
              />
            );
          })}

          {visibleAssets.map((asset) => {
            const type = normalizeAssetType(asset.type);
            const position = scaledAssetPosition(asset);
            const selected =
              selectedItem?.kind === "asset" && selectedItem.asset.id === asset.id;
            const selectAsset = (selectedAsset: DigitalTwinAsset) =>
              setSelectedItem({ kind: "asset", asset: selectedAsset });

            if (type === "fpso") {
              return (
                <FPSOModel
                  key={asset.id}
                  asset={asset}
                  position={position}
                  selected={selected}
                  showLabel={layers.labels}
                  onSelect={selectAsset}
                />
              );
            }

            if (
              type === "producer_well" ||
              type === "water_injector_well" ||
              type === "gas_injector_well"
            ) {
              return (
                <WellModel
                  key={asset.id}
                  asset={asset}
                  type={type}
                  position={position}
                  selected={selected}
                  showLabel={layers.labels}
                  onSelect={selectAsset}
                />
              );
            }

            if (
              type === "production_manifold" ||
              type === "water_injection_manifold" ||
              type === "gas_plet"
            ) {
              return (
                <ManifoldModel
                  key={asset.id}
                  asset={asset}
                  type={type}
                  position={position}
                  selected={selected}
                  showLabel={layers.labels}
                  onSelect={selectAsset}
                />
              );
            }

            return (
              <SDUModel
                key={asset.id}
                asset={asset}
                position={position}
                selected={selected}
                showLabel={layers.labels}
                onSelect={selectAsset}
              />
            );
          })}
        </Canvas>
      </section>

      <aside className={isFullscreen ? "max-h-[calc(100vh-2rem)] space-y-4 overflow-y-auto" : "space-y-4"}>
        <DigitalTwinControls
          layers={layers}
          viewMode={viewMode}
          onToggle={toggleLayer}
          onViewModeChange={changeViewMode}
          onReset={() => {
            setViewMode("overview");
            setLayers(initialLayers);
          }}
          onCapture={captureScene}
          onToggleFullscreen={toggleFullscreen}
          isFullscreen={isFullscreen}
          captureStatus={captureStatus}
        />
        <DigitalTwinInfoPanel twin={twin} selectedItem={selectedItem} />
        <DigitalTwinTechnicalPanel twin={twin} />
        <DigitalTwinLegend />
      </aside>
    </div>
  );
}
