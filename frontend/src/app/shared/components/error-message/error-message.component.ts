import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-error-message',
  standalone: true,
  templateUrl: './error-message.component.html',
  styleUrl: './error-message.component.scss',
})
export class ErrorMessageComponent {
  @Input() message = 'Ha ocurrido un error inesperado.';
  @Output() retry = new EventEmitter<void>();

  get hasRetryListener(): boolean {
    return this.retry.observed;
  }
}
