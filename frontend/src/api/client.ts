import type { CalculationResults } from "../types/calculations";
import type { DigitalTwinData } from "../types/digitalTwin";
import type { EquipmentRecommendation } from "../types/equipment";
import type { LayoutData } from "../types/layout";
import type { Scenario } from "../types/scenario";

export const API_BASE_URL = "http://localhost:8000";

export interface ReportSection {
  title: string;
  text: string;
}

export interface ReportResponse {
  title: string;
  sections: ReportSection[];
  equipment_recommendations_count: number;
  full_text: string;
}

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`);

  if (!response.ok) {
    throw new Error(`Erro ${response.status} ao carregar ${path}`);
  }

  return response.json() as Promise<T>;
}

export function getScenario(): Promise<Scenario> {
  return fetchJson<Scenario>("/api/scenario/corvina");
}

export function getCalculations(): Promise<CalculationResults> {
  return fetchJson<CalculationResults>("/api/calculate");
}

export function getEquipment(): Promise<EquipmentRecommendation[]> {
  return fetchJson<EquipmentRecommendation[]>("/api/equipment");
}

export function getLayout(): Promise<LayoutData> {
  return fetchJson<LayoutData>("/api/layout");
}

export function getDigitalTwin(): Promise<DigitalTwinData> {
  return fetchJson<DigitalTwinData>("/api/digital-twin");
}

export function getReport(): Promise<ReportResponse> {
  return fetchJson<ReportResponse>("/api/report");
}
