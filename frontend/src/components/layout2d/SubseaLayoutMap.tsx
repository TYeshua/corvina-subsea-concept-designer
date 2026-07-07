import { useEffect, useMemo, useRef, useState } from "react";
import { Maximize2, Minimize2, Minus, Plus } from "lucide-react";
import type { LayoutAsset, LayoutConnection, LayoutData } from "../../types/layout";
import {
  getAssetX,
  getAssetY,
  normalizeAssetType,
  normalizeConnectionType,
  scaleX,
  scaleY,
} from "../../utils/layoutScale";
import { CurrentArrow } from "./CurrentArrow";
import { LayoutAssetNode } from "./LayoutAssetNode";
import { LayoutConnectionLine } from "./LayoutConnectionLine";
import { LayoutControls, type LayerState } from "./LayoutControls";
import { LayoutInfoPanel } from "./LayoutInfoPanel";
import { LayoutLegend } from "./LayoutLegend";
import { NorthArrow } from "./NorthArrow";
import { ScaleBar } from "./ScaleBar";

interface SubseaLayoutMapProps {
  layout: LayoutData;
}

interface Point {
  x: number;
  y: number;
}

const initialLayers: LayerState = {
  production: true,
  waterInjection: true,
  gasInjection: true,
  risers: true,
  umbilicals: true,
  sdus: true,
  grid: true,
  labels: true,
};

const viewBoxWidth = 1000;
const viewBoxHeight = 760;
const mapX = 80;
const mapY = 58;
const mapWidth = 840;
const mapHeight = 610;
const displayHeightKm = 10.5;

const markerStyles = [
  ["arrow-production-flowline", "#34d399"],
  ["arrow-water-injection-flowline", "#60a5fa"],
  ["arrow-gas-injection-flowline", "#a78bfa"],
  ["arrow-riser", "#22d3ee"],
  ["arrow-umbilical", "#facc15"],
  ["arrow-control-link", "#fde68a"],
  ["arrow-jumper", "#e2e8f0"],
  ["arrow-unknown", "#94a3b8"],
  ["arrow-current", "#38bdf8"],
];

function connectionId(connection: LayoutConnection, index: number): string {
  return `${connection.from}->${connection.to}:${connection.type}:${index}`;
}

