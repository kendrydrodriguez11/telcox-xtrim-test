import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Customer } from '../../../../core/models/customer.model';
import { NameInitialsPipe } from '../../../../shared/pipes/name-initials.pipe';

@Component({
  selector: 'app-customer-selector',
  standalone: true,
  imports: [CommonModule, NameInitialsPipe],
  templateUrl: './customer-selector.component.html',
  styleUrl: './customer-selector.component.scss',
})
export class CustomerSelectorComponent {
  @Input() customers: Customer[] = [];
  @Input() selectedCustomer: Customer | null = null;
  @Output() customerSelected = new EventEmitter<Customer>();

  readonly expanded = signal(false);

  toggle(): void {
    this.expanded.set(!this.expanded());
  }

  select(customer: Customer): void {
    this.customerSelected.emit(customer);
    this.expanded.set(false);
  }
}
