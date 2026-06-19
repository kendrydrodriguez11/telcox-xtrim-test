import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-usage-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './usage-card.component.html',
  styleUrl: './usage-card.component.scss',
})
export class UsageCardComponent implements OnChanges {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) used!: number;
  @Input({ required: true }) total!: number;
  @Input({ required: true }) percentage!: number;
  @Input({ required: true }) unit!: string;
  @Input({ required: true }) icon!: string;
  @Input({ required: true }) periodStart!: string;
  @Input({ required: true }) periodEnd!: string;

  readonly RADIUS = 44;
  readonly CIRCUMFERENCE = 2 * Math.PI * this.RADIUS;

  strokeDashoffset = this.CIRCUMFERENCE;

  ngOnChanges(): void {
    const clamped = Math.min(Math.max(this.percentage, 0), 100);
    this.strokeDashoffset = this.CIRCUMFERENCE - (this.CIRCUMFERENCE * clamped) / 100;
  }

  get statusClass(): string {
    if (this.percentage >= 90) return 'danger';
    if (this.percentage >= 70) return 'warning';
    return 'success';
  }

  get statusLabel(): string {
    if (this.percentage >= 90) return 'Critico';
    if (this.percentage >= 70) return 'Advertencia';
    return 'Normal';
  }

  get remaining(): number {
    return Math.max(this.total - this.used, 0);
  }
}
