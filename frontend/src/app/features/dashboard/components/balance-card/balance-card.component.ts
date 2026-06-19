import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountBalance } from '../../../../core/models/consumption.model';

@Component({
  selector: 'app-balance-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './balance-card.component.html',
  styleUrl: './balance-card.component.scss',
})
export class BalanceCardComponent {
  @Input({ required: true }) balance!: AccountBalance;
}
