/**
 * WHOLLY — Supabase Database Types
 *
 * Auto-generated type definitions for the Supabase database schema.
 * These types are used by the Supabase client for type-safe queries.
 */

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          first_name: string;
          age: number;
          city: string;
          denomination: string;
          gender: 'male' | 'female';
          bio: string | null;
          photo_url: string | null;
          community_familiarity_score: number | null;
          is_demo: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          first_name: string;
          age: number;
          city: string;
          denomination: string;
          gender: 'male' | 'female';
          bio?: string | null;
          photo_url?: string | null;
          community_familiarity_score?: number | null;
          is_demo?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };

      onboarding_answers: {
        Row: {
          id: string;
          profile_id: string;
          section: string;
          answers: Record<string, any>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          section: string;
          answers: Record<string, any>;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['onboarding_answers']['Insert']>;
      };

      compatibility_scores: {
        Row: {
          id: string;
          user_id: string;
          match_id: string;
          spiritual: number;
          emotional: number;
          intellectual: number;
          life_vision: number;
          overall: number;
          tier: 'exceptional' | 'strong' | 'compatible' | 'below';
          calculated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          match_id: string;
          spiritual: number;
          emotional: number;
          intellectual: number;
          life_vision: number;
          overall: number;
          tier: 'exceptional' | 'strong' | 'compatible' | 'below';
          calculated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['compatibility_scores']['Insert']>;
      };

      matches: {
        Row: {
          id: string;
          user_a: string;
          user_b: string;
          user_a_interested: boolean | null;
          user_b_interested: boolean | null;
          status: 'pending' | 'mutual' | 'declined';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_a: string;
          user_b: string;
          user_a_interested?: boolean | null;
          user_b_interested?: boolean | null;
          status?: 'pending' | 'mutual' | 'declined';
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['matches']['Insert']>;
      };

      conversations: {
        Row: {
          id: string;
          match_id: string;
          created_at: string;
          last_message_at: string | null;
        };
        Insert: {
          id?: string;
          match_id: string;
          created_at?: string;
          last_message_at?: string | null;
        };
        Update: Partial<Database['public']['Tables']['conversations']['Insert']>;
      };

      messages: {
        Row: {
          id: string;
          conversation_id: string;
          sender_id: string;
          content: string;
          read_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          sender_id: string;
          content: string;
          read_at?: string | null;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['messages']['Insert']>;
      };

      churches: {
        Row: {
          id: string;
          name: string;
          slug: string;
          city: string;
          state: string;
          country: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          city: string;
          state: string;
          country: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['churches']['Insert']>;
      };

      analytics_events: {
        Row: {
          id: string;
          event_name: string;
          properties: Record<string, any>;
          user_id: string | null;
          session_id: string | null;
          platform: string;
          screen_name: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_name: string;
          properties?: Record<string, any>;
          user_id?: string | null;
          session_id?: string | null;
          platform?: string;
          screen_name?: string | null;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['analytics_events']['Insert']>;
      };
    };
  };
}

// Convenience type aliases
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type OnboardingAnswer = Database['public']['Tables']['onboarding_answers']['Row'];
export type CompatibilityScore = Database['public']['Tables']['compatibility_scores']['Row'];
export type Match = Database['public']['Tables']['matches']['Row'];
export type Conversation = Database['public']['Tables']['conversations']['Row'];
export type Message = Database['public']['Tables']['messages']['Row'];
export type Church = Database['public']['Tables']['churches']['Row'];
export type AnalyticsEvent = Database['public']['Tables']['analytics_events']['Row'];
export type AnalyticsEventInsert = Database['public']['Tables']['analytics_events']['Insert'];
