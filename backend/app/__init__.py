from flask import Flask
from flasgger import Swagger
from .config import config
from .extensions import db, cors

_swagger_config = {
    'headers': [],
    'specs': [
        {
            'endpoint': 'apispec',
            'route': '/apispec.json',
            'rule_filter': lambda rule: True,
            'model_filter': lambda tag: True,
        }
    ],
    'static_url_path': '/flasgger_static',
    'swagger_ui': True,
    'specs_route': '/docs',
}

_swagger_template = {
    'swagger': '2.0',
    'info': {
        'title': 'TelcoX BSS API',
        'description': (
            'API REST que simula un sistema BSS (Business Support System) '
            'para la visualizacion de consumo de clientes TelcoX. '
            'Expone endpoints para consultar saldo, consumo de datos y consumo de minutos.'
        ),
        'version': '1.0.0',
    },
    'basePath': '/',
    'schemes': ['http'],
    'tags': [
        {'name': 'Sistema', 'description': 'Estado del servicio'},
        {'name': 'Clientes', 'description': 'Listado de clientes registrados'},
        {'name': 'Consumo', 'description': 'Saldo, datos y minutos por cliente'},
    ],
}


def create_app(config_name: str = 'default') -> Flask:
    app = Flask(__name__)
    app.config.from_object(config[config_name])

    db.init_app(app)
    cors.init_app(app, resources={
        r'/bss/*': {
            'origins': ['http://localhost:4200', 'http://127.0.0.1:4200']
        }
    })

    from .bss import bss_blueprint
    app.register_blueprint(bss_blueprint, url_prefix='/bss')

    Swagger(app, config=_swagger_config, template=_swagger_template)

    return app
