import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Customer, CustomerListData } from '../models/customer.model';
import { DashboardData, AccountBalance, DataConsumption, MinuteConsumption } from '../models/consumption.model';

@Injectable({ providedIn: 'root' })
export class ConsumptionService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/bss`;

  getCustomers(): Observable<CustomerListData> {
    return this.http
      .get<ApiResponse<CustomerListData>>(`${this.baseUrl}/customers`)
      .pipe(map(res => res.data));
  }

  getCustomerDashboard(customerId: number): Observable<DashboardData> {
    return this.http
      .get<ApiResponse<DashboardData>>(`${this.baseUrl}/customers/${customerId}/dashboard`)
      .pipe(map(res => res.data));
  }

  getCustomerBalance(customerId: number): Observable<AccountBalance> {
    return this.http
      .get<ApiResponse<AccountBalance>>(`${this.baseUrl}/customers/${customerId}/balance`)
      .pipe(map(res => res.data));
  }

  getCustomerConsumption(customerId: number): Observable<{ data: DataConsumption; minutes: MinuteConsumption }> {
    return this.http
      .get<ApiResponse<{ data: DataConsumption; minutes: MinuteConsumption }>>(
        `${this.baseUrl}/customers/${customerId}/consumption`
      )
      .pipe(map(res => res.data));
  }
}
