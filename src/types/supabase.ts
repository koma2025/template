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
      announcements: {
        Row: {
          content: string
          date: string
          id: string
          important: boolean
          kelurahan: string
          title: string
        }
        Insert: {
          content: string
          date: string
          id?: string
          important?: boolean
          kelurahan: string
          title: string
        }
        Update: {
          content?: string
          date?: string
          id?: string
          important?: boolean
          kelurahan?: string
          title?: string
        }
        Relationships: []
      }
      candidates: {
        Row: {
          background: string
          experience: string
          id: string
          kelurahan: string
          misi: string[]
          name: string
          photo: string
          visi: string
          votes: number
        }
        Insert: {
          background: string
          experience: string
          id?: string
          kelurahan: string
          misi: string[]
          name: string
          photo: string
          visi: string
          votes?: number
        }
        Update: {
          background?: string
          experience?: string
          id?: string
          kelurahan?: string
          misi?: string[]
          name?: string
          photo?: string
          visi?: string
          votes?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          has_voted: boolean
          id: string
          is_admin: boolean
          kelurahan: string
          name: string
          nik: string
        }
        Insert: {
          created_at?: string | null
          has_voted?: boolean
          id: string
          is_admin?: boolean
          kelurahan: string
          name: string
          nik: string
        }
        Update: {
          created_at?: string | null
          has_voted?: boolean
          id?: string
          is_admin?: boolean
          kelurahan?: string
          name?: string
          nik?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_candidate_votes: {
        Args: {
          candidate_id: string
        }
        Returns: {
          background: string
          experience: string
          id: string
          kelurahan: string
          misi: string[]
          name: string
          photo: string
          visi: string
          votes: number
        }
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
