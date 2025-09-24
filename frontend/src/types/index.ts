export interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
}

export interface SupplyCategory {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

export interface Supply {
  id: number;
  name: string;
  category: number;
  category_name?: string;
  description: string;
  unit: string;
  minimum_quantity: number;
  current_quantity: number;
  created_at: string;
  updated_at: string;
}

export interface SupplyTransaction {
  id: number;
  supply: number;
  supply_name?: string;
  transaction_type: "IN" | "OUT";
  quantity: number;
  user: number;
  user_name?: string;
  reason: string;
  date: string;
  created_at: string;
}
