export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          is_guest: boolean
          guest_id: string | null
          rating: number
          games_played: number
          games_won: number
          games_lost: number
          games_drawn: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          is_guest?: boolean
          guest_id?: string | null
          rating?: number
          games_played?: number
          games_won?: number
          games_lost?: number
          games_drawn?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          is_guest?: boolean
          guest_id?: string | null
          rating?: number
          games_played?: number
          games_won?: number
          games_lost?: number
          games_drawn?: number
          created_at?: string
          updated_at?: string
        }
      }
      games: {
        Row: {
          id: string
          player_black: string | null
          player_red: string | null
          status: 'waiting' | 'in_progress' | 'completed' | 'abandoned'
          winner: string | null
          current_turn: string | null
          board_state: Json
          move_history: Json[]
          started_at: string | null
          ended_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          player_black?: string | null
          player_red?: string | null
          status?: 'waiting' | 'in_progress' | 'completed' | 'abandoned'
          winner?: string | null
          current_turn?: string | null
          board_state: Json
          move_history?: Json[]
          started_at?: string | null
          ended_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          player_black?: string | null
          player_red?: string | null
          status?: 'waiting' | 'in_progress' | 'completed' | 'abandoned'
          winner?: string | null
          current_turn?: string | null
          board_state?: Json
          move_history?: Json[]
          started_at?: string | null
          ended_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 