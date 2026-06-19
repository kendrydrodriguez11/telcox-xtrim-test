import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BalanceCardComponent } from './balance-card.component';
import { AccountBalance } from '../../../../core/models/consumption.model';

describe('BalanceCardComponent', () => {
  let component: BalanceCardComponent;
  let fixture: ComponentFixture<BalanceCardComponent>;

  const mockBalance: AccountBalance = { amount: 38.50, currency: 'USD' };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BalanceCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BalanceCardComponent);
    component = fixture.componentInstance;
    component.balance = mockBalance;
    fixture.detectChanges();
  });

  it('se crea correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('recibe el balance como input', () => {
    expect(component.balance.amount).toBe(38.50);
    expect(component.balance.currency).toBe('USD');
  });

  it('muestra la moneda en el template', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('USD');
  });

  it('muestra el monto en el template', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('38.50');
  });

  it('actualiza el template cuando cambia el balance', () => {
    component.balance = { amount: 100.00, currency: 'EUR' };
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('EUR');
    expect(el.textContent).toContain('100.00');
  });

  it('muestra saldo en cero correctamente', () => {
    component.balance = { amount: 0, currency: 'USD' };
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('0.00');
  });
});
