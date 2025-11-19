export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      river_posts: {
        Row: {
          id: string
          post_name: string
          post_type: string
          order_index: number
          accumulated_distance_km: number
          segment_distance_km: number
          min_time_hours: number | null
          max_time_hours: number | null
          segment_min_time_hours: number | null
          segment_max_time_hours: number | null
          is_reset_point: boolean
          max_flow_rate: number | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          post_name: string
          post_type: string
          order_index: number
          accumulated_distance_km?: number
          segment_distance_km?: number
          min_time_hours?: number | null
          max_time_hours?: number | null
          segment_min_time_hours?: number | null
          segment_max_time_hours?: number | null
          is_reset_point?: boolean
          max_flow_rate?: number | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          post_name?: string
          post_type?: string
          order_index?: number
          accumulated_distance_km?: number
          segment_distance_km?: number
          min_time_hours?: number | null
          max_time_hours?: number | null
          segment_min_time_hours?: number | null
          segment_max_time_hours?: number | null
          is_reset_point?: boolean
          max_flow_rate?: number | null
          notes?: string | null
          created_at?: string
        }
      }
    }
  }
}
