import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { DashboardComponent } from './dashboard.component';
import { ConsumptionService } from '../../core/services/consumption.service';
import { Customer } from '../../core/models/customer.model';
import { DashboardData } from '../../core/models/consumption.model';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let serviceSpy: jasmine.SpyObj<ConsumptionService>;

  const mockCustomers: Customer[] = [
    {
      id: 1,
      name: 'Maria Gonzalez',
      phone_number: '555-0001',
      account_number: 'ACC-001',
      email: 'maria@test.com',
      plan_name: 'Plan Basico',
    },
    {
      id: 2,
      name: 'Carlos Mendoza',
      phone_number: '555-0002',
      account_number: 'ACC-002',
      email: 'carlos@test.com',
      plan_name: 'Plan Plus',
    },
  ];

  const mockDashboard: DashboardData = {
    customer: mockCustomers[0],
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
    serviceSpy = jasmine.createSpyObj('ConsumptionService', [
      'getCustomers',
      'getCustomerDashboard',
    ]);
    serviceSpy.getCustomers.and.returnValue(
      of({ customers: mockCustomers, total: 2 })
    );
    serviceSpy.getCustomerDashboard.and.returnValue(of(mockDashboard));

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [{ provide: ConsumptionService, useValue: serviceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('se crea correctamente', () => {
    expect(component).toBeTruthy();
  });

  describe('carga inicial', () => {
    it('llama a getCustomers al iniciar', () => {
      expect(serviceSpy.getCustomers).toHaveBeenCalledTimes(1);
    });

    it('carga la lista de clientes', () => {
      expect(component.customers().length).toBe(2);
    });

    it('selecciona el primer cliente automaticamente', () => {
      expect(component.selectedCustomer()?.id).toBe(1);
    });

    it('carga el dashboard del primer cliente automaticamente', () => {
      expect(serviceSpy.getCustomerDashboard).toHaveBeenCalledWith(1);
      expect(component.dashboard()).toEqual(mockDashboard);
    });

    it('no esta en estado de carga al terminar', () => {
      expect(component.loadingCustomers()).toBeFalse();
      expect(component.loadingDashboard()).toBeFalse();
    });
  });

  describe('selectCustomer', () => {
    it('cambia el cliente seleccionado', () => {
      component.selectCustomer(mockCustomers[1]);
      expect(component.selectedCustomer()?.id).toBe(2);
    });

    it('carga el dashboard del nuevo cliente', () => {
      component.selectCustomer(mockCustomers[1]);
      expect(serviceSpy.getCustomerDashboard).toHaveBeenCalledWith(2);
    });

    it('no recarga si se selecciona el mismo cliente', () => {
      const callCount = serviceSpy.getCustomerDashboard.calls.count();
      component.selectCustomer(mockCustomers[0]);
      expect(serviceSpy.getCustomerDashboard.calls.count()).toBe(callCount);
    });

    it('limpia el error al cambiar de cliente', () => {
      component.error.set('Error previo');
      serviceSpy.getCustomerDashboard.and.returnValue(of(mockDashboard));
      component.selectCustomer(mockCustomers[1]);
      expect(component.error()).toBeNull();
    });
  });

  describe('refreshDashboard', () => {
    it('recarga el dashboard del cliente actual', () => {
      const callCount = serviceSpy.getCustomerDashboard.calls.count();
      component.refreshDashboard();
      expect(serviceSpy.getCustomerDashboard.calls.count()).toBe(callCount + 1);
      expect(serviceSpy.getCustomerDashboard).toHaveBeenCalledWith(1);
    });

    it('no hace nada si no hay cliente seleccionado', () => {
      component.selectedCustomer.set(null);
      const callCount = serviceSpy.getCustomerDashboard.calls.count();
      component.refreshDashboard();
      expect(serviceSpy.getCustomerDashboard.calls.count()).toBe(callCount);
    });
  });

  describe('manejo de errores', () => {
    it('registra el error si getCustomers falla', () => {
      serviceSpy.getCustomers.and.returnValue(
        throwError(() => ({ message: 'Error de red' }))
      );
      component.ngOnInit();
      expect(component.error()).toBe('Error de red');
    });

    it('registra el error si getCustomerDashboard falla', () => {
      serviceSpy.getCustomerDashboard.and.returnValue(
        throwError(() => ({ message: 'Error del servidor' }))
      );
      component.selectCustomer(mockCustomers[1]);
      expect(component.error()).toBe('Error del servidor');
    });

    it('detiene el estado de carga aunque falle la peticion', () => {
      serviceSpy.getCustomerDashboard.and.returnValue(
        throwError(() => ({ message: 'fallo' }))
      );
      component.selectCustomer(mockCustomers[1]);
      expect(component.loadingDashboard()).toBeFalse();
    });
  });

  describe('initialLoading', () => {
    it('es true cuando esta cargando y no hay dashboard', () => {
      component.dashboard.set(null);
      component.loadingDashboard.set(true);
      expect(component.initialLoading()).toBeTrue();
    });

    it('es false cuando ya hay datos aunque siga cargando', () => {
      component.loadingDashboard.set(true);
      expect(component.initialLoading()).toBeFalse();
    });

    it('es false cuando no esta cargando', () => {
      component.dashboard.set(null);
      component.loadingDashboard.set(false);
      expect(component.initialLoading()).toBeFalse();
    });
  });
});
