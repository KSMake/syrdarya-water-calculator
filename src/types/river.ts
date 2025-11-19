export interface RiverPost {
  id: string;
  post_name: string;
  post_type: string;
  order_index: number;
  accumulated_distance_km: number;
  segment_distance_km: number;
  min_time_hours: number | null;
  max_time_hours: number | null;
  segment_min_time_hours: number | null;
  segment_max_time_hours: number | null;
  is_reset_point: boolean;
  max_flow_rate: number | null;
  notes: string | null;
  created_at: string;
}

export interface FlowCalculationResult {
  distance_km: number;
  min_time_hours: number;
  max_time_hours: number;
  avg_time_hours: number;
  min_time_formatted: string;
  max_time_formatted: string;
  avg_time_formatted: string;
  hasResetPoint: boolean;
  resetPointName?: string;
}
