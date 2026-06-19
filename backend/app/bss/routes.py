from . import bss_blueprint
from ..services.consumption_service import ConsumptionService
from ..utils.response_builder import success_response, error_response


@bss_blueprint.get('/health')
def health():
    """
    Estado del servicio BSS
    ---
    tags:
      - Sistema
    responses:
      200:
        description: El servicio esta operativo
        schema:
          type: object
          properties:
            success:
              type: boolean
              example: true
            data:
              type: object
              properties:
                status:
                  type: string
                  example: operational
                service:
                  type: string
                  example: TelcoX BSS API
    """
    return success_response({'status': 'operational', 'service': 'TelcoX BSS API'})


@bss_blueprint.get('/customers')
def list_customers():
    """
    Lista de clientes registrados
    ---
    tags:
      - Clientes
    responses:
      200:
        description: Lista de todos los clientes
        schema:
          type: object
          properties:
            success:
              type: boolean
              example: true
            data:
              type: object
              properties:
                total:
                  type: integer
                  example: 4
                customers:
                  type: array
                  items:
                    type: object
                    properties:
                      id:
                        type: integer
                        example: 1
                      name:
                        type: string
                        example: Maria Gonzalez
                      phone_number:
                        type: string
                        example: "555-0001"
                      account_number:
                        type: string
                        example: ACC-001
                      email:
                        type: string
                        example: maria@telcox.com
                      plan_name:
                        type: string
                        example: Fibra 200 Mbps
    """
    customers = ConsumptionService.get_all_customers()
    return success_response({'customers': customers, 'total': len(customers)})


@bss_blueprint.get('/customers/<int:customer_id>/dashboard')
def get_customer_dashboard(customer_id: int):
    """
    Panel completo de consumo de un cliente
    ---
    tags:
      - Consumo
    parameters:
      - name: customer_id
        in: path
        type: integer
        required: true
        description: ID del cliente
        example: 1
    responses:
      200:
        description: Datos completos del cliente con saldo y consumo
        schema:
          type: object
          properties:
            success:
              type: boolean
              example: true
            data:
              type: object
              properties:
                customer:
                  type: object
                  properties:
                    id:
                      type: integer
                      example: 1
                    name:
                      type: string
                      example: Maria Gonzalez
                    plan_name:
                      type: string
                      example: Fibra 200 Mbps
                balance:
                  type: object
                  properties:
                    amount:
                      type: number
                      example: 38.50
                    currency:
                      type: string
                      example: USD
                data_consumption:
                  type: object
                  properties:
                    used_gb:
                      type: number
                      example: 25.0
                    total_gb:
                      type: number
                      example: 50.0
                    percentage:
                      type: number
                      example: 50.0
                    period_start:
                      type: string
                      example: "2024-01-01"
                    period_end:
                      type: string
                      example: "2024-01-31"
                minute_consumption:
                  type: object
                  properties:
                    used:
                      type: integer
                      example: 100
                    total:
                      type: integer
                      example: 300
                    percentage:
                      type: number
                      example: 33.3
                    period_start:
                      type: string
                      example: "2024-01-01"
                    period_end:
                      type: string
                      example: "2024-01-31"
      404:
        description: Cliente no encontrado
        schema:
          type: object
          properties:
            success:
              type: boolean
              example: false
            error:
              type: object
              properties:
                message:
                  type: string
                  example: Cliente no encontrado.
    """
    dashboard = ConsumptionService.get_customer_dashboard(customer_id)
    if not dashboard:
        return error_response('Cliente no encontrado.', 404)
    return success_response(dashboard)


@bss_blueprint.get('/customers/<int:customer_id>/balance')
def get_customer_balance(customer_id: int):
    """
    Saldo de cuenta de un cliente
    ---
    tags:
      - Consumo
    parameters:
      - name: customer_id
        in: path
        type: integer
        required: true
        description: ID del cliente
        example: 1
    responses:
      200:
        description: Saldo disponible del cliente
        schema:
          type: object
          properties:
            success:
              type: boolean
              example: true
            data:
              type: object
              properties:
                amount:
                  type: number
                  example: 38.50
                currency:
                  type: string
                  example: USD
      404:
        description: Cliente no encontrado
        schema:
          type: object
          properties:
            success:
              type: boolean
              example: false
            error:
              type: object
              properties:
                message:
                  type: string
                  example: Cliente no encontrado.
    """
    balance = ConsumptionService.get_customer_balance(customer_id)
    if balance is None:
        return error_response('Cliente no encontrado.', 404)
    return success_response(balance)


@bss_blueprint.get('/customers/<int:customer_id>/consumption')
def get_customer_consumption(customer_id: int):
    """
    Consumo de datos y minutos de un cliente
    ---
    tags:
      - Consumo
    parameters:
      - name: customer_id
        in: path
        type: integer
        required: true
        description: ID del cliente
        example: 1
    responses:
      200:
        description: Consumo de datos moviles y minutos de voz
        schema:
          type: object
          properties:
            success:
              type: boolean
              example: true
            data:
              type: object
              properties:
                data:
                  type: object
                  properties:
                    used_gb:
                      type: number
                      example: 25.0
                    total_gb:
                      type: number
                      example: 50.0
                    percentage:
                      type: number
                      example: 50.0
                minutes:
                  type: object
                  properties:
                    used:
                      type: integer
                      example: 100
                    total:
                      type: integer
                      example: 300
                    percentage:
                      type: number
                      example: 33.3
      404:
        description: Cliente no encontrado
        schema:
          type: object
          properties:
            success:
              type: boolean
              example: false
            error:
              type: object
              properties:
                message:
                  type: string
                  example: Cliente no encontrado.
    """
    consumption = ConsumptionService.get_customer_consumption(customer_id)
    if consumption is None:
        return error_response('Cliente no encontrado.', 404)
    return success_response(consumption)


@bss_blueprint.app_errorhandler(404)
def not_found(_error):
    return error_response('Recurso no encontrado.', 404)


@bss_blueprint.app_errorhandler(500)
def internal_error(_error):
    return error_response('Error interno del servidor.', 500)
