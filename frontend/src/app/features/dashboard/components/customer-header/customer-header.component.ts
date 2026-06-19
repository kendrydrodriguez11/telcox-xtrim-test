import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardData } from '../../../../core/models/consumption.model';

@Component({
  selector: 'app-customer-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer-header.component.html',
  styleUrl: './customer-header.component.scss',
})
export class CustomerHeaderComponent {
  @Input({ required: true }) dashboard!: DashboardData;

  get initials(): string {
    return this.dashboard.customer.name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map(w => w[0]?.toUpperCase() ?? '')
      .join('');
  }
}
