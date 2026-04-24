// Auto-generated equivalent of: npx supabase gen types typescript
// Manually maintained until Supabase CLI is wired up.

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      addons: {
        Row: {
          id: string
          name: string
          price_rm: number
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          price_rm: number
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          price_rm?: number
          description?: string | null
          created_at?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          event_date: string | null
          guests: string | null
          message: string
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          event_date?: string | null
          guests?: string | null
          message: string
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          event_date?: string | null
          guests?: string | null
          message?: string
          is_read?: boolean
          created_at?: string
        }
        Relationships: []
      }
      blocked_dates: {
        Row: {
          id: string
          venue_id: string
          blocked_date: string
          reason: string | null
          created_at: string
        }
        Insert: {
          id?: string
          venue_id: string
          blocked_date: string
          reason?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          venue_id?: string
          blocked_date?: string
          reason?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "blocked_dates_venue_id_fkey"
            columns: ["venue_id"]
            referencedRelation: "venues"
            referencedColumns: ["id"]
          }
        ]
      }
      booking_addons: {
        Row: {
          id: string
          booking_id: string
          addon_id: string
          price_rm: number
        }
        Insert: {
          id?: string
          booking_id: string
          addon_id: string
          price_rm: number
        }
        Update: {
          id?: string
          booking_id?: string
          addon_id?: string
          price_rm?: number
        }
        Relationships: [
          {
            foreignKeyName: "booking_addons_booking_id_fkey"
            columns: ["booking_id"]
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_addons_addon_id_fkey"
            columns: ["addon_id"]
            referencedRelation: "addons"
            referencedColumns: ["id"]
          }
        ]
      }
      bookings: {
        Row: {
          id: string
          ref: string
          venue_id: string
          package_id: string
          bride_name: string
          groom_name: string
          email: string
          phone: string
          event_date: string
          time_slot: string
          guest_count: string
          theme: string | null
          layout_preference: string | null
          special_requests: string | null
          status: "pending" | "approved" | "rejected"
          total_rm: number | null
          deposit_rm: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          ref: string
          venue_id: string
          package_id: string
          bride_name: string
          groom_name: string
          email: string
          phone: string
          event_date: string
          time_slot: string
          guest_count: string
          theme?: string | null
          layout_preference?: string | null
          special_requests?: string | null
          status?: "pending" | "approved" | "rejected"
          total_rm?: number | null
          deposit_rm?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          ref?: string
          venue_id?: string
          package_id?: string
          bride_name?: string
          groom_name?: string
          email?: string
          phone?: string
          event_date?: string
          time_slot?: string
          guest_count?: string
          theme?: string | null
          layout_preference?: string | null
          special_requests?: string | null
          status?: "pending" | "approved" | "rejected"
          total_rm?: number | null
          deposit_rm?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_venue_id_fkey"
            columns: ["venue_id"]
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_package_id_fkey"
            columns: ["package_id"]
            referencedRelation: "packages"
            referencedColumns: ["id"]
          }
        ]
      }
      packages: {
        Row: {
          id: string
          venue_id: string
          name: string
          price_rm: number
          capacity_max: number | null
          duration_hours: number | null
          created_at: string
        }
        Insert: {
          id?: string
          venue_id: string
          name: string
          price_rm: number
          capacity_max?: number | null
          duration_hours?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          venue_id?: string
          name?: string
          price_rm?: number
          capacity_max?: number | null
          duration_hours?: number | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "packages_venue_id_fkey"
            columns: ["venue_id"]
            referencedRelation: "venues"
            referencedColumns: ["id"]
          }
        ]
      }
      themes: {
        Row: {
          id: string
          name: string
          tagline: string | null
          description: string | null
          image_url: string | null
          price_from_rm: number | null
          mood: string | null
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          tagline?: string | null
          description?: string | null
          image_url?: string | null
          price_from_rm?: number | null
          mood?: string | null
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          tagline?: string | null
          description?: string | null
          image_url?: string | null
          price_from_rm?: number | null
          mood?: string | null
          sort_order?: number
          created_at?: string
        }
        Relationships: []
      }
      venues: {
        Row: {
          id: string
          name: string
          subtitle: string | null
          tag: string | null
          href: string | null
          description: string | null
          capacity_min: number | null
          capacity_max: number | null
          size_sqft: number | null
          ceiling_height_m: number | null
          parking_bays: number | null
          location: string | null
          latitude: number | null
          longitude: number | null
          hero_image_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          subtitle?: string | null
          tag?: string | null
          href?: string | null
          description?: string | null
          capacity_min?: number | null
          capacity_max?: number | null
          size_sqft?: number | null
          ceiling_height_m?: number | null
          parking_bays?: number | null
          location?: string | null
          latitude?: number | null
          longitude?: number | null
          hero_image_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          subtitle?: string | null
          tag?: string | null
          href?: string | null
          description?: string | null
          capacity_min?: number | null
          capacity_max?: number | null
          size_sqft?: number | null
          ceiling_height_m?: number | null
          parking_bays?: number | null
          location?: string | null
          latitude?: number | null
          longitude?: number | null
          hero_image_url?: string | null
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: {
      generate_booking_ref: {
        Args: Record<string, never>
        Returns: string
      }
    }
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"]

export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"]

export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"]
