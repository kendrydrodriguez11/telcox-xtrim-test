from flask import Blueprint

bss_blueprint = Blueprint('bss', __name__)

from . import routes  # noqa: E402, F401
