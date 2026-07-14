export interface EquipmentRecommendation {
  id: string;
  category: string;
  name: string;
  quantity: number;
  type: string;
  installation_location: string;
  position_reference: string;
  function: string;
  connected_to: string[];
  technical_justification: string;
  operational_notes: string;
}

