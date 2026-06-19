import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsumptionService } from '../../core/services/consumption.service';
import { Customer } from '../../core/models/customer.model';
import { DashboardData } from '../../core/models/consumption.model';
import { CustomerHeaderComponent } from './components/customer-header/customer-header.component';
import { BalanceCardComponent } from './components/balance-card/balance-card.component';
import { UsageCardComponent } from './components/usage-card/usage-card.component';
import { CustomerSelectorComponent } from './components/customer-selector/customer-selector.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from '../../shared/components/error-message/error-message.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    CustomerHeaderComponent,
    BalanceCardComponent,
    UsageCardComponent,
    CustomerSelectorComponent,
    LoadingSpinnerComponent,
    ErrorMessageComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private readonly consumptionService = inject(ConsumptionService);

  readonly customers = signal<Customer[]>([]);
  readonly selectedCustomer = signal<Customer | null>(null);
  readonly dashboard = signal<DashboardData | null>(null);

  readonly loadingCustomers = signal(false);
  readonly loadingDashboard = signal(false);
  readonly error = signal<string | null>(null);

  readonly initialLoading = computed(() => this.loadingDashboard() && !this.dashboard());

  ngOnInit(): void {
    this.loadCustomers();
  }

  selectCustomer(customer: Customer): void {
    if (this.selectedCustomer()?.id === customer.id) return;
    this.selectedCustomer.set(customer);
    this.error.set(null);
    this.loadDashboard(customer.id);
  }

  refreshDashboard(): void {
    const customer = this.selectedCustomer();
    if (customer) {
      this.loadDashboard(customer.id);
    }
  }

  private loadCustomers(): void {
    this.loadingCustomers.set(true);
    this.consumptionService.getCustomers().subscribe({
      next: response => {
        this.customers.set(response.customers);
        if (response.customers.length > 0) {
          this.selectCustomer(response.customers[0]);
        }
        this.loadingCustomers.set(false);
      },
      error: err => {
        this.error.set(err.message);
        this.loadingCustomers.set(false);
      },
    });
  }

  private loadDashboard(customerId: number): void {
    this.loadingDashboard.set(true);
    this.consumptionService.getCustomerDashboard(customerId).subscribe({
      next: data => {
        this.dashboard.set(data);
        this.loadingDashboard.set(false);
      },
      error: err => {
        this.error.set(err.message);
        this.loadingDashboard.set(false);
      },
    });
  }
}