function assetIsVisible(asset: LayoutAsset, layers: LayerState): boolean {
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
  connection: LayoutConnection,
  layers: LayerState,
  visibleAssetIds: Set<string>,
): boolean {
  const type = normalizeConnectionType(connection.type);

  if (!visibleAssetIds.has(connection.from) || !visibleAssetIds.has(connection.to)) {
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

function svgPointForAsset(asset: LayoutAsset, fieldWidthKm: number): Point {
  return {
    x: mapX + scaleX(getAssetX(asset), mapWidth, fieldWidthKm),
    y: mapY + scaleY(getAssetY(asset), mapHeight, displayHeightKm),
  };
}

function resolveFlowPoints(
  connection: LayoutConnection,
  positions: Record<string, Point>,
): { from?: Point; to?: Point } {
  const defaultFrom = positions[connection.from];
  const defaultTo = positions[connection.to];
  const reverseDirection = `${connection.to} para ${connection.from}`;

  if (connection.flow_direction.includes(reverseDirection)) {
    return { from: defaultTo, to: defaultFrom };
  }

  return { from: defaultFrom, to: defaultTo };
}

export function SubseaLayoutMap({ layout }: SubseaLayoutMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [layers, setLayers] = useState<LayerState>(initialLayers);
  const [selectedAsset, setSelectedAsset] = useState<LayoutAsset | null>(null);
  const [selectedConnection, setSelectedConnection] =
    useState<LayoutConnection | null>(null);
  const [selectedConnectionId, setSelectedConnectionId] = useState<string | null>(
    null,
  );
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const fieldWidthKm = layout.metadata.field_width_km;
  const fieldHeightKm = layout.metadata.field_height_km;
  const fieldTop = mapY + scaleY(fieldHeightKm, mapHeight, displayHeightKm);
  const fieldBottom = mapY + scaleY(0, mapHeight, displayHeightKm);
  const fieldHeightPx = fieldBottom - fieldTop;
  const pixelsPerKm = mapWidth / fieldWidthKm;

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

  const assetPositions = useMemo(() => {
    return layout.assets.reduce<Record<string, Point>>((positions, asset) => {
      positions[asset.id] = svgPointForAsset(asset, fieldWidthKm);
      return positions;
    }, {});
  }, [fieldWidthKm, layout.assets]);

  const visibleAssets = useMemo(
    () => layout.assets.filter((asset) => assetIsVisible(asset, layers)),
    [layers, layout.assets],
  );

  const visibleAssetIds = useMemo(
    () => new Set(visibleAssets.map((asset) => asset.id)),
    [visibleAssets],
  );

  const visibleConnections = useMemo(
    () =>
      layout.connections
        .map((connection, index) => ({
          connection,
          id: connectionId(connection, index),
          originalIndex: index,
        }))
        .filter(({ connection }) =>
          connectionIsVisible(connection, layers, visibleAssetIds),
        ),
    [layers, layout.connections, visibleAssetIds],
  );

  function toggleLayer(key: keyof LayerState) {
    setLayers((current) => ({ ...current, [key]: !current[key] }));
  }

  function clearSelection() {
    setSelectedAsset(null);
    setSelectedConnection(null);
    setSelectedConnectionId(null);
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

  function exportSvg() {
    if (!svgRef.current) {
      return;
    }

    const clone = svgRef.current.cloneNode(true) as SVGSVGElement;
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    clone.setAttribute("width", "1600");
    clone.setAttribute("height", "1216");
    clone.setAttribute("style", "background:#020617;font-family:Inter,Arial,sans-serif");
    clone.querySelector("[data-layout-zoom-group]")?.setAttribute("transform", "");

    const style = document.createElementNS("http://www.w3.org/2000/svg", "style");
    style.textContent = `
      svg { background: #020617; }
      text { font-family: Inter, Arial, sans-serif; }
      [role="button"] { cursor: default; }
    `;
    clone.insertBefore(style, clone.firstChild);

    const source = new XMLSerializer().serializeToString(clone);
    const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "layout-campo-corvina.svg";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  const centerX = viewBoxWidth / 2;
  const centerY = viewBoxHeight / 2;

  return (
    <div
      ref={containerRef}
      className={[
        "grid gap-4 bg-slate-950 text-slate-100 xl:grid-cols-[minmax(0,1fr)_22rem]",
        isFullscreen ? "fixed inset-0 z-50 h-screen overflow-auto p-4" : "",
      ].join(" ")}
    >
      <section className="overflow-hidden rounded-lg border border-cyan-500/20 bg-slate-900/80 shadow-panel">
        <div className="flex flex-col gap-3 border-b border-cyan-500/20 px-4 py-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Campo Corvina — Layout Submarino Conceitual
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Coordenadas em quilômetros, desenho esquemático para apoio à decisão.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setZoom((value) => Math.max(0.85, value - 0.1))}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 text-slate-300 transition hover:border-cyan-500/40 hover:text-cyan-200"
              title="Reduzir zoom"
            >
              <Minus className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setZoom(1)}
              className="min-h-9 rounded-lg border border-slate-700 px-3 text-xs font-medium text-slate-300 transition hover:border-cyan-500/40 hover:text-cyan-200"
            >
              {Math.round(zoom * 100)}%
            </button>
            <button
              type="button"
              onClick={() => setZoom((value) => Math.min(1.25, value + 0.1))}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 text-slate-300 transition hover:border-cyan-500/40 hover:text-cyan-200"
              title="Aumentar zoom"
            >
              <Plus className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={toggleFullscreen}
              className="inline-flex min-h-9 items-center justify-center gap-2 rounded-lg border border-slate-700 px-3 text-xs font-medium text-slate-300 transition hover:border-cyan-500/40 hover:text-cyan-200"
              title={isFullscreen ? "Sair da tela cheia" : "Visualizar em tela cheia"}
            >
              {isFullscreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
              {isFullscreen ? "Sair" : "Tela cheia"}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto bg-slate-950/70">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
            className={
              isFullscreen
                ? "h-[calc(100vh-8rem)] w-full min-w-0"
                : "min-w-[920px]"
            }
            role="img"
            aria-label="Layout 2D em planta do Campo Corvina"
            preserveAspectRatio="xMidYMid meet"
            onClick={clearSelection}
          >
            <defs>
              <filter id="selectedGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {markerStyles.map(([id, color]) => (
                <marker
                  key={id}
                  id={id}
                  markerWidth="10"
                  markerHeight="10"
                  refX="8"
                  refY="3"
                  orient="auto"
                  markerUnits="strokeWidth"
                >
                  <path d="M 0 0 L 8 3 L 0 6 Z" fill={color} />
                </marker>
              ))}

              <linearGradient id="fieldGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#0f172a" />
                <stop offset="100%" stopColor="#020617" />
              </linearGradient>
            </defs>

            <rect width={viewBoxWidth} height={viewBoxHeight} fill="#020617" />
            <rect
              x={mapX - 28}
              y={mapY - 28}
              width={mapWidth + 56}
              height={mapHeight + 56}
              rx={14}
              fill="#07111f"
              stroke="#164e63"
              strokeOpacity={0.45}
            />

            <g
              data-layout-zoom-group="true"
              transform={`translate(${centerX} ${centerY}) scale(${zoom}) translate(${-centerX} ${-centerY})`}
            >
              <rect
                x={mapX}
                y={fieldTop}
                width={mapWidth}
                height={fieldHeightPx}
                fill="url(#fieldGradient)"
                stroke="#22d3ee"
                strokeOpacity={0.45}
                strokeWidth={2}
              />

              {layers.grid ? (
                <g opacity={0.52}>
                  {Array.from({ length: fieldWidthKm + 1 }, (_, index) => {
                    const x = mapX + scaleX(index, mapWidth, fieldWidthKm);

                    return (
                      <g key={`x-${index}`}>
                        <line
                          x1={x}
                          y1={fieldTop}
                          x2={x}
                          y2={fieldBottom}
                          stroke="#334155"
                          strokeWidth={1}
                        />
                        <text
                          x={x}
                          y={fieldBottom + 22}
                          textAnchor="middle"
                          fill="#64748b"
                          fontSize={11}
                        >
                          {index}
                        </text>
                      </g>
                    );
                  })}

                  {Array.from({ length: fieldHeightKm + 1 }, (_, index) => {
                    const y = mapY + scaleY(index, mapHeight, displayHeightKm);

                    return (
                      <g key={`y-${index}`}>
                        <line
                          x1={mapX}
                          y1={y}
                          x2={mapX + mapWidth}
                          y2={y}
                          stroke="#334155"
                          strokeWidth={1}
                        />
                        <text
                          x={mapX - 16}
                          y={y + 4}
                          textAnchor="end"
                          fill="#64748b"
                          fontSize={11}
                        >
                          {index}
                        </text>
                      </g>
                    );
                  })}
                </g>
              ) : null}

              <text
                x={mapX}
                y={mapY - 10}
                fill="#cffafe"
                fontSize={16}
                fontWeight={700}
              >
                Campo Corvina — Layout Submarino Conceitual
              </text>
              <text
                x={mapX + mapWidth}
                y={fieldBottom + 22}
                textAnchor="end"
                fill="#64748b"
                fontSize={11}
              >
                Eixo Leste-Oeste (km)
              </text>

              {visibleConnections.map(({ connection, id, originalIndex }) => {
                const { from, to } = resolveFlowPoints(connection, assetPositions);

                if (!from || !to) {
                  return null;
                }

                const type = normalizeConnectionType(connection.type);

                return (
                  <LayoutConnectionLine
                    key={id}
                    id={id}
                    connection={connection}
                    type={type}
                    from={from}
                    to={to}
                    selected={selectedConnectionId === id}
                    index={originalIndex}
                    onSelect={(selected, selectedId) => {
                      setSelectedConnection(selected);
                      setSelectedConnectionId(selectedId);
                      setSelectedAsset(null);
                    }}
                  />
                );
              })}

              {visibleAssets.map((asset) => {
                const position = assetPositions[asset.id];
                const type = normalizeAssetType(asset.type);

                return (
                  <LayoutAssetNode
                    key={asset.id}
                    asset={asset}
                    type={type}
                    x={position.x}
                    y={position.y}
                    selected={selectedAsset?.id === asset.id}
                    showLabel={layers.labels}
                    onSelect={(selected) => {
                      setSelectedAsset(selected);
                      setSelectedConnection(null);
                      setSelectedConnectionId(null);
                    }}
                  />
                );
              })}

              <ScaleBar
                x={mapX + 20}
                y={fieldBottom - 28}
                pixelsPerKm={pixelsPerKm}
                lengthKm={2}
              />
              <NorthArrow x={mapX + mapWidth - 38} y={fieldTop + 48} />
              <CurrentArrow
                x={mapX + mapWidth - 178}
                y={fieldTop + 104}
                velocity={layout.metadata.current_design_velocity_m_s}
              />
            </g>
          </svg>
        </div>
      </section>

      <aside className="space-y-4">
        <LayoutControls
          layers={layers}
          onToggle={toggleLayer}
          onReset={() => setLayers(initialLayers)}
          onExport={exportSvg}
        />
        <LayoutInfoPanel
          layout={layout}
          selectedAsset={selectedAsset}
          selectedConnection={selectedConnection}
        />
        <LayoutLegend />
      </aside>
    </div>
  );
}
