import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsageCardComponent } from './usage-card.component';

describe('UsageCardComponent', () => {
  let component: UsageCardComponent;
  let fixture: ComponentFixture<UsageCardComponent>;

  const setDefaultInputs = (comp: UsageCardComponent) => {
    comp.title = 'Consumo de Datos';
    comp.used = 25;
    comp.total = 50;
    comp.percentage = 50;
    comp.unit = 'GB';
    comp.icon = 'bi-wifi';
    comp.periodStart = '2024-01-01';
    comp.periodEnd = '2024-01-31';
    comp.ngOnChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsageCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UsageCardComponent);
    component = fixture.componentInstance;
    setDefaultInputs(component);
    fixture.detectChanges();
  });

  it('se crea correctamente', () => {
    expect(component).toBeTruthy();
  });

  describe('statusClass', () => {
    it('retorna success cuando el porcentaje es menor a 70', () => {
      component.percentage = 69;
      expect(component.statusClass).toBe('success');
    });

    it('retorna success cuando el porcentaje es 0', () => {
      component.percentage = 0;
      expect(component.statusClass).toBe('success');
    });

    it('retorna warning cuando el porcentaje es exactamente 70', () => {
      component.percentage = 70;
      expect(component.statusClass).toBe('warning');
    });

    it('retorna warning cuando el porcentaje esta entre 70 y 89', () => {
      component.percentage = 80;
      expect(component.statusClass).toBe('warning');
    });

    it('retorna danger cuando el porcentaje es exactamente 90', () => {
      component.percentage = 90;
      expect(component.statusClass).toBe('danger');
    });

    it('retorna danger cuando el porcentaje es 100', () => {
      component.percentage = 100;
      expect(component.statusClass).toBe('danger');
    });
  });

  describe('remaining', () => {
    it('calcula el saldo restante correctamente', () => {
      component.used = 25;
      component.total = 50;
      expect(component.remaining).toBe(25);
    });

    it('retorna 0 cuando el uso supera el total', () => {
      component.used = 60;
      component.total = 50;
      expect(component.remaining).toBe(0);
    });

    it('retorna 0 cuando el uso es igual al total', () => {
      component.used = 50;
      component.total = 50;
      expect(component.remaining).toBe(0);
    });

    it('retorna el total cuando el uso es 0', () => {
      component.used = 0;
      component.total = 100;
      expect(component.remaining).toBe(100);
    });
  });

  describe('strokeDashoffset', () => {
    it('es la circunferencia completa cuando el porcentaje es 0', () => {
      component.percentage = 0;
      component.ngOnChanges();
      expect(component.strokeDashoffset).toBeCloseTo(component.CIRCUMFERENCE, 5);
    });

    it('es 0 cuando el porcentaje es 100', () => {
      component.percentage = 100;
      component.ngOnChanges();
      expect(component.strokeDashoffset).toBeCloseTo(0, 5);
    });

    it('es la mitad de la circunferencia cuando el porcentaje es 50', () => {
      component.percentage = 50;
      component.ngOnChanges();
      expect(component.strokeDashoffset).toBeCloseTo(component.CIRCUMFERENCE / 2, 5);
    });

    it('limita el offset al minimo cuando el porcentaje es negativo', () => {
      component.percentage = -20;
      component.ngOnChanges();
      expect(component.strokeDashoffset).toBeCloseTo(component.CIRCUMFERENCE, 5);
    });

    it('limita el offset a 0 cuando el porcentaje supera 100', () => {
      component.percentage = 150;
      component.ngOnChanges();
      expect(component.strokeDashoffset).toBeCloseTo(0, 5);
    });
  });

  describe('CIRCUMFERENCE', () => {
    it('es 2 * PI * RADIUS', () => {
      const expected = 2 * Math.PI * component.RADIUS;
      expect(component.CIRCUMFERENCE).toBeCloseTo(expected, 5);
    });
  });

  describe('template', () => {
    it('muestra el titulo del componente', () => {
      const el = fixture.nativeElement as HTMLElement;
      expect(el.textContent).toContain('Consumo de Datos');
    });

    it('muestra el porcentaje de uso', () => {
      const el = fixture.nativeElement as HTMLElement;
      expect(el.textContent).toContain('50');
    });
  });
});
