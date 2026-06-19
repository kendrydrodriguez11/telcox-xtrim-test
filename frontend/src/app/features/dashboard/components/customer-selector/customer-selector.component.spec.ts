import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomerSelectorComponent } from './customer-selector.component';
import { Customer } from '../../../../core/models/customer.model';

describe('CustomerSelectorComponent', () => {
  let component: CustomerSelectorComponent;
  let fixture: ComponentFixture<CustomerSelectorComponent>;

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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerSelectorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerSelectorComponent);
    component = fixture.componentInstance;
    component.customers = mockCustomers;
    component.selectedCustomer = mockCustomers[0];
    fixture.detectChanges();
  });

  it('se crea correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('recibe la lista de clientes como input', () => {
    expect(component.customers.length).toBe(2);
  });

  it('recibe el cliente seleccionado como input', () => {
    expect(component.selectedCustomer?.id).toBe(1);
  });

  it('emite el cliente al llamar a select y cierra el panel', () => {
    let emitted: Customer | undefined;
    component.customerSelected.subscribe((c: Customer) => (emitted = c));
    component.expanded.set(true);

    component.select(mockCustomers[1]);

    expect(emitted).toEqual(mockCustomers[1]);
    expect(component.expanded()).toBeFalse();
  });

  it('emite el cliente correcto cuando hay varios en la lista', () => {
    const emitted: Customer[] = [];
    component.customerSelected.subscribe((c: Customer) => emitted.push(c));

    component.select(mockCustomers[0]);
    component.select(mockCustomers[1]);

    expect(emitted.length).toBe(2);
    expect(emitted[0].id).toBe(1);
    expect(emitted[1].id).toBe(2);
  });

  it('toggle alterna el estado expanded', () => {
    expect(component.expanded()).toBeFalse();
    component.toggle();
    expect(component.expanded()).toBeTrue();
    component.toggle();
    expect(component.expanded()).toBeFalse();
  });

  it('inicializa con expanded en false', () => {
    expect(component.expanded()).toBeFalse();
  });

  it('inicializa con lista de clientes vacia por defecto', () => {
    const fresh = new CustomerSelectorComponent();
    expect(fresh.customers).toEqual([]);
  });

  it('inicializa sin cliente seleccionado por defecto', () => {
    const fresh = new CustomerSelectorComponent();
    expect(fresh.selectedCustomer).toBeNull();
  });
});
