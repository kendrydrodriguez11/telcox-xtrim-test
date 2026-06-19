# TelcoX - Portal de Autogestion

Plataforma de autogestion para clientes de telecomunicaciones. Permite visualizar en tiempo real el saldo de cuenta, el consumo de datos y el consumo de minutos, integrándose con un sistema BSS simulado mediante una API RESTful.

---

## Clonar el repositorio

```bash
git clone https://github.com/kendrydrodriguez11/telcox-xtrim-test
cd telcox-xtrim-test
```

A partir de aqui puedes levantar el proyecto con Docker (recomendado) o de forma manual siguiendo las secciones de abajo.

---

## Requisitos

- Python 3.11+
- Node.js 18+ y npm 9+
- MySQL 8+
- Docker y Docker Compose (opcional)

---

## Ejecucion con Docker

La forma mas rapida de levantar todo el sistema sin configuracion manual.

> Docker Desktop debe estar abierto y corriendo en segundo plano antes de ejecutar cualquier comando de Docker.

Desde la raiz del proyecto, donde esta el archivo `docker-compose.yml`:

```bash
docker compose up --build
```

Esto construye las imagenes, levanta MySQL, el backend y el frontend en orden. La primera vez tarda unos minutos mientras descarga las imagenes base y compila el proyecto Angular.

| Servicio | URL |
|----------|-----|
| Frontend | http://localhost:4200 |
| Backend API | http://localhost:5000/bss/health |

### Detener los servicios

```bash
docker compose down
```

Para tambien eliminar los datos de la base de datos:

```bash
docker compose down -v
```

### Notas sobre el entorno Docker

- El backend usa **gunicorn** en lugar del servidor de desarrollo de Flask.
- El frontend es servido por **Nginx**, que ademas hace proxy de las llamadas a `/bss/` hacia el backend, por lo que el browser solo habla con un unico origen.
- La base de datos se popula automaticamente al arrancar el backend por primera vez.
- Los datos de MySQL se persisten en el volumen `mysql_data` entre reinicios.

---

## Configuracion Manual

### Backend

#### 1. Crear la base de datos MySQL

```sql
CREATE DATABASE telcox_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

#### 2. Instalar dependencias

```bash
cd backend
python -m venv venv
```

Activar el entorno virtual:

```bash
# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate
```

```bash
pip install -r requirements.txt
```

#### 3. Crear el archivo de variables de entorno

El proyecto requiere un archivo `.env` dentro de la carpeta `backend/`. Crearlo a partir de la plantilla incluida:

**En Windows (PowerShell):**
```powershell
Copy-Item .env.example .env
```

**En macOS / Linux:**
```bash
cp .env.example .env
```

Luego reemplazar los valores con las credenciales reales de MySQL:

```env
SECRET_KEY=telcox-bss-change-in-production
DATABASE_URL=mysql+pymysql://root:tu_contrasena@localhost/telcox_db
FLASK_ENV=development
```

> El archivo `.env` nunca debe subirse al repositorio. Solo `.env.example` se versiona.

#### 4. Poblar la base de datos

```bash
python seed.py
```

#### 5. Iniciar el servidor

```bash
python run.py
```

El servidor queda disponible en `http://localhost:5000`.

---

### Frontend

#### 1. Instalar dependencias

```bash
cd frontend
npm install
```

#### 2. Iniciar el servidor de desarrollo

```bash
npm start
```

La aplicacion queda disponible en `http://localhost:4200`.

---

## Ejecucion de Pruebas

### Backend

```bash
cd backend
pytest tests/ -v
```

Salida esperada:

```
tests/test_consumption.py::TestHealth::test_returns_operational_status PASSED
tests/test_consumption.py::TestCustomerList::test_returns_customer_list PASSED
tests/test_consumption.py::TestCustomerList::test_customer_has_required_fields PASSED
tests/test_consumption.py::TestCustomerDashboard::test_returns_dashboard_data PASSED
...
```

Las pruebas utilizan SQLite en memoria, por lo que no requieren MySQL.

### Frontend

```bash
cd frontend
npm test
```

Esto lanza Karma en Chrome y ejecuta los tests de Jasmine. Los tests cubren:

- `ConsumptionService` — peticiones HTTP, URLs, mapeo de respuestas
- `errorInterceptor` — manejo de errores 0, 404, 500 y mensajes del servidor
- `NameInitialsPipe` — generacion de iniciales en todos los casos borde
- `UsageCardComponent` — logica de statusClass, remaining y strokeDashoffset
- `BalanceCardComponent` — renderizado de monto y moneda
- `CustomerHeaderComponent` — calculo de iniciales del cliente
- `CustomerSelectorComponent` — emision de eventos al seleccionar
- `DashboardComponent` — carga inicial, cambio de cliente, refresh y errores

Para ejecutar una sola vez sin modo watch:

```bash
npm test -- --watch=false
```

---

## Datos de Prueba

El comando `seed.py` inserta cuatro clientes con distintos niveles de consumo para facilitar la revision visual de todos los estados del sistema (normal, advertencia, critico).

| Cliente | Plan | Consumo Datos | Consumo Minutos |
|---------|------|--------------|-----------------|
| Maria Gonzalez | Fibra 200 Mbps | 50% | 32% |
| Carlos Mendoza | Movil Plus 50 GB | 90% | 96% |
| Ana Rodriguez | Empresarial 500 GB | 6% | 5% |
| Roberto Torres | Basico 10 GB | 95% | 97.5% |

---

## Arquitectura

```
telcox/
├── backend/       # API REST en Flask + SQLAlchemy + MySQL
└── frontend/      # SPA en Angular 17 + Bootstrap 5
```

**Flujo de datos:**
```
Usuario -> Angular (4200) -> Flask API /bss/* (5000) -> MySQL
```

---

## Documentacion de la API

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| GET | `/bss/health` | Estado del servicio |
| GET | `/bss/customers` | Lista de clientes |
| GET | `/bss/customers/{id}/dashboard` | Panel completo del cliente |
| GET | `/bss/customers/{id}/balance` | Saldo de cuenta |
| GET | `/bss/customers/{id}/consumption` | Consumo de datos y minutos |

La documentacion interactiva de la API esta disponible en `http://localhost:5000/docs` una vez levantado el backend. Permite explorar y probar cada endpoint directamente desde el browser.

---

## Construccion para Produccion (sin Docker)

```bash
cd frontend
npm run build
```

Los archivos estaticos quedan en `frontend/dist/telcox-frontend/browser/`.

---

## Integracion Continua

El repositorio incluye un workflow de GitHub Actions en `.github/workflows/ci.yml` que corre automaticamente en cada push o pull request a `main`. Ejecuta en paralelo las pruebas del backend (pytest) y del frontend (ng test en Chrome headless).
