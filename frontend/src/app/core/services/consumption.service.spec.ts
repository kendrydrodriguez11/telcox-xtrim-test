import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ConsumptionService } from './consumption.service';
import { environment } from '../../../environments/environment';
import { Customer } from '../models/customer.model';
import { DashboardData } from '../models/consumption.model';

describe('ConsumptionService', () => {
  let service: ConsumptionService;
  let httpMock: HttpTestingController;

  const baseUrl = `${environment.apiUrl}/bss`;

  const mockCustomer: Customer = {
    id: 1,
    name: 'Maria Gonzalez',
    phone_number: '555-0001',
    account_number: 'ACC-001',
    email: 'maria@test.com',
    plan_name: 'Plan Basico',
  };

  const mockDashboard: DashboardData = {
    customer: mockCustomer,
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

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(ConsumptionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('se crea correctamente', () => {
    expect(service).toBeTruthy();
  });

  describe('getCustomers', () => {
    it('hace GET a /bss/customers y retorna la lista', () => {
      const mockResponse = {
        success: true,
        data: { customers: [mockCustomer], total: 1 },
      };

      service.getCustomers().subscribe(result => {
        expect(result.customers.length).toBe(1);
        expect(result.total).toBe(1);
        expect(result.customers[0].name).toBe('Maria Gonzalez');
      });

      const req = httpMock.expectOne(`${baseUrl}/customers`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('mapea correctamente el campo data de la respuesta', () => {
      const mockResponse = {
        success: true,
        data: { customers: [mockCustomer, { ...mockCustomer, id: 2 }], total: 2 },
      };

      service.getCustomers().subscribe(result => {
        expect(result.total).toBe(2);
      });

      httpMock.expectOne(`${baseUrl}/customers`).flush(mockResponse);
    });
  });

  describe('getCustomerDashboard', () => {
    it('hace GET a /bss/customers/:id/dashboard', () => {
      const mockResponse = { success: true, data: mockDashboard };

      service.getCustomerDashboard(1).subscribe(result => {
        expect(result.customer.id).toBe(1);
        expect(result.balance.amount).toBe(38.50);
        expect(result.balance.currency).toBe('USD');
      });

      const req = httpMock.expectOne(`${baseUrl}/customers/1/dashboard`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('retorna los datos de consumo de datos', () => {
      const mockResponse = { success: true, data: mockDashboard };

      service.getCustomerDashboard(1).subscribe(result => {
        expect(result.data_consumption.used_gb).toBe(25);
        expect(result.data_consumption.total_gb).toBe(50);
        expect(result.data_consumption.percentage).toBe(50);
      });

      httpMock.expectOne(`${baseUrl}/customers/1/dashboard`).flush(mockResponse);
    });

    it('retorna los datos de consumo de minutos', () => {
      const mockResponse = { success: true, data: mockDashboard };

      service.getCustomerDashboard(1).subscribe(result => {
        expect(result.minute_consumption.used).toBe(100);
        expect(result.minute_consumption.total).toBe(300);
      });

      httpMock.expectOne(`${baseUrl}/customers/1/dashboard`).flush(mockResponse);
    });

    it('usa el id del cliente en la URL', () => {
      const mockResponse = { success: true, data: mockDashboard };

      service.getCustomerDashboard(5).subscribe();

      const req = httpMock.expectOne(`${baseUrl}/customers/5/dashboard`);
      expect(req.request.url).toContain('/customers/5/dashboard');
      req.flush(mockResponse);
    });
  });

  describe('getCustomerBalance', () => {
    it('hace GET a /bss/customers/:id/balance', () => {
      const mockResponse = { success: true, data: { amount: 38.50, currency: 'USD' } };

      service.getCustomerBalance(1).subscribe(result => {
        expect(result.amount).toBe(38.50);
        expect(result.currency).toBe('USD');
      });

      const req = httpMock.expectOne(`${baseUrl}/customers/1/balance`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('getCustomerConsumption', () => {
    it('hace GET a /bss/customers/:id/consumption', () => {
      const mockResponse = {
        success: true,
        data: {
          data: mockDashboard.data_consumption,
          minutes: mockDashboard.minute_consumption,
        },
      };

      service.getCustomerConsumption(1).subscribe(result => {
        expect(result.data.used_gb).toBe(25);
        expect(result.minutes.used).toBe(100);
      });

      const req = httpMock.expectOne(`${baseUrl}/customers/1/consumption`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });
});
