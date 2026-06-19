from flask import jsonify, Response


def success_response(data: dict | list, status_code: int = 200) -> tuple[Response, int]:
    return jsonify({'success': True, 'data': data}), status_code


def error_response(message: str, status_code: int = 400, details: str | None = None) -> tuple[Response, int]:
    payload: dict = {'success': False, 'error': {'message': message}}
    if details:
        payload['error']['details'] = details
    return jsonify(payload), status_code
