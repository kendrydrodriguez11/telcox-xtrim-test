import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptors, HttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { errorInterceptor } from './error.interceptor';

describe('errorInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('retorna error de conexion cuando status es 0', (done) => {
    http.get('/test').subscribe({
      error: err => {
        expect(err.status).toBe(0);
        expect(err.message).toContain('No se pudo conectar con el servidor');
        done();
      },
    });

    httpMock.expectOne('/test').error(new ProgressEvent('error'));
  });

  it('retorna mensaje de recurso no encontrado cuando status es 404', (done) => {
    http.get('/test').subscribe({
      error: err => {
        expect(err.status).toBe(404);
        expect(err.message).toBe('El recurso solicitado no fue encontrado.');
        done();
      },
    });

    httpMock.expectOne('/test').flush({}, { status: 404, statusText: 'Not Found' });
  });

  it('retorna mensaje de error interno cuando status es 500', (done) => {
    http.get('/test').subscribe({
      error: err => {
        expect(err.status).toBe(500);
        expect(err.message).toContain('Error interno del servidor');
        done();
      },
    });

    httpMock.expectOne('/test').flush({}, { status: 500, statusText: 'Internal Server Error' });
  });

  it('usa el mensaje del servidor cuando viene en el cuerpo de la respuesta', (done) => {
    http.get('/test').subscribe({
      error: err => {
        expect(err.message).toBe('Cliente no encontrado en el sistema');
        done();
      },
    });

    httpMock.expectOne('/test').flush(
      { error: { message: 'Cliente no encontrado en el sistema' } },
      { status: 422, statusText: 'Unprocessable Entity' }
    );
  });

  it('retorna mensaje generico para codigos de error no contemplados', (done) => {
    http.get('/test').subscribe({
      error: err => {
        expect(err.message).toContain('Ha ocurrido un error inesperado');
        done();
      },
    });

    httpMock.expectOne('/test').flush({}, { status: 418, statusText: 'I am a teapot' });
  });

  it('incluye el status en el objeto de error', (done) => {
    http.get('/test').subscribe({
      error: err => {
        expect(err.status).toBeDefined();
        expect(typeof err.status).toBe('number');
        done();
      },
    });

    httpMock.expectOne('/test').flush({}, { status: 500, statusText: 'Internal Server Error' });
  });
});
