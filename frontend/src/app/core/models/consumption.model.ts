import { Customer } from './customer.model';

export interface AccountBalance {
  amount: number;
  currency: string;
}

export interface DataConsumption {
  used_mb: number;
  total_mb: number;
  used_gb: number;
  total_gb: number;
  percentage: number;
  period_start: string;
  period_end: string;
}

export interface MinuteConsumption {
  used: number;
  total: number;
  percentage: number;
  period_start: string;
  period_end: string;
}

export interface DashboardData {
  customer: Customer;
  balance: AccountBalance;
  data_consumption: DataConsumption;
  minute_consumption: MinuteConsumption;
}
