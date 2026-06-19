import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomerHeaderComponent } from './customer-header.component';
import { DashboardData } from '../../../../core/models/consumption.model';

describe('CustomerHeaderComponent', () => {
  let component: CustomerHeaderComponent;
  let fixture: ComponentFixture<CustomerHeaderComponent>;

  const mockDashboard: DashboardData = {
    customer: {
      id: 1,
      name: 'Maria Gonzalez',
      phone_number: '555-0001',
      account_number: 'ACC-001',
      email: 'maria@test.com',
      plan_name: 'Plan Basico',
    },
    balance: { amount: 38.50, currency: 'USD' },
    data_consumption: {
      used_mb: 25600,
      total_mb: 51200,
      used_gb: 25,
      total_gb: 50,
      percentage: 50,
      period_start: '2024-01-01',
      period_end: '2024-01-31',
    },
    minute_consumption: {
      used: 100,
      total: 300,
      percentage: 33.33,
      period_start: '2024-01-01',
      period_end: '2024-01-31',
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerHeaderComponent);
    component = fixture.componentInstance;
    component.dashboard = mockDashboard;
    fixture.detectChanges();
  });

  it('se crea correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('recibe el dashboard como input', () => {
    expect(component.dashboard.customer.id).toBe(1);
  });

  describe('initials', () => {
    it('retorna las dos primeras iniciales en mayusculas', () => {
      expect(component.initials).toBe('MG');
    });

    it('retorna una inicial si el nombre tiene una sola palabra', () => {
      component.dashboard = {
        ...mockDashboard,
        customer: { ...mockDashboard.customer, name: 'Maria' },
      };
      expect(component.initials).toBe('M');
    });

    it('usa solo las dos primeras palabras cuando el nombre tiene mas', () => {
      component.dashboard = {
        ...mockDashboard,
        customer: { ...mockDashboard.customer, name: 'Juan Carlos Perez' },
      };
      expect(component.initials).toBe('JC');
    });

    it('convierte a mayusculas aunque el nombre este en minusculas', () => {
      component.dashboard = {
        ...mockDashboard,
        customer: { ...mockDashboard.customer, name: 'ana torres' },
      };
      expect(component.initials).toBe('AT');
    });

    it('maneja espacios extra entre palabras', () => {
      component.dashboard = {
        ...mockDashboard,
        customer: { ...mockDashboard.customer, name: 'Ana   Torres' },
      };
      expect(component.initials).toBe('AT');
    });
  });
});
