import { NameInitialsPipe } from './name-initials.pipe';

describe('NameInitialsPipe', () => {
  let pipe: NameInitialsPipe;

  beforeEach(() => {
    pipe = new NameInitialsPipe();
  });

  it('se crea correctamente', () => {
    expect(pipe).toBeTruthy();
  });

  it('retorna las iniciales de un nombre con dos palabras', () => {
    expect(pipe.transform('Maria Gonzalez')).toBe('MG');
  });

  it('retorna una sola inicial si el nombre tiene una palabra', () => {
    expect(pipe.transform('Carlos')).toBe('C');
  });

  it('usa solo las dos primeras palabras cuando el nombre tiene mas', () => {
    expect(pipe.transform('Juan Carlos Perez Lopez')).toBe('JC');
  });

  it('convierte las iniciales a mayusculas', () => {
    expect(pipe.transform('ana torres')).toBe('AT');
  });

  it('retorna ? cuando el nombre es vacio', () => {
    expect(pipe.transform('')).toBe('?');
  });

  it('retorna ? cuando el nombre es solo espacios', () => {
    expect(pipe.transform('   ')).toBe('?');
  });

  it('maneja espacios extra entre palabras', () => {
    expect(pipe.transform('Maria   Gonzalez')).toBe('MG');
  });
});
