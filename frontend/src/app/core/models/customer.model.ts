export interface Customer {
  id: number;
  name: string;
  phone_number: string;
  account_number: string;
  email: string;
  plan_name: string;
}

export interface CustomerListData {
  customers: Customer[];
  total: number;
}
