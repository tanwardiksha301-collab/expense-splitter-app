export interface Database {
  public: {
    Tables: {
      participants: {
        Row: {
          id: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          created_at?: string;
        };
      };
      expenses: {
        Row: {
          id: string;
          description: string;
          total_amount: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          description: string;
          total_amount: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          description?: string;
          total_amount?: number;
          created_at?: string;
        };
      };
      expense_participants: {
        Row: {
          id: string;
          expense_id: string;
          participant_id: string;
          amount_owed: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          expense_id: string;
          participant_id: string;
          amount_owed?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          expense_id?: string;
          participant_id?: string;
          amount_owed?: number;
          created_at?: string;
        };
      };
    };
  };
}
